# NBT Labs Operations Barometer — v1.0.0

The free 1–2h audit, as a versioned instrument. Question banks as JSON, a scoring
spec, a sourced benchmark file, and a reference implementation that validates the
whole thing and runs synthetic respondents through it.

Nothing here is wired to the website yet. That's deliberate — the content is the
hard part and it should be settled before it's embedded in React.

```
nbt-audit/
├── schema/question-bank.schema.json     the contract every bank validates against
├── banks/                               17 files, 282 questions
│   ├── base.v1.json                     60 — every company, always asked
│   ├── model_*.v1.json                  6 banks — business model
│   ├── ind_*.v1.json                    6 banks — industry
│   └── layer_*.v1.json                  4 banks — compliance, stack, respondent, trigger
├── scoring/
│   ├── scoring.v1.json                  dimensions, weights, bands, cap rules, cost model, quiz spec
│   └── benchmarks.v1.json               every external number, with source, date and provenance tier
├── validate.py                          validator + reference scoring engine
└── README.md
```

Run `python3 validate.py` from this directory. It checks structure, resolves every
cross-reference, enforces the bilingual requirement, and asserts that the barometer
behaves at the extremes. It currently passes with zero errors and zero warnings.

---

## How the layering works

```
base (60 questions, always)
  + business model      ← routed by base.firmo.q02
  + industry            ← routed by base.firmo.q04
  + Quebec compliance   ← routed by base.firmo.q05
  + size & stack        ← routed by base.firmo.q07
  + respondent          ← routed by base.firmo.q06
  + growth trigger      ← routed by base.spon.q05
```

A layer only **adds** questions and **re-weights** the base ones. Construction
doesn't get a different quote-to-cash question — it gets the base one plus
progress billing, holdbacks, change orders and the CCQ monthly report, and
`scheduling_capacity` and `finance_close` get heavier weights through the
`reweight` block. That's the whole mechanism, and it's why adding a sector later
is a new file rather than a rewrite.

A typical client sees **40–70 questions**. All 282 never fire at once.

Construction branches again inside its own bank: GC and specialty sub are
different audits, gated on `ind_construction.firmo.q01`.

---

## The six design decisions worth defending

Everything below came out of the research pass and each one overrides something
the standard playbook would have told us to do.

**1. No Likert scales, no "how mature is your process?"**

Every option is a described, observable state. The reason is mechanical: *"how
mature is your invoicing, 1–5"* fails at all four stages of how people actually
answer a survey — "mature" has no shared referent, there's no specific episode to
recall, it demands aggregation over an unspecified period, and an unanchored 1–5
means whatever the respondent needs it to mean. Worse, the scale you offer
manufactures the distribution it then reports back to you.

Item-specific options measured roughly **.80 for quality against .58–.64** for
agree/disagree batteries across 23 countries in the European Social Survey
multitrait-multimethod experiments, and up to **.85–.89 against .21–.51** in the
starkest comparison. There's a credible dissent (test-retest reliability came out
equal for both formats in a 5,900-case American National Election Studies
analysis), so the honest read is: item-specific is at worst equal, at best much
better, costs nothing to write, and is easier to answer. It also solves the
French translation problem, because a described behaviour translates reliably and
"somewhat agree / plutôt d'accord" does not.

**2. "Nobody knows" is level 1, written as a real option.**

Offering a no-opinion escape hatch raises its selection by 4–35 points and does
not improve data quality — it's an invitation to satisfice. So there is no
"don't know" button on a judgement. Instead, *"honestly, nobody knows what the
floor is"* and *"I'd have to ask our accountant"* are scored options at the
bottom. The methodological problem becomes a measurement. `na: true` exists only
for "we genuinely don't do this activity" — a service firm skips the inventory
questions.

**3. Two instruments, one ordered core.**

The quiz is exactly **12 questions, 4 numeric, zero open-ended**. One open-ended
question costs about **12.5 percentage points of completion** — sixty closed
questions' worth — so they're all in the audit. Total word count hurts about 2.5×
more than question count, which is why the stems are short and the help text is
rationed.

And **no progress bar**, despite every vendor recommending one. Three independent
studies, one with n=339,156, find the effect neutral to negative. Pagination is
free (questions-per-page had no significant effect across 25,000 surveys), so
one-question-at-a-time is chosen for data quality — it roughly halves item
non-response — not for conversion.

**4. Partial reveal at the gate.**

Score, pillar bars and band: ungated. Per-dimension diagnosis, the dollar range,
the priority matrix and the PDF: behind email.

Labelled as reasoning, not evidence, because **there is no public controlled
experiment on gating a diagnostic result** — the field's most-cited practitioner
text presents both options and admits it has no data. The one real signal points
the other way (asking email first correlates with +18% completion in a 1,576-form
dataset). We go the other way anyway: a specific closeable gap is what actually
drives curiosity, a non-converter still received something real — which matters
when the next ask is 90 minutes of their time — and gating a score the person
generated from their own answers reads as extortionate, while gating *our
analysis* reads as fair.

Don't A/B test this. At ~6% median professional-services landing-page conversion,
detecting a 20% relative difference needs several thousand sessions per arm.
Instrument the four rates separately (see→start, start→finish, finish→email,
email→booking) and revisit with a year of data.

**5. Caps, not just weights.**

Additive scoring is fully compensatory: a catastrophic dimension gets hidden by
good scores elsewhere, which is exactly wrong when the catastrophic one is the
one bleeding money. So three non-compensatory rules, borrowed from EFQM's
master-rule pattern:

| rule | effect |
|---|---|
| `documentation_caps_all` | no dimension above `max(documentation + 20, 50)` |
| `data_caps_index` | index not above `max(data_reporting + 15, 50)` |
| `ai_cannot_outrun_foundations` | AI readiness not above `min(data, documentation)`, **no floor** |

The **floor of 50** matters. A cap constrains what the good scores *mean*; it
isn't a claim the good things aren't happening. Without it, one zero on
documentation crushed a strong profile to 22 and the instrument read as rigged —
I tested exactly that and backed it out. A client who executes well with nothing
written down now lands at "systematized", and the fragility message is carried by
the red flags and by key-person risk, where it belongs.

The AI rule keeps its teeth on purpose. Telling a prospect their AI readiness is
zero because nothing is documented is precisely the message worth delivering, and
it stops NBT selling a pilot the client can't absorb.

Whenever a cap binds, **the report says which rule bound and by how much**. A
silently capped score is a number the client can't argue with, which is the
opposite of the point.

**6. Bars, not radar. Ranges, not point estimates.**

A radar chart asks the reader to judge angle and area — the two worst perceptual
tasks — while axis order is arbitrary and changes the apparent shape, and area
scales as radius² so a 4 against a 2 encloses four times the area. It's allowed
as a cover graphic and nowhere else. Primary view is a horizontal bar or dot plot
**ordered worst first**, so the eye lands on the problem.

On the dollar figure: communicating uncertainty as an explicit numeric range costs
a little perceived precision and essentially no trust in the source. *Verbal*
hedging damages trust more than a range does. So give the range and drop the
"there is some uncertainty here".

---

## The barometer

Two axes, because a single number is a vanity metric.

**Axis 1 — Operations Maturity Index, 0–100.** 12 dimensions → 4 pillars → one
index, equal-weighted within each level, published weights. Five bands sharing
vocabulary with the five-level ladder, so the band label and the option labels are
the same words.

| | dimensions |
|---|---|
| **Operating flow** | quote to cash · purchasing & inventory · scheduling & capacity |
| **Financial control** | finance handoffs & close · running on numbers |
| **Data & systems** | one version of the truth · systems talking · automation & AI readiness |
| **Organization** | written-down process · key-person risk · ownership & change readiness · compliance & resilience |

Three of those twelve weren't in the original nine, and they came out of the
framework research as the things every ERP-readiness instrument has and an
operational-only list misses:

- **running on numbers**, split out from reporting. Without the split, a client
  with a pretty dashboard and no operating review scores the same as one that
  runs a weekly meeting off its numbers — the most common misdiagnosis in this
  category. CMMI makes measurement one of only two practice areas reaching level 5.
- **ownership & change readiness** — the most universally present dimension in
  every ERP-readiness instrument surveyed and the strongest single predictor of
  failure. It also protects NBT commercially: it's the dimension that says whether
  to take the engagement.
- **compliance & resilience** — and in Quebec it's a differentiator nobody else is
  asking about.

**Axis 2 — cost of the status quo, $/year, as a range.** Eleven modules, each a
transparent arithmetic chain from inputs the client supplied. The formula is
printed on the page.

The denominator is entirely Canadian government data: Quebec median wages by
occupation code, 2026 employer burden rates, Bank of Canada prime plus the
measured small-business premium. Worked example from the file — accounting
technician at the Quebec median $28.85 × 2,080 = $60,008, plus 11.9% statutory =
$67,149, plus ~7% benefits = ~$71,850, ÷ 1,900 productive hours = **$37.80 per
productive hour**, an effective 1.31× the posted wage. Stating that derivation out
loud is the step that signals you know what you're doing.

Two guardrails in the spec: if the base total exceeds **12% of revenue**, don't
publish it — it's almost always a double count across modules, and you deduplicate
by *person*, not by module. And if one module is more than 60% of the total, say
so in the headline, because it's really a finding about one process.

**The matrix is the deliverable.** Maturity × cost, four quadrants, mapped onto
what NBT sells: *Fix now* → Automation Sprint or Odoo Core Launch. *Plan* → Audit
or Operations Transformation. *Monitor* → Continuous Improvement. *Leverage* → AI
Operations Pilot. With an override: if the AI cap bound, nothing routes to the AI
pilot regardless of quadrant.

---

## Benchmarks: what we use and what we refused

`benchmarks.v1.json` tiers every figure T1 (government) through T6 (convention),
and has an `excluded_with_reasons` block that should be **published in the
methodology page**. Showing a controller which famous numbers we checked and
rejected pre-empts the "isn't that one debunked?" objection, and it's cheaper than
being caught.

On the excluded list: the IBM $3.1 trillion bad-data figure (traced to a 2011
magazine piece whose author called it his own extrapolation), "1% error per
keystroke" (the real figure is 0.95% per *value*, which the per-keystroke framing
inflates by the number of characters per field), Gartner's $12.9M poor-data-quality
cost (a survey of 154 vendor-nominated reference customers), Nucleus's 7.23:1 ERP
ROI, every cost-to-correct-an-order-error figure, every technician-utilization
benchmark, and "1–3% pick error rate" (2–5× worse than the real 0.6% median).

Where no credible benchmark exists, **the instrument makes the client supply the
number** — hours of manual journal entry per close, credit notes ÷ invoices,
quote turnaround, technician billed ÷ paid hours, their actual line-of-credit
rate. That's deliberate: their own data is more persuasive than any benchmark, and
it can't be disputed.

The honesty clause that goes in the report: *almost everyone rates themselves above
average, and self-ratings correlate about 0.3 with measured reality.* Both halves
are solidly evidenced, it justifies the live audit, and it doesn't insult the
prospect — unlike the Dunning-Kruger framing, which is largely a statistical
artefact of regression to the mean and which a sophisticated prospect may know is
contested.

---

## Why the live audit beats the quiz

Not length. **`artifact_probe`** — on 201 of 282 questions, the thing the
consultant asks to *see* rather than hear about. "Open it, let's look at the
last-modified date." "Pull the credit note list on screen." "When was a restore
last actually performed, not just scheduled?"

That turns every self-serve answer into a **testable claim**, which makes the
audit's pitch "let's check" rather than "let's discuss". And it's enforced in the
arithmetic: `unverified_claims_cap` caps any dimension at 50 and marks it
"claimed, not observed" when more than half its level-4/5 answers failed their
probe.

The second structural advantage: the consultant scores the same instrument
independently and shows both columns. The quiz cannot do that.

---

## Bilingual is not a phase two

Commercial documents and publications available to the public must be in French on
any medium, with any other language on no more favourable terms, and that's
already in force with no grace period. So the schema makes `fr` **mandatory on
every string** — an EN-only bank fails validation by design.

Method matters: **dual independent forward translation plus reconciliation**, not
back-translation. The professional standard for adapting instruments explicitly
warns that back-translation in its narrowest form means the target version never
gets reviewed, and produces text optimised for ease of back-translation rather
than for the reader. Translators need the subject matter (accounting, ERP) as much
as the language.

The cheapest high-yield step is **cognitive interviews with ~5 francophone and ~5
anglophone owners or controllers**: read each item aloud, ask what they think it's
asking, ask them to answer and explain why. It'll find the three worst items in an
afternoon. Freeze a glossary before that, or each item gets translated ad hoc and
equivalence is lost one item at a time.

Don't confuse the two standards: websites and publications require French to be
*at least equivalent*; signage and trademarks require *markedly predominant*. The
predominance rule gets misapplied to websites constantly and doesn't apply here.

---

## Freeze and version

Question-order effects are large and measured. Pew's own split samples swing 25
points on wording alone. So:

- Scores compare **only within an `instrument_version`**.
- Pool peer-benchmark data only within a version. Changing one question
  invalidates your own benchmark.
- The peer benchmark is **disabled until 30 completed responses** in one version
  and one language, and the statement always names the n and the date.
- **Never pool FR and EN** into one benchmark until invariance can be tested —
  which needs a couple of hundred per language. This is the specific place where
  a bilingual instrument quietly becomes dishonest.
- Every benchmark panel must carry a directional judgement *and* a concrete next
  action. A bare percentile is the configuration that produces backsliding: in the
  energy-feedback field experiments, descriptive norms alone made below-average
  households *increase* consumption, and the large trials that worked all included
  action steps.

---

## Perception gap

Available when two or more people from the same company answer. Self-other
agreement on judgements like these runs around **r = .35**, so material
disagreement is expected — and it's the product, not noise.

Use the **average deviation** index or the plain per-item range. Cutoff is A/6, so
with five levels AD ≤ 0.83 is strong agreement. **Never report an intraclass
correlation for a single company** — ICC requires multiple groups; with one client
you have one group. With 2–5 respondents every coefficient is unstable anyway, so
prefer a **dumbbell plot per question** with the gap annotated: it beats any
statistic for persuasion and it's honest, because it shows the raw answers.

Frame it developmentally — "here's where to look", never "here's who's wrong".
Developmental framing produces roughly three times the improvement of
administrative framing, and over-raters are the segment most likely to act. But
don't promise transformation: the meta-analytic effect of feedback alone is small.
The report's job is to earn the engagement.

---

## Known gaps

- **`ai_automation_readiness` has only 5 questions**, all in base. No layer adds
  to it, which is thin for what's meant to be NBT's differentiating pillar. It's
  capped by the foundations rule anyway, so it can't flatter — but it's the first
  place to add depth.
- **`base` tags 27 questions for the quiz** while `scoring.v1.json` uses 12. The
  scoring file is authoritative; the tags are advisory. Worth tidying so the bank
  doesn't imply a longer quiz than ships.
- **Artifact probes on base are thin** (8 of 60) compared to the layer banks
  (12–19 each). The layer authors were more disciplined than I was.
- **Four cost modules need consultant-entered inputs** that no question asks —
  annual revenue, invoices issued per year, AP invoice volume, truck-roll cost.
  They live in the audit worksheet, because asking them in a self-serve quiz costs
  more completion than the precision is worth.
- **No peer benchmark data exists yet.** The panel stays off until 30 responses.

## What's next, in order

1. **Read the question wording, out loud, in both languages.** Every stem is a
   judgement call and you'll want to change some.
2. **Cognitive interviews**, 5 + 5, before any of this gets embedded.
3. **Wire the quiz** — 12 questions from `scoring.v1.json#instruments.quiz.order`
   into the existing Next.js site, replacing the mailto-only `AuditForm.tsx`.
4. **Build the audit worksheet** — the live-session view with artifact probes and
   the consultant's independent column.
5. **Report generator** off the same JSON.

Port the scoring functions in `validate.py` rather than reimplementing them. The
cap rules are easy to get subtly wrong, and the synthetic respondents at the
bottom of that file are the regression test.
