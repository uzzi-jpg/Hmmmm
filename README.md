# 🧮 Math Solver — AI-Powered Step-by-Step Calculator

An AI-powered mathematics calculator built with **React** and the **Anthropic Claude API**. It solves virtually any math problem and shows every step of its working — from basic algebra to university-level calculus.

---

## ✨ Features

- **Step-by-step solutions** — every non-trivial manipulation is explained clearly
- **Wide subject coverage** — Calculus, Trigonometry, Algebra, Limits, Integrals, Differential Equations, and more
- **Symbol toolbar** — one-click insertion of ∫, ∂, √, π, ∞, ±, and other math symbols
- **Quick examples** — 6 preloaded problems to get started instantly
- **Typewriter animation** — solution streams in character by character
- **Recent history** — last 4 problems are saved; click any to reload
- **Keyboard shortcut** — `Ctrl + Enter` to solve

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Claude API key from [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/math-solver.git
cd math-solver

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

### Setup

This project uses the Anthropic API directly from the browser (via the artifact environment). If running standalone, create a Vite project and configure your API key:

```bash
npm create vite@latest math-solver -- --template react
cd math-solver
npm install
```

Place `math-calculator.jsx` as your main component and import it in `App.jsx`.

---

## 🗂️ Project Structure

```
math-solver/
├── src/
│   ├── math-calculator.jsx   # Main calculator component
│   └── App.jsx               # Entry point
├── public/
├── index.html
├── package.json
└── README.md
```

---

## 🧠 How It Works

The calculator sends your problem to **Claude Sonnet** via the Anthropic API with a carefully engineered system prompt that instructs the model to:

1. Restate the problem clearly
2. Describe the approach/strategy
3. Work through every step explicitly
4. State the final answer prominently
5. Add notes on formulas or alternative methods

### Response format

```
PROBLEM:   [restated problem]
APPROACH:  [strategy description]
STEPS:
  Step 1: [title] — [working]
  Step 2: [title] — [working]
  ...
ANSWER:    [final result]
NOTES:     [optional insights]
```

---

## 📐 Supported Topics

| Category | Examples |
|---|---|
| **Differentiation** | Product rule, chain rule, implicit, logarithmic, inverse trig |
| **Integration** | u-substitution, by parts, trig substitution, partial fractions |
| **Limits** | L'Hôpital's rule, squeeze theorem, indeterminate forms |
| **Trigonometry** | Identities, exact values, inverse functions |
| **Algebra** | Quadratics, polynomials, systems of equations |
| **Linear Algebra** | Matrices, determinants, eigenvalues |
| **Series** | Taylor/Maclaurin, convergence tests |
| **Differential Equations** | First-order ODEs, separable, linear |

---

## ⌨️ Usage Examples

```
∫ x²·sin(x) dx
d/dx [ln(x² + 3x)]
Solve: 2x² - 5x + 3 = 0
sin(75°) exact value
lim(x→0) sin(x)/x
∫₀^π sin(x) dx
Find eigenvalues of [[2,1],[1,2]]
Solve dy/dx = y·sin(x)
```

---

## 🛠️ Tech Stack

- **React** + **Vite** — UI framework and build tool
- **Anthropic Claude API** (`claude-sonnet-4-20250514`) — AI math engine
- **Google Fonts** — Syne (display) + Space Mono (monospace)
- **Pure CSS** — no UI library, custom dark terminal aesthetic

---

## 📄 License

MIT License. Free to use, modify, and distribute.

---

> Built with Claude · Anthropic API · React
