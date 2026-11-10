import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge, FormulaBox } from "../components/layout/Primitives";
import { XorOperationVisualizer } from "../components/math/XorOperationVisualizer";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressAxioms = interpolate(frame, [20, 120], [0, 1], { extrapolateRight: "clamp" });
  const progressXorDemo = interpolate(frame, [150, 300], [0, 1], { extrapolateRight: "clamp" });
  const progressPatternMatch = interpolate(frame, [400, 600], [0, 1], { extrapolateRight: "clamp" });

  // Column highlight scanner for XOR demo
  const activeCol = Math.floor(interpolate(frame, [250, 500], [0, 8], { extrapolateRight: "clamp" })) % 8;

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={2}
        category="ALGEBRAIC DOMAIN"
        title="Field Theory & Modulo-2 Arithmetic"
        subtitle="Inside the Galois Field GF(2): where addition and subtraction collapse into Exclusive-OR"
        progress={progressHeader}
      />

      <div style={{ display: "flex", gap: 24, flex: 1 }}>
        {/* Left Column: GF(2) Field Axioms */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, opacity: progressAxioms }}>
          <Card glow="gold" borderColor="rgba(250, 204, 21, 0.4)">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: THEME.fonts.sans }}>
                Galois Field GF(2) Axioms
              </span>
              <Badge label="TWO ELEMENTS: {0, 1}" variant="gold" />
            </div>

            <p style={{ margin: "0 0 16px 0", fontSize: 15, color: THEME.colors.textSecondary, lineHeight: 1.5 }}>
              In ordinary arithmetic, addition generates carries (1 + 1 = 10 in binary). In Galois Field GF(2), operations operate purely on polynomial coefficients modulo two:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormulaBox label="ADDITION MOD 2" formula="1 ⊕ 1 = 0" color={THEME.colors.gold} />
              <FormulaBox label="SUBTRACTION MOD 2" formula="0 ⊖ 1 = 1" color={THEME.colors.cyan} />
              <FormulaBox label="IDENTITY ELEMENT" formula="x ⊕ 0 = x" color={THEME.colors.emerald} />
              <FormulaBox label="INVERSE ELEMENT" formula="x ⊕ x = 0" color={THEME.colors.coral} />
            </div>

            <div
              style={{
                marginTop: 16,
                backgroundColor: "rgba(250, 204, 21, 0.08)",
                padding: "12px 16px",
                borderRadius: 8,
                border: `1px solid rgba(250, 204, 21, 0.3)`,
                fontFamily: THEME.fonts.mono,
                fontSize: 13,
                color: THEME.colors.gold,
              }}
            >
              ★ CORE INVARIANT: Addition ≡ Subtraction. There are ZERO carries and ZERO borrows across digits!
            </div>
          </Card>

          {/* Pattern Matching Rule */}
          <Card
            glow="cyan"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: progressPatternMatch,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: THEME.fonts.sans }}>
                Long Division as Pure Pattern Matching
              </span>
              <Badge label="DECISION RULE" variant="cyan" />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  border: `1px solid ${THEME.colors.emerald}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: THEME.colors.emerald,
                    color: "#000",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: THEME.fonts.mono,
                  }}
                >
                  1
                </div>
                <div>
                  <div style={{ fontFamily: THEME.fonts.mono, fontSize: 13, fontWeight: 700, color: THEME.colors.emerald }}>
                    LEADING BIT IS 1:
                  </div>
                  <div style={{ fontSize: 13, color: THEME.colors.textSecondary }}>
                    Quotient bit = 1 $\rightarrow$ Execute bitwise XOR with Divisor $G(x)$.
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: "rgba(100, 116, 139, 0.12)",
                  border: `1px solid ${THEME.colors.borderSubtle}`,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    backgroundColor: THEME.colors.borderSubtle,
                    color: THEME.colors.textPrimary,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: THEME.fonts.mono,
                  }}
                >
                  0
                </div>
                <div>
                  <div style={{ fontFamily: THEME.fonts.mono, fontSize: 13, fontWeight: 700, color: THEME.colors.textSecondary }}>
                    LEADING BIT IS 0:
                  </div>
                  <div style={{ fontSize: 13, color: THEME.colors.textMuted }}>
                    Quotient bit = 0 $\rightarrow$ Slide window 1 position right without altering bits.
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Live Interactive XOR Execution */}
        <div style={{ flex: 1.1, display: "flex", flexDirection: "column", gap: 20, opacity: progressXorDemo }}>
          <XorOperationVisualizer
            operandA="11010110"
            operandB="10001000"
            result="01011110"
            activeColumn={activeCol}
          />

          <Card style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
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
              Why This Prevents Arithmetic Drift
            </span>
            <p style={{ margin: 0, fontSize: 15, color: THEME.colors.textSecondary, lineHeight: 1.6 }}>
              Because there are no carries propagating to adjacent columns, every bit position in the dividend interacts exclusively with its vertically aligned divisor bit. This algebraic independence is what guarantees that single-bit and burst disturbances produce strictly predictable syndrome remainders.
            </p>
          </Card>
        </div>
      </div>
    </SceneContainer>
  );
};
