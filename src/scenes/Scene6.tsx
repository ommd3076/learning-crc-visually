import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge, FormulaBox } from "../components/layout/Primitives";
import { DivisionLadder } from "../components/math/DivisionLadder";

export const Scene6: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  // Step progression across 1055 frames
  const stepProgress = interpolate(frame, [60, 850], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showRejection = frame >= 860;
  const progressRejection = interpolate(frame, [860, 980], [0, 1], { extrapolateRight: "clamp" });

  const corruptedCodeword = "11010110111011111011001100"; // Last bit flipped
  const divisor = "10001000000100001";

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={6}
        category="CORRUPTION DETECTION"
        title="Detecting Corruption: The Non-Zero Syndrome"
        subtitle="A single corrupted tail bit shatters the algebraic invariant, producing syndrome 0000000000000001"
        progress={progressHeader}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {/* Receiver Division Ladder on Corrupted Data */}
        <DivisionLadder
          initialDividend={corruptedCodeword}
          divisor={divisor}
          title="Receiver Modulo-2 Division (Scenario B: Bit Flipped)"
          mode="receiver-corrupt"
          stepProgress={stepProgress}
          style={{ flex: 1 }}
        />

        {/* Rejection Alert Card */}
        {showRejection && (
          <Card
            glow="coral"
            borderColor={THEME.colors.coral}
            style={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: progressRejection,
              transform: `translateY(${(1 - progressRejection) * 12}px)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 13,
                    color: THEME.colors.coral,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  SYNDROME POLYNOMIAL S(x) ≠ 0 DETECTED
                </span>
                <Badge label="BURST / BIT ERROR FLAGGED" variant="coral" />
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <FormulaBox
                  label="RECEIVED WITH NOISE E(x)"
                  formula="T'(x) = T(x) ⊕ E(x)"
                  color={THEME.colors.coral}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 24, color: THEME.colors.textMuted }}>⟹</span>
                <FormulaBox
                  label="SYNDROME EQUATION"
                  formula="S(x) = E(x) mod G(x)"
                  color={THEME.colors.gold}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 24, color: THEME.colors.textMuted }}>⟹</span>
                <FormulaBox
                  label="EXACT LAB REMAINDER"
                  formula="Remainder: ...00000001"
                  color={THEME.colors.coral}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div style={{ textAlign: "right", marginLeft: 24 }}>
              <Badge
                label="PACKET REJECTED • RETRANSMIT NACK"
                variant="coral"
                style={{ fontSize: 14, padding: "8px 18px" }}
              />
            </div>
          </Card>
        )}
      </div>
    </SceneContainer>
  );
};
