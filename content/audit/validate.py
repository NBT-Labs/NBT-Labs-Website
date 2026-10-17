#!/usr/bin/env python3
"""
Validator and reference scoring engine for the NBT Labs Operations Barometer.

Run from the nbt-audit directory:  python3 validate.py

Does three jobs:
  1. Validates every bank against schema/question-bank.schema.json.
  2. Checks the cross-references no schema can check: benchmark keys resolve,
     reveals keys are wired into the cost model, routed bank ids exist,
     condition fields point at real questions, FR parity, id uniqueness,
     quiz order integrity, and the barred-vendor prohibition (see
     feedback_nbt_labs_no_zoho in project memory: a non-compete bars NBT from
     that vendor's ecosystem, so it must not appear in client-facing content).
  3. Implements the scoring rules in scoring/scoring.v1.json and runs
     synthetic respondents through them, so the barometer's behaviour at the
     extremes is checked rather than assumed.

The scoring functions here are the reference implementation. Port them, do not
reinvent them: the cap rules in particular are easy to get subtly wrong.
"""

import json
import pathlib
import re
import sys
from collections import defaultdict

ROOT = pathlib.Path(__file__).parent
BANKS = sorted((ROOT / "banks").glob("*.json"))
SCHEMA = json.loads((ROOT / "schema" / "question-bank.schema.json").read_text())
SCORING = json.loads((ROOT / "scoring" / "scoring.v1.json").read_text())
BENCH = json.loads((ROOT / "scoring" / "benchmarks.v1.json").read_text())

errors, warnings = [], []


def err(m):
    errors.append(m)


def warn(m):
    warnings.append(m)


# ---------------------------------------------------------------- load banks

banks = {}
for p in BANKS:
    try:
        banks[p.name] = json.loads(p.read_text())
    except json.JSONDecodeError as e:
        err(f"{p.name}: not valid JSON — {e}")

if not banks:
    print("no banks found")
    sys.exit(1)


# ------------------------------------------------------------ schema check

try:
    import jsonschema

    for attr in ("Draft202012Validator", "Draft201909Validator", "Draft7Validator"):
        Validator = getattr(jsonschema, attr, None)
        if Validator:
            break
    if Validator is None:
        warn("jsonschema is too old to validate this schema — pip install -U jsonschema")
    else:
        if attr != "Draft202012Validator":
            warn(f"falling back to {attr}; some constraints are not enforced. "
                 f"pip install -U jsonschema for a full check")
        v = Validator(SCHEMA)
        for name, bank in banks.items():
            for e in sorted(v.iter_errors(bank), key=lambda e: list(e.path)):
                err(f"{name}: schema: {'/'.join(str(x) for x in e.path)}: {e.message}")
except ImportError:
    warn("jsonschema not installed — structural validation skipped")


# ------------------------------------------------- collect the question index

questions = {}           # id -> (bank_name, question)
by_dimension = defaultdict(list)
for name, bank in banks.items():
    for q in bank.get("questions", []):
        qid = q["id"]
        if qid in questions:
            err(f"duplicate question id {qid} in {name} and {questions[qid][0]}")
        questions[qid] = (name, q)
        by_dimension[q["dimension"]].append(qid)
        if not qid.startswith(bank["bank_id"] + "."):
            err(f"{name}: {qid} does not start with bank_id {bank['bank_id']}")

DIMS = {d["id"]: d for d in SCORING["dimensions"]}
PILLARS = {p["id"]: p for p in SCORING["pillars"]}


# ------------------------------------------------------- cross-reference checks

# 1. Barred-vendor prohibition — hard legal constraint, not a branding preference.
BARRED = "zo" + "ho"
for p in list(BANKS) + [ROOT / "scoring" / "scoring.v1.json", ROOT / "scoring" / "benchmarks.v1.json"]:
    if re.search(BARRED, p.read_text(), re.I):
        err(f"{p.name}: contains a prohibited vendor reference")

# 2. Every dimension used exists; every dimension defined is used.
for dim in by_dimension:
    if dim != "firmographic" and dim not in DIMS:
        err(f"unknown dimension {dim}")
for dim in DIMS:
    if dim not in by_dimension:
        err(f"dimension {dim} is defined in scoring but no question measures it")
    else:
        scored = [
            qid for qid in by_dimension[dim]
            if questions[qid][1].get("weight", 1) > 0
            and questions[qid][1]["type"] != "text"
        ]
        if len(scored) < 2:
            err(f"dimension {dim} has only {len(scored)} scored question(s); "
                f"minimum_coverage requires 2 before it can be reported")

# 3. Every pillar has dimensions.
for pid in PILLARS:
    if not [d for d in DIMS.values() if d["pillar"] == pid]:
        err(f"pillar {pid} has no dimensions")

# 4. benchmark_ref keys resolve.
bench_keys = set(BENCH.get("benchmarks", {})) | set(BENCH.get("regulatory_refs", {}))
bench_keys |= set(BENCH.get("cost_model_constants", {}))
aliases = {k: v for k, v in BENCH.get("benchmark_ref_aliases", {}).items() if k != "note"}
for qid, (name, q) in questions.items():
    ref = q.get("benchmark_ref")
    if not ref:
        continue
    if ref in bench_keys:
        continue
    if ref in aliases:
        target = aliases[ref].split(".")[-1]
        if target not in bench_keys:
            err(f"{qid}: benchmark_ref {ref} aliases to {aliases[ref]}, which does not exist")
        continue
    err(f"{qid}: benchmark_ref '{ref}' is not in benchmarks.v1.json")

# 5. reveals keys are wired into the cost model.
cm_inputs = set()
for group in SCORING["cost_model"]["inputs"].values():
    if isinstance(group, list):
        cm_inputs |= set(group)
declared = set()
for qid, (name, q) in questions.items():
    for k in q.get("reveals", []) or []:
        declared.add(k)
    for o in q.get("options", []) or []:
        for k in (o.get("reveals") or {}):
            declared.add(k)
for k in sorted(declared - cm_inputs):
    warn(f"reveals key '{k}' is produced by a question but not listed in cost_model.inputs")

# 6. Conditions and routes point at things that exist.
bank_ids = {b["bank_id"] for b in banks.values()}
for name, bank in banks.items():
    for cond in bank.get("applies_when", []) or []:
        f = cond["field"]
        if not f.startswith("firmo.") and f not in questions:
            err(f"{name}: applies_when references unknown field {f}")
    for dim in (bank.get("reweight") or {}):
        if dim not in DIMS:
            err(f"{name}: reweight references unknown dimension {dim}")
for qid, (name, q) in questions.items():
    for cond in q.get("show_when", []) or []:
        if cond["field"] not in questions:
            err(f"{qid}: show_when references unknown question {cond['field']}")
    for r in q.get("routes", []) or []:
        for target in r["activates"]:
            if target not in bank_ids:
                err(f"{qid}: routes to unknown bank_id '{target}'")
        vals = {o["value"] for o in q.get("options", []) or []}
        if r["when_value"] not in vals:
            err(f"{qid}: routes on value '{r['when_value']}' which is not an option")

# 7. FR parity and option sanity.
def walk_i18n(node, path, qid):
    if isinstance(node, dict):
        if set(node) >= {"en", "fr"} and all(isinstance(node[k], str) for k in ("en", "fr")):
            if not node["fr"].strip():
                err(f"{qid}: {path}: empty French")
            if node["fr"].strip() == node["en"].strip() and len(node["en"]) > 12:
                warn(f"{qid}: {path}: FR identical to EN — untranslated?")
        for k, vv in node.items():
            walk_i18n(vv, f"{path}/{k}", qid)
    elif isinstance(node, list):
        for i, vv in enumerate(node):
            walk_i18n(vv, f"{path}[{i}]", qid)


for qid, (name, q) in questions.items():
    walk_i18n(q, "", qid)
    if q["type"] in ("single", "multi"):
        opts = q.get("options", [])
        vals = [o["value"] for o in opts]
        if len(vals) != len(set(vals)):
            err(f"{qid}: duplicate option values")
        scored = [o for o in opts if "level" in o]
        unscored = [o for o in opts if "level" not in o]
        if q.get("weight", 1) > 0 and q["dimension"] != "firmographic":
            if not scored:
                err(f"{qid}: scored question has no option carrying a level")
            for o in unscored:
                if not (o.get("na") or o.get("informational")):
                    err(f"{qid}: option '{o['value']}' has no level and is not na/informational")
            levels = sorted(o["level"] for o in scored)
            if levels and levels[0] != 1:
                warn(f"{qid}: lowest level is {levels[0]}, not 1 — is the floor described?")
        if q["dimension"] == "firmographic" and q.get("weight", 1) != 0:
            err(f"{qid}: firmographic questions must have weight 0")
    if q["type"] == "number":
        bands = q["numeric"]["bands"]
        if not any("level" in b for b in bands):
            err(f"{qid}: numeric bands carry no level")
    if q["type"] == "text" and q.get("instruments") != ["audit"]:
        err(f"{qid}: text questions must be audit-only")

# 8. Quiz order integrity.
quiz_order = SCORING["instruments"]["quiz"]["order"]
if len(quiz_order) != len(set(quiz_order)):
    err("quiz order contains duplicates")
for qid in quiz_order:
    if qid not in questions:
        err(f"quiz order references unknown question {qid}")
    elif "quiz" not in questions[qid][1]["instruments"]:
        err(f"quiz order includes {qid}, which is not tagged for the quiz instrument")
    elif questions[qid][1]["type"] == "text":
        err(f"quiz order includes open-ended question {qid}")
if len(quiz_order) > 13:
    warn(f"quiz is {len(quiz_order)} questions; the defensible design point is 8-12")

# Pillar coverage of the quiz.
quiz_pillars = defaultdict(int)
for qid in quiz_order:
    d = questions[qid][1]["dimension"]
    if d in DIMS:
        quiz_pillars[DIMS[d]["pillar"]] += 1
for pid in PILLARS:
    if quiz_pillars[pid] < 2:
        warn(f"quiz covers pillar {pid} with only {quiz_pillars[pid]} question(s)")


# ------------------------------------------------------------ scoring engine

def item_score(level):
    return (level - 1) / 4 * 100


def band_level(q, value):
    """Resolve a numeric answer to a level via the question's bands."""
    n = q["numeric"]
    if value is None:
        return n.get("unknown_level", 1)
    for b in n["bands"]:
        if "lte" in b and value <= b["lte"]:
            return b["level"]
        if "lt" in b and value < b["lt"]:
            return b["level"]
        if "gte" in b and value >= b["gte"]:
            return b["level"]
        if "gt" in b and value > b["gt"]:
            return b["level"]
    return n["bands"][-1]["level"]


def score(answers, active_banks=None, instrument="audit"):
    """answers: {question_id: option_value | number | None}. Returns the full result."""
    active = set(active_banks or bank_ids)
    reweight = defaultdict(lambda: 1.0)
    for bank in banks.values():
        if bank["bank_id"] in active:
            for dim, mult in (bank.get("reweight") or {}).items():
                reweight[dim] *= mult

    per_dim = defaultdict(list)          # dim -> [(question_score, weight)]
    flags = set()

    for qid, raw in answers.items():
        if qid not in questions:
            continue
        name, q = questions[qid]
        if banks[name]["bank_id"] not in active:
            continue
        w = q.get("weight", 1)
        dim = q["dimension"]

        if q["type"] in ("single", "multi"):
            vals = raw if isinstance(raw, list) else [raw]
            opts = {o["value"]: o for o in q.get("options", [])}
            levels = []
            for vv in vals:
                o = opts.get(vv)
                if not o:
                    continue
                if o.get("flag"):
                    flags.add(o["flag"])
                if o.get("na") or o.get("informational") or "level" not in o:
                    continue
                levels.append(o["level"])
            if not levels or dim == "firmographic" or w == 0:
                continue
            per_dim[dim].append((sum(item_score(l) for l in levels) / len(levels), w))

        elif q["type"] == "number":
            if dim == "firmographic" or w == 0:
                continue
            per_dim[dim].append((item_score(band_level(q, raw)), w))

    dim_scores, dim_counts = {}, {}
    for dim, items in per_dim.items():
        if dim not in DIMS:
            continue
        tw = sum(w for _, w in items)
        if tw == 0:
            continue
        dim_scores[dim] = sum(s * w for s, w in items) / tw
        dim_counts[dim] = len(items)

    reportable = {d: s for d, s in dim_scores.items()
                  if dim_counts[d] >= SCORING["aggregation"]["minimum_coverage"]["dimension_reported"]}

    # --- cap rules
    capped = dict(dim_scores)
    bound = []
    FLOOR = SCORING["cap_rules"]["floor_principle"]["value"]
    doc = dim_scores.get("process_documentation")
    if doc is not None:
        ceiling = max(doc + 20, FLOOR)
        for d in list(capped):
            if d in ("process_documentation", "sponsorship_change"):
                continue
            if capped[d] > ceiling:
                bound.append(("documentation_caps_all", d, round(capped[d]), round(ceiling)))
                capped[d] = ceiling
    data = dim_scores.get("data_reporting")
    if data is not None and doc is not None and "ai_automation_readiness" in capped:
        ceiling = min(data, doc)
        if capped["ai_automation_readiness"] > ceiling:
            bound.append(("ai_cannot_outrun_foundations", "ai_automation_readiness",
                          round(capped["ai_automation_readiness"]), round(ceiling)))
            capped["ai_automation_readiness"] = ceiling

    # Layer reweight applies to the DIMENSION weight at the pillar rollup.
    # Applying it to question weights inside a dimension cancels out of the
    # weighted mean exactly, which makes the mechanism a silent no-op.
    pillar_scores = {}
    for pid in PILLARS:
        members = [(capped[d["id"]], d["weight"] * reweight[d["id"]])
                   for d in DIMS.values()
                   if d["pillar"] == pid and d["id"] in capped]
        if members:
            tw = sum(w for _, w in members)
            pillar_scores[pid] = sum(s * w for s, w in members) / tw

    if pillar_scores:
        tw = sum(PILLARS[p]["weight"] for p in pillar_scores)
        omi = sum(s * PILLARS[p]["weight"] for p, s in pillar_scores.items()) / tw
    else:
        omi = 0.0

    if data is not None:
        ceiling = max(data + 15, FLOOR)
        if omi > ceiling:
            bound.append(("data_caps_index", "omi", round(omi), round(ceiling)))
            omi = ceiling

    for rule in SCORING["red_flags"]["score_triggered"]:
        rid = rule["id"]
        if rid == "dimension_critical":
            for d, s in capped.items():
                if s < 25:
                    flags.add(f"dimension_critical:{d}")
        elif rid == "no_sponsor" and capped.get("sponsorship_change", 100) < 30:
            flags.add("no_sponsor")
        elif rid == "continuity_risk" and capped.get("people_continuity", 100) < 30:
            flags.add("continuity_risk")

    band = next(b for b in SCORING["bands"]["ranges"]
                if b["from"] <= round(omi) <= b["to"])

    return {
        "omi": round(omi, 1),
        "band": band["key"],
        "pillars": {k: round(v, 1) for k, v in sorted(pillar_scores.items())},
        "dimensions": {k: round(v, 1) for k, v in sorted(capped.items())},
        "reportable_dimensions": sorted(reportable),
        "caps_bound": bound,
        "flags": sorted(flags),
    }


# ------------------------------------------------------- synthetic respondents

def synthetic(level_picker, bank_filter=lambda b: True):
    """Build an answer set by choosing an option/number per question."""
    ans, active = {}, set()
    for name, bank in banks.items():
        if not bank_filter(bank):
            continue
        active.add(bank["bank_id"])
        for q in bank["questions"]:
            if q["type"] == "text":
                continue
            want = level_picker(q)
            if q["type"] == "number":
                n = q["numeric"]
                target = [b for b in n["bands"] if b["level"] == want]
                b = target[0] if target else n["bands"][0]
                if "lte" in b:
                    ans[q["id"]] = b["lte"]
                elif "lt" in b:
                    ans[q["id"]] = b["lt"] - 1
                elif "gt" in b:
                    ans[q["id"]] = b["gt"] + 1
                elif "gte" in b:
                    ans[q["id"]] = b["gte"]
            else:
                scored = [o for o in q.get("options", []) if "level" in o]
                if not scored:
                    info = [o for o in q.get("options", []) if o.get("informational")]
                    if info:
                        ans[q["id"]] = info[0]["value"]
                    continue
                best = min(scored, key=lambda o: abs(o["level"] - want))
                ans[q["id"]] = best["value"]
    return ans, active


base_only = lambda b: b["bank_id"] == "base"
PROFILES = {
    "floor (everything level 1, base only)": synthetic(lambda q: 1, base_only),
    "ceiling (everything level 5, base only)": synthetic(lambda q: 5, base_only),
    "middle (everything level 3, base only)": synthetic(lambda q: 3, base_only),
    "good tooling, no documentation": synthetic(
        lambda q: 1 if q["dimension"] == "process_documentation" else 5, base_only),
    "AI-keen, bad data and no docs": synthetic(
        lambda q: 5 if q["dimension"] == "ai_automation_readiness"
        else (1 if q["dimension"] in ("data_reporting", "process_documentation") else 3),
        base_only),
    "no sponsor, everything else fine": synthetic(
        lambda q: 1 if q["dimension"] == "sponsorship_change" else 4, base_only),
    "construction subcontractor, mid maturity": synthetic(
        lambda q: 2, lambda b: b["bank_id"] in ("base", "ind_construction", "model_project")),
    "full stack, every bank, level 3": synthetic(lambda q: 3),
}

print("=" * 78)
print("NBT Labs Operations Barometer — validation")
print("=" * 78)
print(f"banks: {len(banks)}   questions: {len(questions)}   "
      f"scored dimensions: {len(DIMS)}   pillars: {len(PILLARS)}")
print(f"quiz: {len(quiz_order)} questions, "
      f"{sum(1 for q in quiz_order if questions[q][1]['type'] == 'number')} numeric, "
      f"{sum(1 for q in quiz_order if questions[q][1]['type'] == 'text')} open-ended")
print()
print("questions per bank:")
for name in sorted(banks):
    b = banks[name]
    n = len(b["questions"])
    nq = sum(1 for q in b["questions"] if "quiz" in q["instruments"])
    probes = sum(1 for q in b["questions"] if q.get("artifact_probe"))
    print(f"  {b['bank_id']:<24} {n:>3} questions  {nq:>2} quiz-tagged  {probes:>3} artifact probes")
print()
print("questions per dimension:")
for d in DIMS:
    print(f"  {d:<28} {len(by_dimension[d]):>3}")
print()

print("-" * 78)
print("synthetic respondents")
print("-" * 78)
for label, (ans, active) in PROFILES.items():
    r = score(ans, active)
    print(f"\n{label}")
    print(f"  index {r['omi']:>5}  band {r['band']}")
    print(f"  pillars: " + "  ".join(f"{k}={v}" for k, v in r["pillars"].items()))
    if r["caps_bound"]:
        for rule, target, was, now in r["caps_bound"]:
            print(f"  CAP {rule}: {target} {was} -> {now}")
    if r["flags"]:
        print(f"  flags: {', '.join(r['flags'][:6])}"
              + (f" (+{len(r['flags']) - 6} more)" if len(r["flags"]) > 6 else ""))

# --- behavioural assertions
print()
print("-" * 78)
print("assertions")
print("-" * 78)
checks = []
floor = score(*PROFILES["floor (everything level 1, base only)"])
ceiling = score(*PROFILES["ceiling (everything level 5, base only)"])
middle = score(*PROFILES["middle (everything level 3, base only)"])
notdoc = score(*PROFILES["good tooling, no documentation"])
aikeen = score(*PROFILES["AI-keen, bad data and no docs"])
nospon = score(*PROFILES["no sponsor, everything else fine"])

checks.append(("floor scores 0", floor["omi"] == 0.0))
checks.append(("ceiling scores 100", ceiling["omi"] == 100.0))
checks.append(("middle lands mid-scale", 40 <= middle["omi"] <= 60))
checks.append(("floor is in the ad_hoc band", floor["band"] == "ad_hoc"))
checks.append(("ceiling is in the improving band", ceiling["band"] == "improving"))
checks.append(("undocumented process caps the index to mid-scale",
               45 <= notdoc["omi"] <= 62))
checks.append(("but the cap floor keeps it out of the bottom two bands",
               notdoc["band"] in ("systematized", "integrated")))
checks.append(("documentation cap actually binds",
               any(c[0] == "documentation_caps_all" for c in notdoc["caps_bound"])))
checks.append(("AI readiness cannot outrun data and docs",
               aikeen["dimensions"]["ai_automation_readiness"] <=
               min(aikeen["dimensions"]["data_reporting"],
                   aikeen["dimensions"]["process_documentation"]) + 0.01))
checks.append(("missing sponsor raises its flag", "no_sponsor" in nospon["flags"]))
checks.append(("floor raises a critical-gap flag",
               any(f.startswith("dimension_critical") for f in floor["flags"])))
checks.append(("floor raises the Law 25 officer flag", "law25_no_officer" in floor["flags"]))
checks.append(("every base dimension is reportable from the base bank alone",
               len(middle["reportable_dimensions"]) == len(DIMS)))

# Layer reweight must actually change something. Weighting a weak dimension up
# has to pull its pillar and the index down; if it does not, the multiplier is
# being applied somewhere it cancels out.
_rw_answers, _rw_active = synthetic(
    lambda q: 1 if q["dimension"] == "quote_to_cash" else 4, base_only)
_rw_plain = score(_rw_answers, _rw_active)
_saved = banks["base.v1.json"].get("reweight")
banks["base.v1.json"]["reweight"] = {"quote_to_cash": 3.0}
_rw_weighted = score(_rw_answers, _rw_active)
if _saved is None:
    banks["base.v1.json"].pop("reweight", None)
else:
    banks["base.v1.json"]["reweight"] = _saved
checks.append(("layer reweight pulls a weak dimension's pillar down",
               _rw_weighted["pillars"]["operating_flow"]
               < _rw_plain["pillars"]["operating_flow"]))
checks.append(("layer reweight pulls the index down",
               _rw_weighted["omi"] < _rw_plain["omi"]))
checks.append(("layer reweight leaves other pillars alone",
               _rw_weighted["pillars"]["organization"]
               == _rw_plain["pillars"]["organization"]))

for label, ok in checks:
    print(f"  [{'ok ' if ok else 'FAIL'}] {label}")
    if not ok:
        err(f"assertion failed: {label}")

# ------------------------------------------------------------------- report

print()
print("=" * 78)
if warnings:
    print(f"{len(warnings)} warning(s):")
    for w in warnings:
        print(f"  ! {w}")
    print()
if errors:
    print(f"{len(errors)} ERROR(S):")
    for e in errors:
        print(f"  x {e}")
    sys.exit(1)
print("PASS — all banks valid, all cross-references resolve, barometer behaves.")
