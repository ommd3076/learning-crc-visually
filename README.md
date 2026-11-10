# Learning CRC Visually (Cyclic Redundancy Check)

> A programmatic, 1080p 30fps mathematical explanation of Cyclic Redundancy Check (CRC-16 / CCITT) in the pedagogical style of **3Blue1Brown (Grant Sanderson)**, powered by **Remotion** and local **Kokoro-82M TTS** with **Zero Dead-Air (Continuous Audio Synchronization)**.

---

## 📐 Mathematical Ground Truth & Lab Notebook Benchmark

This project programmatically animates and proves the exact binary modulo-2 long division verified in the laboratory notebook:

### 1. Specification & Parameters
- **Dataword ($D$)**: `1101011011` (10 bits)
- **Generator Polynomial ($G(x)$)**: CRC-16 / CRC-CCITT standard:
  $$G(x) = x^{16} + x^{12} + x^{5} + 1$$
  - Bit Vector (17 bits): `10001000000100001`
  - Degree ($r$): `16`
- **Augmented Dividend**:
  $$D(x) \cdot x^{16} = \texttt{11010110110000000000000000} \quad \text{(26 bits: 10 data + 16 zeros)}$$

### 2. Sender Long Division Result
- Binary Modulo-2 (XOR) long division yields quotient $Q = \texttt{1101101101}$
- **Exact CRC Remainder ($R$)**: `1011111011001101` (16 bits)
- **Transmitted Codeword ($T$)**:
  $$T = D \mathbin{\Vert} \text{CRC} = \texttt{11010110111011111011001101}$$

### 3. Receiver Verification Scenarios
- **Scenario A (Clean Intact Transmission)**:
  - Input: `11010110111011111011001101`
  - Long division by $G(x)$ yields remainder `0000000000000000` (16 zeros) $\rightarrow$ **Accepted**.
- **Scenario B (Single Tail Bit Corruption)**:
  - Input: `11010110111011111011001100` (last bit flipped $1 \rightarrow 0$)
  - Long division by $G(x)$ yields non-zero syndrome remainder `0000000000000001` $\rightarrow$ **Rejected**.

---

## 🎙️ Zero Dead-Air Audio Synchronization Architecture

1. **Strict Audio-Driven Timeline**: Under no circumstance is there silent negative space or animation without voiceover.
2. **Dynamic Clamping**:
   $$\text{durationInFrames} = \lceil\text{audioDurationSeconds} \times 30\rceil$$
3. **Continuous Acoustic Bed**: Subtle, warm ambient drone pad (`public/audio/ambient_bed.mp3` at `0.08` volume) loops continuously behind the academic voiceover.
4. **Local TTS Engine (Kokoro-82M)**: High-fidelity speech synthesized offline using ONNX runtime and voice `bm_george`. Exact timings are probed via `soundfile` and exported directly into `src/audioTimings.json`.

---

## 🎬 Narrative Scenes Breakdown

| Scene | Title | Timing (s) | Frame Count (30fps) | Focus |
|---|---|---|---|---|
| **Act 1** | The Channel Noise Paradox | 27.97s | 840 | Parity check failure under 2-bit burst error |
| **Act 2** | Field Theory & Modulo-2 Arithmetic | 32.00s | 960 | Galois Field $\text{GF}(2)$, $1 \oplus 1 = 0$, no carries |
| **Act 3** | Structuring the Dividend & Degree-16 Generator | 40.36s | 1211 | $x^{16} + x^{12} + x^5 + 1$ mapping & 16 zero padding |
| **Act 4** | The Modulo-2 Long Division Engine | 51.81s | 1555 | Sender 10-step division ladder yielding remainder `1011111011001101` |
| **Act 5** | Receiver Verification: Clean Invariant | 39.06s | 1172 | Error-free codeword reduction to 16 zeros |
| **Act 6** | Detecting Corruption: The Non-Zero Syndrome | 35.14s | 1055 | Corrupted tail bit yielding non-zero syndrome `...0001` |
| **Total** | **Complete Feature Explainer** | **226.34s** | **6793 frames** | **Zero dead air across ~3m 46s** |

---

## 🚀 Quickstart & Commands

### Prerequisites
- Node.js $\ge 18$
- Python $\ge 3.10$ with `kokoro-onnx` and `soundfile`
- FFmpeg (on system PATH)

### Install Dependencies
```bash
npm install
pip install kokoro-onnx soundfile sounddevice
```

### Synthesize Audio Tracks
```bash
npm run generate-audio
```

### Preview in Remotion Studio
```bash
npm run start
```

### Render 1080p 30fps Video
```bash
npm run render
```
or rapid preview render:
```bash
npm run render-fast
```

---

## 🎨 3Blue1Brown Visual Aesthetics
- **Dark Slate Background**: `#0d1117` with subtle coordinate grid overlay.
- **Accents**: 3B1B Cyan (`#38bdf8`), Gold (`#facc15`), Emerald (`#22c55e`), Coral (`#ef4444`).
- **Typography**: Monospace (`JetBrains Mono`) for polynomials, bit vectors, and registers; Clean Sans (`Inter`) for conceptual hierarchy.
- **Kinematics**: Smooth Remotion physics-based spring dampening for cards and cascading ladder rows.
