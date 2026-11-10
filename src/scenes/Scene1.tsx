import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge } from "../components/layout/Primitives";
import { BitVector } from "../components/math/BitVector";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress variables across the 840 frames
  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressChannel = interpolate(frame, [20, 80], [0, 1], { extrapolateRight: "clamp" });
  const progressParity = interpolate(frame, [100, 200], [0, 1], { extrapolateRight: "clamp" });
  const progressNoise = interpolate(frame, [250, 380], [0, 1], { extrapolateRight: "clamp" });
  const progressSolution = interpolate(frame, [500, 650], [0, 1], { extrapolateRight: "clamp" });

  const noiseActive = frame >= 300;

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={1}
        category="FOUNDATIONS"
        title="The Channel Noise Paradox"
        subtitle="Why simple parity checks fail against real-world physical burst corruption"
        progress={progressHeader}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
        {/* Transmission Channel Diagram */}
        <Card
          glow="cyan"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 36px",
            opacity: progressChannel,
          }}
        >
          {/* Transmitter TX */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Badge label="TRANSMITTER (TX)" variant="cyan" />
            <span style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.textMuted }}>
              Raw Bit Stream
            </span>
          </div>

          {/* Physical Medium Waveform */}
          <div
            style={{
              flex: 1,
              margin: "0 30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 12,
                color: noiseActive ? THEME.colors.coral : THEME.colors.textMuted,
                marginBottom: 6,
                letterSpacing: "0.1em",
              }}
            >
              PHYSICAL CHANNEL (COPPER / FIBER) • {noiseActive ? "THERMAL NOISE INJECTED" : "NOMINAL"}
            </div>

            <svg width="600" height="40" style={{ overflow: "visible" }}>
              <path
                d="M 0 20 Q 75 5, 150 20 T 300 20 T 450 20 T 600 20"
                fill="none"
                stroke={noiseActive ? THEME.colors.coral : THEME.colors.cyan}
                strokeWidth="2.5"
                strokeDasharray={noiseActive ? "6,3" : "none"}
              />
              {noiseActive && (
                <circle cx="300" cy="20" r="10" fill="rgba(239, 68, 68, 0.3)" stroke={THEME.colors.coral} />
              )}
            </svg>
          </div>

          {/* Receiver RX */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Badge label="RECEIVER (RX)" variant={noiseActive ? "coral" : "emerald"} />
            <span style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.textMuted }}>
              Integrity Verifier
            </span>
          </div>
        </Card>

        {/* Parity Blind Spot Demonstration */}
        <div style={{ display: "flex", gap: 24, flex: 1, opacity: progressParity }}>
          {/* Left: Original Data & Parity */}
          <Card style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: THEME.fonts.sans }}>
                1. Single-Bit Parity (Even Parity)
              </span>
              <Badge label="1 PARITY BIT" variant="neutral" />
            </div>

            <p style={{ margin: 0, fontSize: 15, color: THEME.colors.textSecondary, lineHeight: 1.5 }}>
              Parity sums all data bits modulo two. If the sum is even, the parity bit is 0; if odd, 1.
            </p>

            <BitVector
              bits="110101100"
              splitIndex={8}
              splitLabelLeft="Data Bytes"
              splitLabelRight="Parity"
              showIndices
              label="Original Payload"
              sublabel="Sum = 4 (Even) → Parity = 0"
              cellSize={38}
            />

            <div
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid ${THEME.colors.borderSubtle}`,
                fontFamily: THEME.fonts.mono,
                fontSize: 13,
                color: THEME.colors.emerald,
              }}
            >
              ✓ Parity Verified: 1 + 1 + 0 + 1 + 0 + 1 + 1 + 0 = 4 ≡ 0 (mod 2)
            </div>
          </Card>

          {/* Right: The Double-Bit Flip Failure */}
          <Card
            glow={noiseActive ? "coral" : "none"}
            borderColor={noiseActive ? THEME.colors.coral : THEME.colors.borderSubtle}
            style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, opacity: progressNoise }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: THEME.fonts.sans, color: THEME.colors.coral }}>
                2. The Fatal Blind Spot (Dual Bit Flip)
              </span>
              <Badge label="CRITICAL FAILURE" variant="coral" />
            </div>

            <p style={{ margin: 0, fontSize: 15, color: THEME.colors.textSecondary, lineHeight: 1.5 }}>
              A 2-bit burst error flips bits 2 and 7 during transmission. The sum remains exactly 4!
            </p>

            <BitVector
              bits="111101000"
              splitIndex={8}
              splitLabelLeft="Corrupted Bits"
              splitLabelRight="Parity"
              highlightIndices={[2, 6]}
              highlightColor={THEME.colors.coral}
              showIndices
              label="Received Payload with Dual-Bit Corruption"
              sublabel="Corrupted Sum = 4 → Parity Still 0!"
              cellSize={38}
            />

            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid ${THEME.colors.coral}`,
                fontFamily: THEME.fonts.mono,
                fontSize: 13,
                color: THEME.colors.coral,
                fontWeight: 700,
              }}
            >
              ⚠ UNDETECTED ERROR: Parity test reports valid packet despite severe data corruption!
            </div>
          </Card>
        </div>

        {/* Solution Callout */}
        <Card
          glow="cyan"
          borderColor={THEME.colors.cyan}
          style={{
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: progressSolution,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 12,
                color: THEME.colors.cyan,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              The Modern Paradigm Shift
            </span>
            <div style={{ fontSize: 20, fontWeight: 800, color: THEME.colors.textPrimary, marginTop: 2 }}>
              Polynomial Ring Algebra & Cyclic Redundancy Check (CRC)
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Badge label="BURST DETECTION" variant="emerald" />
            <Badge label="ALGEBRAIC INVARIANCE" variant="gold" />
            <Badge label="ZERO BLIND SPOTS" variant="cyan" />
          </div>
        </Card>
      </div>
    </SceneContainer>
  );
};
