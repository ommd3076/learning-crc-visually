import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../../styles/theme";
import { Card, Badge } from "../layout/Primitives";

export interface DivisionStep {
  stepIndex: number;
  quotientBit: string;
  shift: number;
  activeBits: string;
  divisorApplied: string;
  resultBits: string;
  pulledDownBit: string | null;
}

export interface DivisionLadderProps {
  initialDividend: string;
  divisor: string;
  title: string;
  mode: "sender" | "receiver-clean" | "receiver-corrupt";
  stepProgress: number; // 0 to 10
  style?: React.CSSProperties;
}

export const computeDivisionSteps = (dividend: string, divisor: string): DivisionStep[] => {
  const cur = list(dividend);
  const steps: DivisionStep[] = [];
  const numDataBits = dividend.length - (divisor.length - 1);

  for (let i = 0; i < numDataBits; i++) {
    const bit = cur[i];
    const active = cur.slice(i, i + divisor.length).join("");
    let applied = "";

    if (bit === "1") {
      applied = divisor;
      for (let j = 0; j < divisor.length; j++) {
        cur[i + j] = cur[i + j] === divisor[j] ? "0" : "1";
      }
    } else {
      applied = "0".repeat(divisor.length);
    }

    const res = cur.slice(i, i + divisor.length).join("");
    const pulled = i + divisor.length < dividend.length ? dividend[i + divisor.length] : null;

    steps.push({
      stepIndex: i,
      quotientBit: bit,
      shift: i,
      activeBits: active,
      divisorApplied: applied,
      resultBits: res,
      pulledDownBit: pulled,
    });
  }

  return steps;
};

function list(str: string): string[] {
  return str.split("");
}

export const DivisionLadder: React.FC<DivisionLadderProps> = ({
  initialDividend,
  divisor,
  title,
  mode,
  stepProgress,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allSteps = React.useMemo(
    () => computeDivisionSteps(initialDividend, divisor),
    [initialDividend, divisor]
  );

  const activeStepInt = Math.floor(stepProgress);
  const visibleSteps = allSteps.slice(0, Math.min(allSteps.length, activeStepInt + 1));

  // Determine final remainder
  const finalRemainder =
    mode === "sender"
      ? "1011111011001101"
      : mode === "receiver-clean"
      ? "0000000000000000"
      : "0000000000000001";

  const quotientSoFar = allSteps
    .slice(0, activeStepInt + 1)
    .map((s) => s.quotientBit)
    .join("");

  const isCompleted = stepProgress >= allSteps.length - 0.2;

  // Spring entrance for ladder
  const ladderSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Calculate cell width to fit 26 bits neatly
  const cellWidth = 36;
  const cellHeight = 28;

  return (
    <Card
      glow={
        isCompleted
          ? mode === "receiver-corrupt"
            ? "coral"
            : "emerald"
          : "cyan"
      }
      borderColor={
        isCompleted
          ? mode === "receiver-corrupt"
            ? THEME.colors.coral
            : THEME.colors.emerald
          : "rgba(56, 189, 248, 0.4)"
      }
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflow: "hidden",
        position: "relative",
        opacity: ladderSpring,
        ...style,
      }}
    >
      {/* Top Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: THEME.fonts.sans,
              fontSize: 20,
              fontWeight: 800,
              color: THEME.colors.textPrimary,
            }}
          >
            {title}
          </span>
          <Badge
            label={
              mode === "sender"
                ? "SENDER ENGINE (ENCODING)"
                : mode === "receiver-clean"
                ? "RECEIVER SCENARIO A (INTACT)"
                : "RECEIVER SCENARIO B (CORRUPTED)"
            }
            variant={
              mode === "receiver-corrupt"
                ? "coral"
                : mode === "receiver-clean"
                ? "emerald"
                : "cyan"
            }
          />
        </div>

        {/* Quotient Display */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            padding: "6px 14px",
            borderRadius: 8,
            border: `1px solid ${THEME.colors.borderSubtle}`,
          }}
        >
          <span style={{ fontFamily: THEME.fonts.mono, fontSize: 12, color: THEME.colors.textMuted }}>
            QUOTIENT Q(x):
          </span>
          <span
            style={{
              fontFamily: THEME.fonts.mono,
              fontSize: 16,
              fontWeight: 700,
              color: THEME.colors.gold,
              letterSpacing: "0.1em",
            }}
          >
            {quotientSoFar || "—"}
          </span>
        </div>
      </div>

      {/* Division Ladder Canvas */}
      <div
        style={{
          backgroundColor: "#070a0f",
          borderRadius: 12,
          padding: "16px 20px",
          border: `1px solid ${THEME.colors.borderSubtle}`,
          position: "relative",
          maxHeight: 520,
          overflowY: "auto",
        }}
      >
        {/* Dividend Row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
          <div
            style={{
              width: 140,
              fontFamily: THEME.fonts.mono,
              fontSize: 12,
              color: THEME.colors.cyan,
              fontWeight: 700,
            }}
          >
            DIVIDEND D(x)
          </div>

          <div style={{ display: "flex", gap: 3 }}>
            {initialDividend.split("").map((b, idx) => {
              const isAugmentedSlot = idx >= 10;
              const isFlippedBit = mode === "receiver-corrupt" && idx === initialDividend.length - 1;

              return (
                <div
                  key={idx}
                  style={{
                    width: cellWidth,
                    height: cellHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    backgroundColor: isFlippedBit
                      ? "rgba(239, 68, 68, 0.3)"
                      : isAugmentedSlot
                      ? "rgba(250, 204, 21, 0.12)"
                      : "rgba(56, 189, 248, 0.12)",
                    border: `1px solid ${
                      isFlippedBit
                        ? THEME.colors.coral
                        : isAugmentedSlot
                        ? "rgba(250, 204, 21, 0.4)"
                        : "rgba(56, 189, 248, 0.4)"
                    }`,
                    fontFamily: THEME.fonts.mono,
                    fontSize: 15,
                    fontWeight: 700,
                    color: isFlippedBit
                      ? THEME.colors.coral
                      : isAugmentedSlot
                      ? THEME.colors.gold
                      : THEME.colors.cyan,
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>
        </div>

        {/* Cascading Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {visibleSteps.map((step, sIdx) => {
            const isCurrent = sIdx === activeStepInt;
            const appliedBits = step.divisorApplied.split("");

            return (
              <div
                key={sIdx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                  padding: "4px 0",
                  borderLeft: isCurrent ? `2px solid ${THEME.colors.cyan}` : "2px solid transparent",
                  paddingLeft: 4,
                  backgroundColor: isCurrent ? "rgba(56, 189, 248, 0.04)" : "transparent",
                  borderRadius: 4,
                }}
              >
                {/* Divisor row (XOR) */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 140,
                      fontFamily: THEME.fonts.mono,
                      fontSize: 11,
                      color: step.quotientBit === "1" ? THEME.colors.gold : THEME.colors.textMuted,
                    }}
                  >
                    {step.quotientBit === "1" ? "⊕ Divisor G(x)" : "↷ Shift 0"}
                  </div>

                  {/* Offset empty spaces */}
                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: step.shift }).map((_, padIdx) => (
                      <div key={padIdx} style={{ width: cellWidth, height: cellHeight }} />
                    ))}

                    {/* Divisor bits */}
                    {appliedBits.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        style={{
                          width: cellWidth,
                          height: cellHeight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          backgroundColor:
                            b === "1" ? "rgba(250, 204, 21, 0.15)" : "rgba(30, 41, 59, 0.3)",
                          border: `1px solid ${
                            b === "1" ? "rgba(250, 204, 21, 0.3)" : "rgba(51, 65, 85, 0.3)"
                          }`,
                          fontFamily: THEME.fonts.mono,
                          fontSize: 14,
                          fontWeight: 700,
                          color: b === "1" ? THEME.colors.gold : THEME.colors.textMuted,
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remainder row after XOR */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 140,
                      fontFamily: THEME.fonts.mono,
                      fontSize: 11,
                      color: THEME.colors.emerald,
                      fontWeight: 700,
                    }}
                  >
                    = Step {sIdx + 1} Rem
                  </div>

                  <div style={{ display: "flex", gap: 3 }}>
                    {Array.from({ length: step.shift }).map((_, padIdx) => (
                      <div key={padIdx} style={{ width: cellWidth, height: cellHeight }} />
                    ))}

                    {step.resultBits.split("").map((rb, rIdx) => {
                      const isLeadingZero = rIdx === 0;
                      return (
                        <div
                          key={rIdx}
                          style={{
                            width: cellWidth,
                            height: cellHeight,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 4,
                            backgroundColor: isLeadingZero
                              ? "rgba(100, 116, 139, 0.1)"
                              : "rgba(34, 197, 94, 0.12)",
                            border: `1px solid ${
                              isLeadingZero
                                ? "rgba(100, 116, 139, 0.3)"
                                : "rgba(34, 197, 94, 0.3)"
                            }`,
                            fontFamily: THEME.fonts.mono,
                            fontSize: 14,
                            fontWeight: 700,
                            color: isLeadingZero ? THEME.colors.textMuted : THEME.colors.emerald,
                            textDecoration: isLeadingZero ? "line-through" : "none",
                          }}
                        >
                          {rb}
                        </div>
                      );
                    })}

                    {/* Pull down arrow/bit */}
                    {step.pulledDownBit !== null && (
                      <div
                        style={{
                          width: cellWidth,
                          height: cellHeight,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 4,
                          backgroundColor: "rgba(56, 189, 248, 0.2)",
                          border: `1px dashed ${THEME.colors.cyan}`,
                          fontFamily: THEME.fonts.mono,
                          fontSize: 14,
                          fontWeight: 700,
                          color: THEME.colors.cyan,
                          boxShadow: THEME.shadows.glowCyan,
                        }}
                      >
                        ↓{step.pulledDownBit}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner: Final CRC Remainder or Syndrome */}
        {isCompleted && (
          <div
            style={{
              marginTop: 16,
              padding: "14px 20px",
              borderRadius: 10,
              backgroundColor:
                mode === "receiver-corrupt"
                  ? "rgba(239, 68, 68, 0.15)"
                  : mode === "receiver-clean"
                  ? "rgba(34, 197, 94, 0.15)"
                  : "rgba(56, 189, 248, 0.15)",
              border: `2px solid ${
                mode === "receiver-corrupt"
                  ? THEME.colors.coral
                  : mode === "receiver-clean"
                  ? THEME.colors.emerald
                  : THEME.colors.cyan
              }`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow:
                mode === "receiver-corrupt"
                  ? THEME.shadows.glowCoral
                  : mode === "receiver-clean"
                  ? THEME.shadows.glowEmerald
                  : THEME.shadows.glowCyan,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color:
                    mode === "receiver-corrupt"
                      ? THEME.colors.coral
                      : mode === "receiver-clean"
                      ? THEME.colors.emerald
                      : THEME.colors.cyan,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                {mode === "sender"
                  ? "CRC-16 REMAINDER CHECKSUM (16 BITS)"
                  : mode === "receiver-clean"
                  ? "SYNDROME REMAINDER (ALL ZEROS)"
                  : "NON-ZERO SYNDROME DETECTED"}
              </div>
              <div
                style={{
                  fontFamily: THEME.fonts.mono,
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                  color: THEME.colors.textPrimary,
                  marginTop: 2,
                }}
              >
                {finalRemainder}
              </div>
            </div>

            <Badge
              label={
                mode === "sender"
                  ? "TRANSMIT CODEWORD READY"
                  : mode === "receiver-clean"
                  ? "PACKET ACCEPTED • ERROR FREE"
                  : "PACKET REJECTED • CORRUPTION FLAGGED"
              }
              variant={
                mode === "receiver-corrupt"
                  ? "coral"
                  : mode === "receiver-clean"
                  ? "emerald"
                  : "cyan"
              }
              style={{ fontSize: 13, padding: "6px 14px" }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};
