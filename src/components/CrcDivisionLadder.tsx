import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../styles/colors";
import { MathInline } from "./MathTex";

export interface DivisionCycle {
  step: number;
  quotientBit: "1" | "0";
  shift: number; // horizontal column offset (0 to 9)
  activeWindowBits: string; // 17 bits before XOR
  subtrahend: string; // 17 bits (poly or zeros)
  isPoly: boolean;
  resultAfterXor: string; // 17 bits (leading 0 + 16 bits)
  pulledDownBit: string | null; // bit pulled from dividend
  pulledDownColIndex: number | null; // column index in dividend (17 to 25)
}

export interface CrcDivisionLadderProps {
  dividend: string; // 26 bits
  divisor: string; // 17 bits
  mode?: "sender" | "receiver-clean" | "receiver-corrupt";
  stepProgress: number; // 0.0 to 10.0
  style?: React.CSSProperties;
}

export const computeDivisionCycles = (dividend: string, divisor: string): DivisionCycle[] => {
  const cur = dividend.split("");
  const cycles: DivisionCycle[] = [];
  const numSteps = dividend.length - (divisor.length - 1); // 10 steps

  for (let i = 0; i < numSteps; i++) {
    const bit = cur[i] as "1" | "0";
    const windowBits = cur.slice(i, i + 17).join("");
    const isPoly = bit === "1";
    const subtrahend = isPoly ? divisor : "0".repeat(17);

    for (let j = 0; j < 17; j++) {
      cur[i + j] = cur[i + j] === subtrahend[j] ? "0" : "1";
    }

    const resBits = cur.slice(i, i + 17).join("");
    const nextCol = i + 17;
    const pulled = nextCol < dividend.length ? dividend[nextCol] : null;

    cycles.push({
      step: i,
      quotientBit: bit,
      shift: i,
      activeWindowBits: windowBits,
      subtrahend,
      isPoly,
      resultAfterXor: resBits,
      pulledDownBit: pulled,
      pulledDownColIndex: pulled !== null ? nextCol : null,
    });
  }

  return cycles;
};

export const CrcDivisionLadder: React.FC<CrcDivisionLadderProps> = ({
  dividend,
  divisor,
  mode = "sender",
  stepProgress,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cycles = React.useMemo(() => computeDivisionCycles(dividend, divisor), [dividend, divisor]);

  // Active step integer and fractional progress
  const activeStepFloat = Math.min(cycles.length - 0.01, Math.max(0, stepProgress));
  const activeStepInt = Math.floor(activeStepFloat);
  const activeStepFrac = activeStepFloat - activeStepInt;

  // Camera tracking: translateY smoothly moves up as ladder cascades downward
  const translateY = interpolate(activeStepFloat, [0, 1, 3, 5, 7, 9], [40, 20, -80, -180, -280, -380], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Cell metrics for 26-bit grid alignment
  const cellW = 34;
  const rowH = 38;
  const leftMargin = 380; // space for divisor on the left

  // Quotient string accumulated so far
  const quotientBits = cycles.slice(0, activeStepInt + 1).map((c) => c.quotientBit);

  const isComplete = stepProgress >= 9.8;
  const finalRemainder =
    mode === "sender"
      ? "1011111011001101"
      : mode === "receiver-clean"
      ? "0000000000000000"
      : "0000000000000001";

  return (
    <div
      style={{
        width: 1920,
        height: 840,
        position: "relative",
        overflow: "hidden",
        backgroundColor: COLORS.canvas,
        fontFamily: "'KaTeX_Main', 'Computer Modern', 'Courier New', monospace",
        ...style,
      }}
    >
      {/* Smooth Spring Viewport Container */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 80,
          width: "100%",
          transform: `translateY(${translateY}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {/* SVG layer for vertical dashed bit-drop arrows */}
        <svg
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: 2000,
            pointerEvents: "none",
            zIndex: 15,
          }}
        >
          {cycles.slice(0, activeStepInt + 1).map((cycle, idx) => {
            if (cycle.pulledDownColIndex === null) return null;

            // Start coordinates at top dividend row
            const startX = leftMargin + cycle.pulledDownColIndex * cellW + cellW / 2;
            const startY = rowH * 2 + 18;

            // Target coordinates at the step's remainder row
            // Each cycle has: Subtrahend row, Remainder row (2 rows per cycle)
            const targetY = rowH * (2 + (idx + 1) * 2) + 18;

            const isCurrentArrow = idx === activeStepInt;
            const arrowProgress = isCurrentArrow ? Math.min(1, activeStepFrac * 2.5) : 1;
            const currentEndY = startY + (targetY - startY) * arrowProgress;

            return (
              <g key={`arrow-${idx}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={startX}
                  y2={currentEndY}
                  stroke={COLORS.gold}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  opacity={isCurrentArrow ? 0.95 : 0.4}
                />
                {arrowProgress > 0.8 && (
                  <polygon
                    points={`${startX - 4},${currentEndY - 6} ${startX + 4},${currentEndY - 6} ${startX},${currentEndY}`}
                    fill={COLORS.gold}
                    opacity={isCurrentArrow ? 1 : 0.4}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 1. TOP QUOTIENT ROW */}
        <div
          style={{
            position: "absolute",
            left: leftMargin,
            top: 0,
            display: "flex",
            alignItems: "center",
            height: rowH,
            zIndex: 20,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: -180,
              fontFamily: "'KaTeX_Main', serif",
              fontSize: 22,
              color: COLORS.textMuted,
            }}
          >
            Quotient Q(x):
          </span>

          {cycles.map((cycle, idx) => {
            const isRevealed = idx <= activeStepInt;
            const isJustRevealed = idx === activeStepInt;

            return (
              <div
                key={idx}
                style={{
                  width: cellW,
                  textAlign: "center",
                  fontSize: 28,
                  fontWeight: 600,
                  color: isJustRevealed ? COLORS.gold : COLORS.textWhite,
                  opacity: isRevealed ? 1 : 0,
                  transform: isJustRevealed ? "scale(1.25)" : "scale(1)",
                  transition: "all 0.2s ease-out",
                }}
              >
                {cycle.quotientBit}
              </div>
            );
          })}
        </div>

        {/* 2. CLASSIC DIVISION HORIZONTAL BAR & DIVISOR */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: rowH,
            width: "100%",
            height: rowH,
            display: "flex",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          {/* Static Divisor G on the left */}
          <div
            style={{
              position: "absolute",
              left: leftMargin - 350,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 22, color: COLORS.textMuted, fontFamily: "'KaTeX_Main', serif" }}>
              Divisor G(x):
            </span>
            <span
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: COLORS.blue,
                letterSpacing: "0.06em",
              }}
            >
              {divisor}
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 300,
                color: COLORS.textWhite,
                marginLeft: 12,
              }}
            >
              )
            </span>
          </div>

          {/* Horizontal Division Bar spanning across all 26 bits */}
          <div
            style={{
              position: "absolute",
              left: leftMargin - 10,
              top: 4,
              width: 26 * cellW + 20,
              height: 2,
              backgroundColor: COLORS.textWhite,
            }}
          />
        </div>

        {/* 3. INITIAL AUGMENTED DIVIDEND ROW */}
        <div
          style={{
            position: "absolute",
            left: leftMargin,
            top: rowH * 2,
            display: "flex",
            alignItems: "center",
            height: rowH,
            zIndex: 10,
          }}
        >
          {dividend.split("").map((b, idx) => {
            const isAugmentedSlot = idx >= 10;
            const isCorruptedBit = mode === "receiver-corrupt" && idx === dividend.length - 1;

            return (
              <div
                key={idx}
                style={{
                  width: cellW,
                  textAlign: "center",
                  fontSize: 26,
                  fontWeight: 600,
                  color: isCorruptedBit
                    ? COLORS.salmon
                    : isAugmentedSlot
                    ? COLORS.gold
                    : COLORS.textWhite,
                }}
              >
                {b}
              </div>
            );
          })}
        </div>

        {/* 4. CASCADING SUBTRAHEND AND REMAINDER ROWS */}
        <div style={{ position: "absolute", left: leftMargin, top: rowH * 3 }}>
          {cycles.slice(0, activeStepInt + 1).map((cycle, idx) => {
            const isCurrentStep = idx === activeStepInt;
            const subtrahendBits = cycle.subtrahend.split("");
            const remainderBits = cycle.resultAfterXor.split("");

            // Active step animation
            const rowEntrance = spring({
              frame: frame - idx * 10,
              fps,
              config: { damping: 14, stiffness: 120 },
            });

            return (
              <div
                key={idx}
                style={{
                  position: "relative",
                  marginBottom: 10,
                  opacity: idx <= activeStepInt ? 1 : 0,
                }}
              >
                {/* SUBTRAHEND ROW (Divisor G or All Zeros) */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: rowH,
                    position: "relative",
                  }}
                >
                  {/* Leading XOR indicator symbol */}
                  <span
                    style={{
                      position: "absolute",
                      left: cycle.shift * cellW - 28,
                      fontSize: 22,
                      fontWeight: 700,
                      color: cycle.isPoly ? COLORS.blue : COLORS.subtrahendZero,
                    }}
                  >
                    ⊕
                  </span>

                  {/* Empty left padding to align with active window */}
                  <div style={{ width: cycle.shift * cellW, height: rowH }} />

                  {/* Subtrahend 17 bits */}
                  {subtrahendBits.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      style={{
                        width: cellW,
                        textAlign: "center",
                        fontSize: 26,
                        fontWeight: 600,
                        color: cycle.isPoly ? COLORS.blue : COLORS.subtrahendZero,
                      }}
                    >
                      {b}
                    </div>
                  ))}
                </div>

                {/* HORIZONTAL XOR RESULT LINE */}
                <div
                  style={{
                    marginLeft: cycle.shift * cellW,
                    width: 17 * cellW + 10,
                    height: 1.5,
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    margin: "2px 0",
                  }}
                />

                {/* REMAINDER ROW AFTER XOR */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: rowH,
                  }}
                >
                  {/* Empty padding */}
                  <div style={{ width: cycle.shift * cellW, height: rowH }} />

                  {/* 17 result bits: index 0 is cancelled leading zero */}
                  {remainderBits.map((rb, rIdx) => {
                    const isCancelled = rIdx === 0;

                    return (
                      <div
                        key={rIdx}
                        style={{
                          width: cellW,
                          textAlign: "center",
                          fontSize: 26,
                          fontWeight: 600,
                          color: isCancelled ? COLORS.textDim : COLORS.textWhite,
                          textDecoration: isCancelled ? "line-through" : "none",
                        }}
                      >
                        {rb}
                      </div>
                    );
                  })}

                  {/* Pulled down bit landing right at the end */}
                  {cycle.pulledDownBit !== null && (
                    <div
                      style={{
                        width: cellW,
                        textAlign: "center",
                        fontSize: 28,
                        fontWeight: 700,
                        color: COLORS.gold,
                        transform: isCurrentStep ? "scale(1.2)" : "scale(1)",
                        transition: "transform 0.2s ease-out",
                      }}
                    >
                      {cycle.pulledDownBit}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. FINAL REMAINING CHECKSUM HIGHLIGHT (WHEN CYCLE 10 COMPLETES) */}
        {isComplete && (
          <div
            style={{
              position: "absolute",
              left: leftMargin + 10 * cellW - 8,
              top: rowH * (3 + 10 * 2) - 8,
              padding: "8px 16px",
              borderRadius: 8,
              border: `2px solid ${
                mode === "receiver-corrupt" ? COLORS.salmon : COLORS.mint
              }`,
              boxShadow: `0 0 20px ${
                mode === "receiver-corrupt"
                  ? "rgba(255, 107, 107, 0.35)"
                  : "rgba(131, 201, 158, 0.35)"
              }`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              zIndex: 30,
            }}
          >
            <span
              style={{
                fontSize: 22,
                color: mode === "receiver-corrupt" ? COLORS.salmon : COLORS.mint,
                fontFamily: "'KaTeX_Main', serif",
              }}
            >
              {mode === "sender"
                ? "CRC Checksum Remainder: "
                : mode === "receiver-clean"
                ? "Syndrome (Zero Error): "
                : "Non-Zero Syndrome Detected: "}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: mode === "receiver-corrupt" ? COLORS.salmon : COLORS.mint,
              }}
            >
              {finalRemainder}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
