import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { MathTex, GrantTitle } from "../components/MathTex";
import { FloatingBitString } from "../components/MathRegisters";

export const Scene1_Intro: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressParity = interpolate(frame, [40, 150], [0, 1], { extrapolateRight: "clamp" });
  const progressNoise = interpolate(frame, [250, 400], [0, 1], { extrapolateRight: "clamp" });
  const progressConclusion = interpolate(frame, [500, 680], [0, 1], { extrapolateRight: "clamp" });

  const noiseActive = frame >= 300;

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1400 }}>
        <GrantTitle
          title="The Channel Noise Paradox"
          subtitle="Why simple parity checks fail against real-world physical burst corruption"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 40,
            gap: 36,
          }}
        >
          {/* Parity Definition */}
          <div style={{ opacity: progressParity, textAlign: "center" }}>
            <div style={{ fontSize: 26, color: COLORS.textMuted, marginBottom: 12 }}>
              Classical Single-Bit Parity (Sum Modulo 2):
            </div>
            <MathTex math="P = d_0 \oplus d_1 \oplus d_2 \oplus \dots \oplus d_{n-1}" fontSize={42} color={COLORS.blue} />
          </div>

          {/* Original and Corrupted Data Comparison */}
          <div style={{ opacity: progressNoise, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
            <FloatingBitString
              bits="110101100"
              label="Original Transmitted Payload"
              sublabel="Sum = 4 (Even) → Parity = 0"
              splitIndex={8}
              cellSize={44}
              fontSize={30}
            />

            {noiseActive && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 22, color: COLORS.salmon, fontStyle: "italic" }}>
                  ⚡ Thermal noise flips two bits simultaneously in transit (bits 2 and 6):
                </span>
                <FloatingBitString
                  bits="111101000"
                  label="Received Payload with 2-Bit Burst Error"
                  sublabel="Sum = 4 → Parity Still 0!"
                  splitIndex={8}
                  highlightIndex={2}
                  highlightColor={COLORS.salmon}
                  cellSize={44}
                  fontSize={30}
                />
              </div>
            )}
          </div>

          {/* Mathematical Conclusion */}
          <div style={{ opacity: progressConclusion, textAlign: "center", marginTop: 20 }}>
            <MathTex
              math="\Delta P = 1 \oplus 1 = 0 \implies \text{Dual-Bit Corruption Passes Completely Undetected!}"
              fontSize={34}
              color={COLORS.salmon}
            />
            <div style={{ fontSize: 28, color: COLORS.mint, marginTop: 16 }}>
              The Solution: Shift from arithmetic sums to Polynomial Ring Algebra in GF(2)[x]
            </div>
          </div>
        </div>
      </div>
    </VoidCanvas>
  );
};
