import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { MathTex, GrantTitle } from "../components/MathTex";
import { XorTruthTable } from "../components/MathAnimationUtils";

export const Scene2_MathTheory: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressAxioms = interpolate(frame, [30, 150], [0, 1], { extrapolateRight: "clamp" });
  const progressTable = interpolate(frame, [180, 350], [0, 1], { extrapolateRight: "clamp" });
  const progressPattern = interpolate(frame, [450, 700], [0, 1], { extrapolateRight: "clamp" });

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1400 }}>
        <GrantTitle
          title="Field Theory & Modulo-2 Arithmetic"
          subtitle="Inside the Galois Field GF(2): where addition and subtraction collapse into Exclusive-OR"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 40,
            gap: 40,
          }}
        >
          {/* Core Axioms */}
          <div style={{ opacity: progressAxioms, textAlign: "center" }}>
            <MathTex
              math="a \oplus b \equiv a \ominus b \pmod 2"
              fontSize={50}
              color={COLORS.gold}
            />
            <div style={{ fontSize: 26, color: COLORS.textMuted, marginTop: 10 }}>
              Addition is completely identical to Subtraction. Carries and borrows do not exist.
            </div>
          </div>

          {/* Truth Table */}
          <XorTruthTable progress={progressTable} />

          {/* Pattern Matching Rule */}
          <div
            style={{
              opacity: progressPattern,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              marginTop: 10,
            }}
          >
            <div style={{ fontSize: 28, color: COLORS.blue }}>
              The Long Division Decision Invariant:
            </div>

            <div style={{ display: "flex", gap: 60, marginTop: 12 }}>
              <div style={{ textAlign: "center" }}>
                <MathTex math="\text{Leading Bit} = 1 \implies \text{Subtrahend} = G(x)" fontSize={34} color={COLORS.gold} />
                <div style={{ fontSize: 20, color: COLORS.textMuted }}>XOR with 17-bit Generator Polynomial</div>
              </div>

              <div style={{ textAlign: "center" }}>
                <MathTex math="\text{Leading Bit} = 0 \implies \text{Subtrahend} = \mathbf{0}" fontSize={34} color={COLORS.subtrahendZero} />
                <div style={{ fontSize: 20, color: COLORS.textMuted }}>XOR with 17 Zeros (Window Shifts Forward)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VoidCanvas>
  );
};
