import React, { useEffect, useState } from "react";
import "./Solutions.css";

console.log(`${process.env.PUBLIC_URL}/data/solutions.json`);

const ChoiceOutcome = ({ outcome }) => {
  if (!outcome || typeof outcome !== "object") return null;

  const verdict =
    typeof outcome.verdictLabel === "string"
      ? outcome.verdictLabel
      : typeof outcome.title === "string"
        ? outcome.title
        : "";

  const profileLabel =
    outcome && outcome.profile && typeof outcome.profile.label === "string"
      ? outcome.profile.label
      : "";

  const profileDesc =
    outcome &&
    outcome.profile &&
    typeof outcome.profile.description === "string"
      ? outcome.profile.description
      : "";

  const empath = typeof outcome.empath === "string" ? outcome.empath : "";

  const reasoning = Array.isArray(outcome.reasoning) ? outcome.reasoning : [];
  const contradictions = Array.isArray(outcome.contradictions)
    ? outcome.contradictions
    : [];

  const closing =
    typeof outcome.closing === "string"
      ? outcome.closing
      : typeof outcome.footer === "string"
        ? outcome.footer
        : "";

  return (
    <div className="choice-outcome">
      {verdict && (
        <p>
          <em>Your Verdict:</em> {verdict}
        </p>
      )}

      {(profileLabel || profileDesc || empath) && (
        <div style={{ margin: "8px 0 12px" }}>
          {profileLabel && (
            <div style={{ fontWeight: 600 }}>{profileLabel}</div>
          )}
          {profileDesc && <div style={{ opacity: 0.9 }}>{profileDesc}</div>}
          {empath && (
            <>
              <div style={{ fontWeight: 600, marginTop: 10 }}>Empath</div>
              <div style={{ opacity: 0.9 }}>{empath}</div>
            </>
          )}
        </div>
      )}

      {reasoning.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Reasoning</strong>
          <ul style={{ marginTop: 6 }}>
            {reasoning.map((r, i) => (
              <li key={i}>{String(r)}</li>
            ))}
          </ul>
        </div>
      )}

      {contradictions.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <strong>Contradictions</strong>
          <ul style={{ marginTop: 6 }}>
            {contradictions.map((c, i) => (
              <li key={i}>{String(c)}</li>
            ))}
          </ul>
        </div>
      )}

      {closing && (
        <p style={{ fontStyle: "italic", marginTop: 8 }}>{closing}</p>
      )}
    </div>
  );
};

const VerdictForm = ({
  cfg,
  verdictQ1,
  setVerdictQ1,
  verdictQ2,
  setVerdictQ2,
  verdictOther,
  setVerdictOther,
}) => {
  const q1 = cfg?.q1;
  const q2 = cfg?.q2;

  if (!q1) return null;

  const showQ2 =
    !!q2 &&
    (verdictQ1 === "Murder" ||
      verdictQ1 === "Innocent" ||
      verdictQ1 === "Guilty");

  return (
    <div className="verdict-form">
      {/* Q1 */}
      {typeof q1.prompt === "string" && (
        <p className="solution-prompt">{q1.prompt}</p>
      )}

      <div className="verdict-q1">
        {(Array.isArray(q1.options) ? q1.options : []).map((opt) => (
          <label key={opt} className="verdict-radio">
            <span>{opt}</span>
            <input
              type="radio"
              name="verdict-q1"
              value={opt}
              checked={verdictQ1 === opt}
              onChange={(e) => {
                const val = e.target.value;
                setVerdictQ1(val);
                if (val !== "Murder") {
                  setVerdictQ2("");
                  setVerdictOther("");
                }
              }}
            />
          </label>
        ))}
      </div>

      {/* Q2 (only if Murder) */}
      {showQ2 && typeof q2.prompt === "string" && (
        <p className="solution-prompt">{q2.prompt}</p>
      )}
      {showQ2 && Array.isArray(q2.options) && (
        <select
          className="verdict-select"
          value={verdictQ2}
          onChange={(e) => setVerdictQ2(e.target.value)}
        >
          <option value="">Choose a suspect</option>
          {q2.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {showQ2 && verdictQ2 === "Other" && (
        <input
          type="text"
          placeholder="Type the name…"
          value={verdictOther}
          onChange={(e) => setVerdictOther(e.target.value)}
        />
      )}
    </div>
  );
};

const Solutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [activeSolution, setActiveSolution] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // true / false / null
  const [hint, setHint] = useState("");
  const [caseSel, setCaseSel] = useState({});
  const [caseErr, setCaseErr] = useState({});
  const [choiceFeedback, setChoiceFeedback] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  // verdict state
  const [verdictQ1, setVerdictQ1] = useState("");
  const [verdictQ2, setVerdictQ2] = useState("");
  const [verdictOther, setVerdictOther] = useState("");

  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/data/solutions.json`)
      .then((res) => res.json())
      .then((data) => setSolutions(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to load solutions.json", err));
  }, []);

  function normalize(v) {
    return (v || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{Letter}\p{Number}\s]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getTargetedHintForVerdict(solution, suspectLabel) {
    const bySus = solution?.incorrect?.bySuspect || {};
    if (suspectLabel && bySus[suspectLabel]) return bySus[suspectLabel];
    return solution?.incorrect?.generic || "Incorrect. Try again.";
  }

  function getTargetedHint(solution, guessRaw) {
    // text/code için eski yardımcı
    const g = normalize(guessRaw);
    const bySus = solution?.incorrect?.bySuspect || {};
    for (const key of Object.keys(bySus)) {
      if (g.includes(normalize(key))) return bySus[key];
    }
    return solution?.incorrect?.generic || "Incorrect. Try again.";
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!activeSolution) return;

    // ----- VERDICT MODE -----
    if (activeSolution.type === "verdict" && activeSolution.verdict) {
      const q1 = activeSolution.verdict.q1;
      const q2 = activeSolution.verdict.q2;
      const userQ1 = normalize(verdictQ1);
      const ansQ1 = normalize(q1?.answer);

      // q1 yanlışsa direkt yanlış
      if (userQ1 !== ansQ1) {
        setIsCorrect(false);
        setHint(activeSolution?.incorrect?.generic || "Incorrect. Try again.");
        return;
      }

      // q1 doğru (Murder). q2 zorunlu → doğru katili kontrol et
      if (q2?.answer) {
        if (!verdictQ2) {
          setIsCorrect(false);
          setHint("Please select a suspect.");
          return;
        }

        const userQ2 =
          verdictQ2 === "Other" ? (verdictOther || "").trim() : verdictQ2;
        const ok2 = normalize(userQ2) === normalize(q2.answer);

        setIsCorrect(ok2);
        if (!ok2) {
          setHint(getTargetedHintForVerdict(activeSolution, verdictQ2));
        } else {
          // Doğruysa reveal/fullSolutionText ekrana zaten aşağıda düşecek
          setHint("");
        }
        return;
      }

      // (q2 tanımlı değilse) sadece q1 doğruya göre karar ver
      setIsCorrect(true);
      setHint("");
      return;
    }

    if (activeSolution.type === "choice") {
      if (!userInput) {
        setIsCorrect(false);
        setHint("Please select one option to proceed.");
        return;
      }

      // tek doğru modu: solutions.json içine correctOption koyacağız
      const correctOpt = activeSolution.correctOption;

      if (correctOpt) {
        const ok = userInput === correctOpt;
        setIsCorrect(ok);
        setHint("");

        const fb = ok
          ? activeSolution?.feedback?.correct
          : activeSolution?.feedback?.incorrect?.[userInput];

        setChoiceFeedback(
          fb || {
            headline: ok ? "Final Insight" : "Look Again",
            text: ok
              ? "Your decision aligns with the hidden motive behind the confession."
              : "This choice explains part of the case — but not the confession.",
          },
        );
        setShowFinal(ok);

        return;
      }

      setIsCorrect(true);
      setHint("");
      return;
    }

    // ----- CASE-MATCHER MODE -----
    if (activeSolution?.type === "case-matcher") {
      const items = activeSolution.cases || [];
      const errs = {};
      let allOk = true;

      items.forEach((it) => {
        const sel = (caseSel[it.id] || "").trim();
        const ans = (it.answer || "").trim();
        const ok = sel === ans;
        errs[it.id] = !ok;
        if (!ok) allOk = false;
      });

      setCaseErr(errs);
      setIsCorrect(allOk);
      if (!allOk) setHint("One or more matches are incorrect.");
      return;
    }

    // ----- TEXT/CODE MODE -----
    const correctAnswer = activeSolution.answer;
    const inputAnswer = normalize(userInput);

    let ok = false;
    if (Array.isArray(correctAnswer)) {
      ok = correctAnswer.map((a) => normalize(a)).includes(inputAnswer);
    } else {
      ok = inputAnswer === normalize(correctAnswer);
    }
    setIsCorrect(ok);
    if (!ok) setHint(getTargetedHint(activeSolution, userInput));
  };

  const handleOpen = (s) => {
    setActiveSolution(s);
    setUserInput("");
    setIsCorrect(null);
    setHint("");
    setVerdictQ1("");
    setVerdictQ2("");
    setVerdictOther("");
    setCaseSel({});
    setCaseErr({});
    setShowFinal(false);
    setChoiceFeedback(null);
  };

  const handleClose = () => {
    setActiveSolution(null);
    setUserInput("");
    setIsCorrect(null);
    setHint("");
    setVerdictQ1("");
    setVerdictQ2("");
    setVerdictOther("");
    setCaseSel({});
    setCaseErr({});
    setShowFinal(false);
    setChoiceFeedback(null);
  };

  return (
    <div className="solutions-wrapper">
      <div className="solutions-header">
        <p className="solutions-label">
          🗄️ CONFIDENTIAL ARCHIVE – AUTHORIZED ACCESS ONLY
        </p>
        <h1 className="solutions-title">Solution Terminal</h1>
        <p className="solutions-tagline">
          Each file below requires a case-specific solution. Input wisely.
        </p>
      </div>

      <div className="solutions-grid">
        {solutions.map((s) => (
          <div
            key={s.slug}
            className="solution-card"
            onClick={() => handleOpen(s)}
          >
            <h3>{s.title}</h3>
            <p>Click to enter your solution</p>
          </div>
        ))}
      </div>

      {activeSolution && (
        <div className="solution-modal-backdrop">
          <div className="solution-modal">
            <h2>{activeSolution.title}</h2>
            <p className="solution-prompt">{activeSolution.prompt}</p>

            {activeSolution.type === "verdict" && activeSolution.verdict && (
              <VerdictForm
                cfg={activeSolution.verdict}
                verdictQ1={verdictQ1}
                setVerdictQ1={setVerdictQ1}
                verdictQ2={verdictQ2}
                setVerdictQ2={setVerdictQ2}
                verdictOther={verdictOther}
                setVerdictOther={setVerdictOther}
              />
            )}

            {activeSolution?.type === "case-matcher" && (
              <div className="caseMatcher">
                {(activeSolution.cases || []).map((cs) => (
                  <div
                    key={cs.id}
                    className={`caseRow ${caseErr[cs.id] ? "is-error" : ""}`}
                  >
                    <div className="caseLabel">{cs.label}</div>
                    <select
                      className="caseSelect"
                      value={caseSel[cs.id] || ""}
                      onChange={(e) =>
                        setCaseSel((prev) => ({
                          ...prev,
                          [cs.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">— Select a crime —</option>
                      {(activeSolution.options || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {caseErr[cs.id] && (
                      <div className="caseHint">Wrong match</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeSolution.type === "choice" ? (
              <div
                className={`choiceWrap ${activeSolution.theme === "valentine" ? "is-valentine" : ""}`}
              >
                <div className="choiceGrid">
                  {(Array.isArray(activeSolution.options)
                    ? activeSolution.options
                    : []
                  ).map((opt) => {
                    const meta = activeSolution?.optionMeta?.[opt] || {};
                    const isSel = userInput === opt;

                    return (
                      <button
                        type="button"
                        key={opt}
                        className={`choiceCard ${isSel ? "is-selected" : ""}`}
                        onClick={() => {
                          setUserInput(opt);
                          setHint("");
                          setIsCorrect(null);
                          setChoiceFeedback(null);
                        }}
                      >
                        <div className="choiceTop">
                          <div className="choiceTitle">
                            {meta.title || "Decision"}
                          </div>
                          <div className="choicePill">
                            {isSel ? "Selected" : "Choose"}
                          </div>
                        </div>

                        <div className="choiceSubtitle">
                          {meta.subtitle || opt}
                        </div>
                        <div className="choiceFull">{opt}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="choiceFootNote">
                  Choose carefully. One interpretation best fits the evidence —
                  and the motive behind the confession.
                </div>
              </div>
            ) : null}

            {(activeSolution.type === "text" ||
              activeSolution.type === "code") && (
              <input
                type="text"
                placeholder="Enter your answer..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className={isCorrect === false ? "input-error" : ""}
              />
            )}

            <div className="actions">
              <button onClick={handleSubmit}>Submit</button>
              <button className="close-btn" onClick={handleClose}>
                Close
              </button>
            </div>

            {/* ✅ Correct */}
            {isCorrect === true && (
              <>
                {activeSolution.type !== "choice" && (
                  <div className="correct">✅ Correct! You solved it.</div>
                )}

                {typeof activeSolution.fullSolutionText === "string" && (
                  <div className="solution-reveal">
                    <p>{activeSolution.fullSolutionText}</p>
                  </div>
                )}

                {activeSolution.reveal &&
                  typeof activeSolution.reveal === "object" && (
                    <div className="solution-reveal">{/* aynı kalsın */}</div>
                  )}
              </>
            )}

            {/* ❌ Incorrect */}
            {isCorrect === false && (
              <p className="incorrect">❌ {hint || "Incorrect. Try again."}</p>
            )}

            {/* ◻️ Neutral (kullanılmıyor ama API uyumu için bırakıldı) */}
            {isCorrect === null && hint && <p className="neutral">{hint}</p>}

            {/* Choice outcome */}

            {activeSolution.type === "choice" && choiceFeedback && (
              <div
                className={`choiceResult ${isCorrect ? "is-correct" : "is-wrong"}`}
              >
                <div className="choiceResultHeader">
                  <div className="choiceResultTitle">
                    {choiceFeedback.headline}
                  </div>

                  <button
                    type="button"
                    className="finalToggleBtn"
                    onClick={() => setShowFinal((v) => !v)}
                  >
                    {showFinal ? "Hide" : "Reveal"}
                  </button>
                </div>

                {showFinal && (
                  <div className="choiceResultText">
                    {(choiceFeedback.text || "")
                      .split("\n\n")
                      .filter(Boolean)
                      .map((p, i) => (
                        <p key={i} className="choicePara">
                          {p}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Solutions;
