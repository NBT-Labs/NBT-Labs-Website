"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import bundleJson from "../_data/quiz.bundle.json";
import { localePath } from "@/i18n/config";
import { fmt, getDictionary, t } from "@/i18n/dictionaries";
import { isComplete, parseAnswer, score } from "@/lib/audit/score";
import type {
  Answers,
  Locale,
  Question,
  QuizBundle,
  ScoreResult,
} from "@/lib/audit/types";

const bundle = bundleJson as unknown as QuizBundle;

/**
 * Draft storage. Per-viewer convenience only: it survives an accidental tab
 * close and, more importantly, survives the language switch mid-flow, which
 * matters because the French and English versions have to be equally usable.
 *
 * Every read and write is wrapped — storage throws in private windows and
 * comes back empty when site data is cleared, and the quiz must work anyway.
 */
const DRAFT_KEY = `nbt-scorecard-${bundle.instrumentVersion}`;

type Draft = { answers: Answers; step: number };

function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* non-fatal */
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* non-fatal */
  }
}

/** Marketing attribution, read once at mount. Retrofitting this is impossible. */
function captureAttribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "gclid",
      "fbclid",
      "msclkid",
    ]) {
      const value = params.get(key);
      if (value) out[key] = value.slice(0, 200);
    }
    if (document.referrer) out.referrer = document.referrer.slice(0, 300);
  } catch {
    /* non-fatal */
  }
  return out;
}

/**
 * Four separate funnel rates, not one "conversion rate". Every published
 * benchmark in this category conflates at least two of these, which is why
 * they are uninterpretable. These fire into dataLayer if one exists and are
 * otherwise harmless no-ops.
 */
type FunnelEvent =
  | "scorecard_view"
  | "scorecard_start"
  | "scorecard_finish"
  | "scorecard_email"
  | "scorecard_booking_click";

function track(event: FunnelEvent, detail: Record<string, unknown> = {}) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer?.push({
      event,
      instrument_version: bundle.instrumentVersion,
      ...detail,
    });
  } catch {
    /* non-fatal */
  }
}

type Stage = "intro" | "questions" | "result";

export function Scorecard({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const s = dict.scorecard;
  const total = bundle.questions.length;

  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hasDraft, setHasDraft] = useState(false);
  const [attribution, setAttribution] = useState<Record<string, string>>({});
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Reading localStorage and the URL can only happen after mount — doing it
  // during render would desync the server and client HTML. The lint rule
  // flags setState in an effect because it can cascade renders; here it runs
  // once, on mount, and is the documented way to hydrate from browser state.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setStep(Math.min(draft.step, total - 1));
      setHasDraft(true);
    }
    setAttribution(captureAttribution());
    track("scorecard_view");
  }, [total]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (stage === "questions") saveDraft({ answers, step });
  }, [answers, step, stage]);

  /* Move focus to the new question so the flow is usable by keyboard and
     announced by a screen reader. One question per screen halves item
     non-response; it does not change completion, so it is chosen for data
     quality and for mobile, not for conversion. */
  useEffect(() => {
    if (stage === "questions") headingRef.current?.focus();
  }, [step, stage]);

  const current: Question | undefined = bundle.questions[step];
  const complete = useMemo(() => isComplete(bundle, answers), [answers]);

  const result: ScoreResult | null = useMemo(
    () => (stage === "result" ? score(bundle, answers) : null),
    [stage, answers],
  );

  const setAnswer = (q: Question, raw: string) => {
    setAnswers((prev) => ({ ...prev, [q.id]: parseAnswer(q, raw) }));
  };

  const begin = (resume: boolean) => {
    if (!resume) {
      setAnswers({});
      setStep(0);
      clearDraft();
    }
    setStage("questions");
    track("scorecard_start", { resumed: resume });
  };

  const advance = () => {
    if (step + 1 < total) {
      setStep(step + 1);
    } else {
      setStage("result");
      track("scorecard_finish", { answered: Object.keys(answers).length });
    }
  };

  const answeredCurrent =
    current !== undefined &&
    answers[current.id] !== undefined &&
    answers[current.id] !== "";

  /* --------------------------------------------------------------- intro */

  if (stage === "intro") {
    return (
      <section className="scorecard scorecard-intro">
        <p className="eyebrow">{s.eyebrow}</p>
        <h1>{s.title}</h1>
        <p className="scorecard-lead">{s.lead}</p>
        <p className="scorecard-promise">{t(bundle.promise, locale)}</p>
        <div className="scorecard-actions">
          <button className="button" type="button" onClick={() => begin(false)}>
            {hasDraft ? s.restart : s.start} <span aria-hidden="true">→</span>
          </button>
          {hasDraft ? (
            <button
              className="button button-ghost"
              type="button"
              onClick={() => begin(true)}
            >
              {s.resume}
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  /* ----------------------------------------------------------- questions */

  if (stage === "questions" && current) {
    return (
      <section className="scorecard scorecard-flow">
        {/* No progress bar, deliberately. Three studies, one with n=339,156,
            find the effect on completion neutral to negative. The step count
            below is plain text, which respondents ask for and which does not
            pretend to predict how long is left. */}
        <p className="scorecard-step" aria-live="polite">
          {fmt(s.questionOf, { n: step + 1, total })}
        </p>

        <h2 className="scorecard-stem" tabIndex={-1} ref={headingRef}>
          {t(current.stem, locale)}
        </h2>
        {current.help ? (
          <p className="scorecard-help">{t(current.help, locale)}</p>
        ) : null}

        {current.type === "number" ? (
          <NumberField
            question={current}
            locale={locale}
            value={answers[current.id]}
            dontKnow={s.dontKnow}
            placeholder={s.enterNumber}
            onChange={(raw) => setAnswer(current, raw)}
          />
        ) : (
          <fieldset className="scorecard-options">
            <legend className="sr-only">{t(current.stem, locale)}</legend>
            {(current.options ?? []).map((option) => (
              <label key={option.value} className="scorecard-option">
                <input
                  type="radio"
                  name={current.id}
                  value={option.value}
                  checked={answers[current.id] === option.value}
                  onChange={() => setAnswer(current, option.value)}
                />
                <span>{t(option.label, locale)}</span>
              </label>
            ))}
          </fieldset>
        )}

        <div className="scorecard-actions">
          <button
            className="button button-ghost"
            type="button"
            onClick={() => (step === 0 ? setStage("intro") : setStep(step - 1))}
          >
            {s.back}
          </button>
          <button
            className="button"
            type="button"
            disabled={!answeredCurrent}
            onClick={advance}
          >
            {step + 1 === total ? s.seeResult : s.next}{" "}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    );
  }

  /* -------------------------------------------------------------- result */

  if (result) {
    return (
      <Result
        locale={locale}
        result={result}
        answers={answers}
        attribution={attribution}
        complete={complete}
        onRestart={() => {
          clearDraft();
          setAnswers({});
          setStep(0);
          setStage("intro");
        }}
      />
    );
  }

  return null;
}

/* ------------------------------------------------------------------ parts */

function NumberField({
  question,
  locale,
  value,
  dontKnow,
  placeholder,
  onChange,
}: {
  question: Question;
  locale: Locale;
  value: unknown;
  dontKnow: string;
  placeholder: string;
  onChange: (raw: string) => void;
}) {
  const unknown = value === null;
  return (
    <div className="scorecard-number">
      <label className="sr-only" htmlFor={question.id}>
        {t(question.stem, locale)}
      </label>
      <div className="scorecard-number-row">
        <input
          id={question.id}
          type="number"
          inputMode="numeric"
          min={question.numeric?.min}
          max={question.numeric?.max}
          step={question.numeric?.integer ? 1 : "any"}
          placeholder={placeholder}
          value={typeof value === "number" ? String(value) : ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="scorecard-unit">
          {t(question.numeric?.unit, locale)}
        </span>
      </div>
      {question.numeric?.allowUnknown ? (
        <label className="scorecard-unknown">
          <input
            type="checkbox"
            checked={unknown}
            onChange={(e) => onChange(e.target.checked ? "__unknown__" : "")}
          />
          {/* Not an escape hatch: not knowing the number is itself the
              finding, and it scores at the bottom of the ladder rather than
              being dropped from the result. */}
          <span>{dontKnow}</span>
        </label>
      ) : null}
    </div>
  );
}

function Result({
  locale,
  result,
  answers,
  attribution,
  complete,
  onRestart,
}: {
  locale: Locale;
  result: ScoreResult;
  answers: Answers;
  attribution: Record<string, string>;
  complete: boolean;
  onRestart: () => void;
}) {
  const dict = getDictionary(locale);
  const s = dict.scorecard;

  const pillars = bundle.pillars
    .map((p) => ({ ...p, value: result.pillars[p.id] }))
    .filter((p) => typeof p.value === "number")
    // Worst first, so the eye lands on the problem.
    .sort((a, b) => (a.value as number) - (b.value as number));

  return (
    <section className="scorecard scorecard-result">
      <p className="eyebrow">{s.resultEyebrow}</p>

      <div className="scorecard-index">
        <span className="scorecard-index-value">{Math.round(result.index)}</span>
        <span className="scorecard-index-scale">{s.outOf}</span>
      </div>
      <p className="scorecard-index-label">{s.yourIndex}</p>

      <h2 className="scorecard-band">{t(result.band.label, locale)}</h2>
      <p className="scorecard-headline">{t(result.band.headline, locale)}</p>

      {/* Horizontal bars on a common scale, ordered worst first. Not a radar
          chart: axis order there is arbitrary and changes the apparent shape,
          and area scales as the square of the radius, so it overstates
          differences. */}
      <h3>{s.pillarHeading}</h3>
      <ul className="scorecard-bars">
        {pillars.map((p) => (
          <li key={p.id}>
            <span className="scorecard-bar-label">{t(p.label, locale)}</span>
            <span className="scorecard-bar-track">
              <span
                className="scorecard-bar-fill"
                style={{ width: `${Math.max(2, Math.round(p.value as number))}%` }}
              />
            </span>
            <span className="scorecard-bar-value">
              {Math.round(p.value as number)}
            </span>
          </li>
        ))}
      </ul>

      {result.capsBound.length > 0 ? (
        <p className="scorecard-caps">
          {s.cappedBy}:{" "}
          {[...new Set(result.capsBound.map((c) => c.rule))].join(", ")}
        </p>
      ) : null}

      <details className="scorecard-coverage">
        <summary>{s.coverageNote}</summary>
        <p>{t(bundle.coverageDisclosure, locale)}</p>
      </details>

      <GateForm
        locale={locale}
        result={result}
        answers={answers}
        attribution={attribution}
        complete={complete}
      />

      <button className="button button-ghost" type="button" onClick={onRestart}>
        {s.restart}
      </button>
    </section>
  );
}

function GateForm({
  locale,
  result,
  answers,
  attribution,
  complete,
}: {
  locale: Locale;
  result: ScoreResult;
  answers: Answers;
  attribution: Record<string, string>;
  complete: boolean;
}) {
  const dict = getDictionary(locale);
  const s = dict.scorecard;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setState("sending");

    try {
      const response = await fetch("/api/scorecard", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          instrumentVersion: result.instrumentVersion,
          contact: {
            name: String(form.get("name") ?? ""),
            company: String(form.get("company") ?? ""),
            email: String(form.get("email") ?? ""),
            phone: String(form.get("phone") ?? ""),
          },
          firmographics: Object.fromEntries(
            bundle.gateQuestions.map((q) => [q.id, String(form.get(q.id) ?? "")]),
          ),
          consent: {
            // Two purposes, two records. Consent has to be requested
            // separately per purpose, so it is stored separately per purpose,
            // with when and how — the burden of proving it sits with us.
            analysis: form.get("consent_analysis") === "on",
            marketing: form.get("consent_marketing") === "on",
            at: new Date().toISOString(),
            method: "web_form",
            instrumentVersion: result.instrumentVersion,
          },
          answers,
          score: {
            index: result.index,
            band: result.band.key,
            pillars: result.pillars,
            dimensions: result.dimensions,
            flags: result.flags,
            capsBound: result.capsBound,
          },
          reveals: result.reveals,
          attribution,
          complete,
        }),
      });
      if (!response.ok) throw new Error(String(response.status));
      setState("sent");
      track("scorecard_email", { index: result.index, band: result.band.key });
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="scorecard-gate scorecard-gate-sent">
        <h3>{s.sent}</h3>
        <p>{s.sentDetail}</p>
        <a
          className="button"
          href={localePath(locale, "/contact")}
          onClick={() => track("scorecard_booking_click")}
        >
          {s.bookInstead} <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <form className="scorecard-gate" onSubmit={onSubmit}>
      <h3>{s.gateHeading}</h3>
      <p>{s.gateLead}</p>
      <ul className="scorecard-gate-list">
        {s.gateBullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="form-row">
        <label>
          <span>{s.name}</span>
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          <span>{s.company}</span>
          <input name="company" autoComplete="organization" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          <span>{s.workEmail}</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>
            {s.phone} <em>{s.optional}</em>
          </span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
      </div>

      {bundle.gateQuestions.map((q) => (
        <label key={q.id}>
          <span>{t(q.stem, locale)}</span>
          <select name={q.id} required defaultValue="">
            <option value="" disabled />
            {(q.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label, locale)}
              </option>
            ))}
          </select>
        </label>
      ))}

      <label className="scorecard-consent">
        <input type="checkbox" name="consent_analysis" required />
        <span>{s.consentResult}</span>
      </label>
      <label className="scorecard-consent">
        <input type="checkbox" name="consent_marketing" />
        <span>{s.consentMarketing}</span>
      </label>
      <p className="scorecard-consent-note">{s.consentNote}</p>

      <div className="form-submit-row">
        <button className="button" type="submit" disabled={state === "sending"}>
          {state === "sending" ? s.sending : s.send}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        <small>{s.privacyLine}</small>
      </div>

      {state === "error" ? (
        <p className="form-status" role="alert">
          {s.error}
        </p>
      ) : null}
    </form>
  );
}
