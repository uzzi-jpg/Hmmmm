import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an elite mathematics engine. When given a math problem, solve it completely and show every step clearly.

Format your response EXACTLY like this:

PROBLEM: [restate the problem clearly]

APPROACH: [1-2 sentences on what method/strategy you'll use]

STEPS:
Step 1: [title]
[explanation and working]

Step 2: [title]
[explanation and working]

... (as many steps as needed)

ANSWER: [final clean answer, boxed or highlighted clearly]

NOTES: [optional: key formulas used, alternative approaches, or insights]

Rules:
- Use proper mathematical notation (use ^ for exponents, √ for roots, π for pi, ∫ for integral, etc.)
- Be thorough but clear — show every non-trivial algebraic manipulation
- For calculus: show chain rule, product rule steps explicitly
- For trigonometry: show identities used
- For equations: verify the solution by substitution when appropriate
- Always give a definitive numerical or symbolic answer`;

const examples = [
  "∫ x²·sin(x) dx",
  "d/dx [ln(x² + 3x)]",
  "Solve: 2x² - 5x + 3 = 0",
  "sin(75°) exact value",
  "lim(x→0) sin(x)/x",
  "∫₀^π sin(x) dx",
];

function TypewriterText({ text, speed = 8 }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(0);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    ref.current = 0;
    const interval = setInterval(() => {
      if (ref.current < text.length) {
        setDisplayed(text.slice(0, ref.current + 1));
        ref.current++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayed}{!done && <span className="cursor">▋</span>}</span>;
}

function formatMathText(text) {
  // Split by lines, apply formatting
  return text.split("\n").map((line, i) => {
    if (line.startsWith("PROBLEM:")) {
      return <div key={i} className="section problem"><span className="label">PROBLEM</span><span className="content">{line.replace("PROBLEM:", "").trim()}</span></div>;
    }
    if (line.startsWith("APPROACH:")) {
      return <div key={i} className="section approach"><span className="label">APPROACH</span><span className="content">{line.replace("APPROACH:", "").trim()}</span></div>;
    }
    if (line.startsWith("ANSWER:")) {
      return <div key={i} className="section answer"><span className="label">✓ ANSWER</span><span className="content">{line.replace("ANSWER:", "").trim()}</span></div>;
    }
    if (line.startsWith("NOTES:")) {
      return <div key={i} className="section notes"><span className="label">NOTES</span><span className="content">{line.replace("NOTES:", "").trim()}</span></div>;
    }
    if (line.startsWith("STEPS:")) {
      return <div key={i} className="steps-header">SOLUTION STEPS</div>;
    }
    if (/^Step \d+:/.test(line)) {
      const match = line.match(/^(Step \d+): (.+)/);
      if (match) {
        return <div key={i} className="step-title"><span className="step-num">{match[1]}</span><span>{match[2]}</span></div>;
      }
    }
    if (line.trim() === "") return <div key={i} className="spacer" />;
    return <div key={i} className="step-line">{line}</div>;
  });
}

export default function MathCalculator() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  const solve = async (query) => {
    const q = query || input.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: q }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "No response.";
      setResult(text);
      setHistory(h => [{ q, a: text }, ...h.slice(0, 4)]);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) solve();
  };

  const insertSymbol = (sym) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = input.slice(0, start) + sym + input.slice(end);
    setInput(newVal);
    setTimeout(() => {
      ta.setSelectionRange(start + sym.length, start + sym.length);
      ta.focus();
    }, 0);
  };

  const symbols = ["∫", "∂", "√", "∑", "π", "∞", "±", "≤", "≥", "≠", "→", "°", "²", "³", "·", "÷"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #080c14; }

        .app {
          min-height: 100vh;
          background: #080c14;
          color: #e8eaf0;
          font-family: 'Space Mono', monospace;
          padding: 2rem 1rem 4rem;
          position: relative;
          overflow-x: hidden;
        }

        .grid-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,200,150,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,200,150,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .glow-orb {
          position: fixed;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,220,130,0.06) 0%, transparent 70%);
          top: -200px; right: -200px;
          pointer-events: none; z-index: 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          position: relative; z-index: 1;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-badge {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #00dc82;
          background: rgba(0,220,130,0.1);
          border: 1px solid rgba(0,220,130,0.2);
          padding: 4px 14px;
          border-radius: 2px;
          margin-bottom: 1.2rem;
          text-transform: uppercase;
        }

        .header h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 6vw, 3.8rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.05;
          background: linear-gradient(135deg, #fff 30%, #00dc82 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          margin-top: 0.8rem;
          font-size: 0.8rem;
          color: #556;
          letter-spacing: 0.05em;
        }

        .input-card {
          background: #0d1220;
          border: 1px solid #1a2340;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          position: relative;
          transition: border-color 0.2s;
        }
        .input-card:focus-within {
          border-color: rgba(0,220,130,0.35);
        }

        .input-label {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: #445;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }

        .symbol-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 1rem;
        }

        .sym-btn {
          background: #131928;
          border: 1px solid #1e2d40;
          color: #00dc82;
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          line-height: 1.4;
        }
        .sym-btn:hover {
          background: rgba(0,220,130,0.1);
          border-color: rgba(0,220,130,0.3);
        }

        textarea {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #e8eaf0;
          font-family: 'Space Mono', monospace;
          font-size: 1.05rem;
          line-height: 1.6;
          resize: none;
          min-height: 80px;
        }
        textarea::placeholder { color: #2a3555; }

        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #121c2f;
        }

        .hint {
          font-size: 0.65rem;
          color: #2a3555;
          letter-spacing: 0.05em;
        }

        .solve-btn {
          background: linear-gradient(135deg, #00dc82, #00a86b);
          color: #060a10;
          border: none;
          padding: 10px 28px;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
        }
        .solve-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px rgba(0,220,130,0.3);
        }
        .solve-btn:disabled {
          opacity: 0.5; cursor: not-allowed;
        }

        .examples {
          margin-bottom: 2rem;
        }
        .examples-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #334;
          text-transform: uppercase;
          margin-bottom: 0.7rem;
        }
        .examples-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ex-chip {
          background: #0d1220;
          border: 1px solid #1a2340;
          color: #6a8fa8;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          padding: 5px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .ex-chip:hover {
          border-color: rgba(0,220,130,0.25);
          color: #00dc82;
          background: rgba(0,220,130,0.05);
        }

        .loading-box {
          background: #0d1220;
          border: 1px solid #1a2340;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
        }
        .spinner {
          width: 36px; height: 36px;
          border: 2px solid #1a2340;
          border-top-color: #00dc82;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.2rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text {
          font-size: 0.75rem;
          color: #445;
          letter-spacing: 0.1em;
          animation: pulse 1.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }

        .result-card {
          background: #0d1220;
          border: 1px solid #1a2340;
          border-radius: 12px;
          overflow: hidden;
        }

        .result-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #121c2f;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .result-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #00dc82;
          box-shadow: 0 0 8px #00dc82;
        }
        .result-title {
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #556;
          text-transform: uppercase;
        }

        .result-body {
          padding: 1.5rem;
          line-height: 1.7;
          font-size: 0.85rem;
        }

        .section {
          padding: 0.8rem 1rem;
          border-radius: 6px;
          margin-bottom: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .section.problem { background: rgba(100,120,200,0.08); border-left: 3px solid #4466cc; }
        .section.approach { background: rgba(180,160,60,0.08); border-left: 3px solid #c8a830; }
        .section.answer { background: rgba(0,220,130,0.1); border-left: 3px solid #00dc82; }
        .section.notes { background: rgba(80,80,100,0.15); border-left: 3px solid #445; }

        .label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          font-weight: 700;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .section.answer .label { color: #00dc82; opacity: 1; }
        .section.problem .label { color: #6688ee; }
        .section.approach .label { color: #c8a830; }

        .content { font-size: 0.88rem; color: #cdd5e0; }
        .section.answer .content { font-size: 1.05rem; color: #00dc82; font-weight: 700; }

        .steps-header {
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: #334;
          text-transform: uppercase;
          margin: 1.2rem 0 0.6rem;
          padding-bottom: 6px;
          border-bottom: 1px solid #131928;
        }

        .step-title {
          display: flex;
          gap: 10px;
          align-items: baseline;
          margin: 1rem 0 0.3rem;
          color: #fff;
          font-weight: 700;
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
        }
        .step-num {
          color: #00dc82;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          white-space: nowrap;
        }

        .step-line {
          color: #8a9bb8;
          font-size: 0.82rem;
          padding-left: 0.5rem;
          line-height: 1.8;
        }

        .spacer { height: 0.4rem; }

        .cursor {
          animation: blink 1s step-end infinite;
          color: #00dc82;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .error-box {
          background: rgba(220,60,60,0.1);
          border: 1px solid rgba(220,60,60,0.3);
          border-radius: 8px;
          padding: 1rem 1.5rem;
          color: #e05555;
          font-size: 0.82rem;
        }

        .history {
          margin-top: 2rem;
        }
        .history-label {
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          color: #334;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }
        .history-item {
          background: #0a0f1c;
          border: 1px solid #131928;
          border-radius: 6px;
          padding: 0.7rem 1rem;
          margin-bottom: 6px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        .history-item:hover {
          border-color: rgba(0,220,130,0.2);
          background: rgba(0,220,130,0.03);
        }
        .history-q {
          font-size: 0.78rem;
          color: #6a8fa8;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .history-arrow { color: #334; font-size: 0.7rem; flex-shrink: 0; }
      `}</style>

      <div className="app">
        <div className="grid-bg" />
        <div className="glow-orb" />

        <div className="container">
          <div className="header">
            <div className="header-badge">AI-Powered · Step-by-Step</div>
            <h1>Math Solver</h1>
            <p>CALCULUS · TRIGONOMETRY · ALGEBRA · LINEAR ALGEBRA · AND MORE</p>
          </div>

          <div className="input-card">
            <div className="input-label">Enter your problem</div>
            <div className="symbol-bar">
              {symbols.map(s => (
                <button key={s} className="sym-btn" onClick={() => insertSymbol(s)}>{s}</button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g.  ∫ x·eˣ dx   or   Find d/dx of sin(x²)·ln(x)   or   Solve: x³ - 6x + 9 = 0"
              rows={3}
            />
            <div className="input-footer">
              <span className="hint">Ctrl+Enter to solve</span>
              <button className="solve-btn" onClick={() => solve()} disabled={loading || !input.trim()}>
                {loading ? "Solving..." : "Solve →"}
              </button>
            </div>
          </div>

          <div className="examples">
            <div className="examples-label">Try an example</div>
            <div className="examples-list">
              {examples.map(ex => (
                <button key={ex} className="ex-chip" onClick={() => { setInput(ex); setTimeout(() => solve(ex), 50); }}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="loading-box">
              <div className="spinner" />
              <div className="loading-text">Computing solution...</div>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          {result && !loading && (
            <div className="result-card" ref={resultRef}>
              <div className="result-header">
                <div className="result-dot" />
                <div className="result-title">Solution</div>
              </div>
              <div className="result-body">
                <TypewriterText text={result} speed={6} />
              </div>
            </div>
          )}

          {history.length > 1 && (
            <div className="history">
              <div className="history-label">Recent problems</div>
              {history.slice(1).map((h, i) => (
                <div key={i} className="history-item" onClick={() => { setInput(h.q); setResult(h.a); }}>
                  <span className="history-q">{h.q}</span>
                  <span className="history-arrow">↩</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
