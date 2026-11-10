# Learning CRC Visually (Cyclic Redundancy Check)

> An authentic **3Blue1Brown (Grant Sanderson / Manim style)** educational video explaining **Cyclic Redundancy Check (CRC-16 / CCITT)** from first principles, engineered under the **Argon Architectural Specification** with **pure black void canvas**, **pristine KaTeX mathematics**, and **Zero Dead-Air (Continuous Audio Synchronization)**.

---

## 📐 Mathematical Ground Truth & Lab Notebook Benchmark

This explainer models and proves the exact binary modulo-2 long division verified in the laboratory notebook:

### 1. Parameters & Specification
- **Dataword ($D$)**: `1101011011` (10 bits)
- **Generator Polynomial ($G(x)$)**: CRC-16 / CRC-CCITT:
  $$G(x) = x^{16} + x^{12} + x^5 + 1 \longleftrightarrow \texttt{10001000000100001}_2 \quad (\deg = 16)$$
- **Augmented Dividend**:
  $$D(x) \cdot x^{16} = \texttt{11010110110000000000000000} \quad \text{(26 bits: 10 data + 16 zeros)}$$

### 2. Classic Handwritten Division Bracket Layout

$$\begin{array}{r@{\quad}l}
\text{Quotient:} & \texttt{1 1 0 1 0 1 1 0 1 1} \\
\text{Divisor} \quad \texttt{10001000000100001} & \overline{\smash{\big)}\; \texttt{1101011011 0000000000000000}}
\end{array}$$

#### Deterministic Iteration Logic across 10 Cycles:
For each cycle $k \in [0, 9]$:
1. **Evaluate Leading Bit of Active Window**:
   - **Case `1`**: Quotient bit $\rightarrow \texttt{1}$, Subtrahend is Generator $\texttt{10001000000100001}$ (in 3B1B Blue `#58c4dd`), XOR cancels leading bit to $0$.
   - **Case `0`**: Quotient bit $\rightarrow \texttt{0}$, Subtrahend is Seventeen Zeros $\texttt{00000000000000000}$ (in Muted Gray `#555555`), XOR leaves bits unchanged.
2. **Bring Down Next Bit**:
   - Next bit from top dividend row drops down via animated glowing vertical dashed arrow (`#f4d03f`).
3. **Repeat** across all 10 cycles until final 16-bit remainder is forged:
   $$\text{CRC Remainder } R(x) = \texttt{1011111011001101}_2 \quad (\text{Mint Green } \#83c99e)$$
4. **Transmitted Codeword ($T$)**:
   $$T = D \mathbin{\Vert} R = \texttt{11010110111011111011001101} \quad (26\text{ bits})$$

---

## 🎨 Authentic 3Blue1Brown Aesthetic
- **Solid Pitch-Black Canvas**: Pure `#000000` void (no cards, no container borders, no UI badges, no telemetry HUD).
- **Computer Modern LaTeX Typography**: Rendered via KaTeX (`katex/dist/katex.min.css`) with classic mathematical serif fonts.
- **Grant Sanderson Palette**:
  - Math Baseline: `#ffffff`
  - Generator Divisor: `#58c4dd`
  - Active Bits / Pulldown Arrows: `#f4d03f`
  - Zero Subtrahend Rows: `#555555`
  - Remainder / Clean Validation: `#83c99e`
  - Error Indicator / Non-Zero Syndrome: `#ff6b6b`
- **Dynamic Camera Kinematics**: Viewport smoothly translates upward (`translateY`) with `spring()` physics as the division ladder cascades, keeping the active XOR row centered in the viewer's focal area.

---

## 🎙️ Zero Dead-Air Audio Synchronization

$$\text{durationInFrames} = \lceil\text{audioDurationSeconds} \times 30\rceil$$

Every Remotion sequence duration is strictly clamped to studio-quality narration synthesized offline with **Kokoro-82M ONNX** (voice `bm_george`), accompanied by a continuous warm harmonic ambient acoustic bed (`ambient_bed.mp3` at `0.08` volume).

| Scene | Title | Timing (s) | Frame Count (30fps) | Focus |
|---|---|---|---|---|
| **Scene 1** | The Channel Noise Paradox | 26.94s | 809 | 2-bit burst error parity blind spot |
| **Scene 2** | Field Theory & Modulo-2 Arithmetic | 34.28s | 1029 | Galois Field $\text{GF}(2)$, $1 \oplus 1 = 0$, no carries |
| **Scene 3** | Structuring the Dividend & Degree-16 Generator | 36.97s | 1110 | $x^{16} + x^{12} + x^5 + 1$ mapping & 16 zero padding |
| **Scene 4** | Sender Long Division Walkthrough | 68.18s | 2046 | 10-cycle ladder with 1-vs-0 subtrahend logic |
| **Scene 5** | Receiver Verification: Clean Invariant | 36.67s | 1101 | $T(x) \pmod{G(x)} \equiv 0$, 16 zeros remainder |
| **Scene 6** | Detecting Corruption: Non-Zero Syndrome | 35.05s | 1052 | Bit 25 flipped, syndrome $\texttt{...0001} \neq 0$ |
| **Total** | **Crc3B1BExplainer** | **238.23s** | **7147 frames** | **Continuous ~4min audio-visual explainer** |

---

## 🚀 Commands

### Synthesize Audio
```bash
npm run generate-audio
```

### Preview in Remotion Studio
```bash
npm run start
```

### Render Full 1080p 30fps Video
```bash
npm run render
```
