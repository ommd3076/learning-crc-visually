import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge, FormulaBox } from "../components/layout/Primitives";
import { DivisionLadder } from "../components/math/DivisionLadder";

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  // Step progression across 1172 frames
  const stepProgress = interpolate(frame, [60, 950], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showTheory = frame >= 960;
  const progressTheory = interpolate(frame, [960, 1080], [0, 1], { extrapolateRight: "clamp" });

  const receivedCodeword = "11010110111011111011001101";
  const divisor = "10001000000100001";

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={5}
        category="RECEIVER VERIFICATION"
        title="Receiver Verification: The Clean Invariant"
        subtitle="Evaluating the entire incoming codeword against the generator polynomial"
        progress={progressHeader}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {/* Receiver Division Ladder */}
        <DivisionLadder
          initialDividend={receivedCodeword}
          divisor={divisor}
          title="Receiver Modulo-2 Division (Scenario A: Error-Free)"
          mode="receiver-clean"
          stepProgress={stepProgress}
          style={{ flex: 1 }}
        />

        {/* Theoretical Invariant Card */}
        {showTheory && (
          <Card
            glow="emerald"
            borderColor={THEME.colors.emerald}
            style={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: progressTheory,
              transform: `translateY(${(1 - progressTheory) * 12}px)`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 13,
                    color: THEME.colors.emerald,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  THE ALGEBRAIC REASONING BEHIND THE ZERO REMAINDER
                </span>
                <Badge label="INVARIANT VERIFIED" variant="emerald" />
              </div>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <FormulaBox
                  label="CONSTRUCTION"
                  formula="T(x) = D(x)·x¹⁶ ⊕ R(x)"
                  color={THEME.colors.cyan}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 24, color: THEME.colors.textMuted }}>⟹</span>
                <FormulaBox
                  label="MULTIPLE OF G(x)"
                  formula="T(x) = Q(x) · G(x)"
                  color={THEME.colors.gold}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 24, color: THEME.colors.textMuted }}>⟹</span>
                <FormulaBox
                  label="REMAINDER COLLAPSE"
                  formula="T(x) mod G(x) ≡ 0"
                  color={THEME.colors.emerald}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div style={{ textAlign: "right", marginLeft: 24 }}>
              <Badge
                label="PACKET ACCEPTED • 0 ERRORS"
                variant="emerald"
                style={{ fontSize: 14, padding: "8px 18px" }}
              />
            </div>
          </Card>
        )}
      </div>
    </SceneContainer>
  );
};
