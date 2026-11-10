import React from "react";
import { THEME } from "../../styles/theme";
import { Card, Badge } from "../layout/Primitives";

export interface XorOperationVisualizerProps {
  operandA: string;
  operandB: string;
  result: string;
  activeColumn?: number;
  highlightIndices?: number[];
  style?: React.CSSProperties;
}

export const XorOperationVisualizer: React.FC<XorOperationVisualizerProps> = ({
  operandA,
  operandB,
  result,
  activeColumn,
  highlightIndices = [],
  style,
}) => {
  const bitsA = operandA.split("");
  const bitsB = operandB.split("");
  const bitsRes = result.split("");

  return (
    <Card
      glow="cyan"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: THEME.fonts.sans }}>
            Bitwise Modulo-2 Arithmetic Engine
          </span>
          <Badge label="XOR (⊕) NO CARRIES" variant="cyan" />
        </div>
        <div style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.textMuted }}>
          1 ⊕ 1 = 0 • 0 ⊕ 1 = 1 • 1 ⊕ 0 = 1 • 0 ⊕ 0 = 0
        </div>
      </div>

      {/* Aligned Bit Columns */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          padding: "16px 20px",
          borderRadius: 12,
          border: `1px solid ${THEME.colors.borderSubtle}`,
        }}
      >
        {/* Row A */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 90,
              fontFamily: THEME.fonts.mono,
              fontSize: 12,
              color: THEME.colors.textMuted,
            }}
          >
            Dividend
          </span>
          {bitsA.map((bit, i) => {
            const isActive = activeColumn === i;
            return (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  backgroundColor: isActive
                    ? "rgba(56, 189, 248, 0.2)"
                    : "rgba(30, 41, 59, 0.6)",
                  border: `1px solid ${isActive ? THEME.colors.cyan : THEME.colors.borderSubtle}`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: bit === "1" ? THEME.colors.one : THEME.colors.textMuted,
                  boxShadow: isActive ? THEME.shadows.glowCyan : "none",
                }}
              >
                {bit}
              </div>
            );
          })}
        </div>

        {/* Row B with XOR sign */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 90,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: THEME.fonts.mono,
              fontSize: 12,
              color: THEME.colors.gold,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 700 }}>⊕</span>
            <span>Divisor</span>
          </div>
          {bitsB.map((bit, i) => {
            const isActive = activeColumn === i;
            return (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  backgroundColor: isActive
                    ? "rgba(250, 204, 21, 0.2)"
                    : "rgba(30, 41, 59, 0.6)",
                  border: `1px solid ${isActive ? THEME.colors.gold : THEME.colors.borderSubtle}`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: bit === "1" ? THEME.colors.gold : THEME.colors.textMuted,
                  boxShadow: isActive ? THEME.shadows.glowGold : "none",
                }}
              >
                {bit}
              </div>
            );
          })}
        </div>

        {/* Dividing Line */}
        <div
          style={{
            height: 2,
            backgroundColor: THEME.colors.borderSubtle,
            margin: "4px 0 4px 96px",
          }}
        />

        {/* Result Row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 90,
              fontFamily: THEME.fonts.mono,
              fontSize: 12,
              color: THEME.colors.emerald,
              fontWeight: 700,
            }}
          >
            Remainder
          </span>
          {bitsRes.map((bit, i) => {
            const isActive = activeColumn === i;
            const isZeroed = bit === "0" && bitsA[i] === "1" && bitsB[i] === "1";

            return (
              <div
                key={i}
                style={{
                  width: 38,
                  height: 38,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  backgroundColor: isZeroed
                    ? "rgba(34, 197, 94, 0.2)"
                    : isActive
                    ? "rgba(56, 189, 248, 0.2)"
                    : "rgba(30, 41, 59, 0.8)",
                  border: `1.5px solid ${
                    isZeroed
                      ? THEME.colors.emerald
                      : isActive
                      ? THEME.colors.cyan
                      : THEME.colors.borderSubtle
                  }`,
                  fontFamily: THEME.fonts.mono,
                  fontSize: 18,
                  fontWeight: 700,
                  color: isZeroed
                    ? THEME.colors.emerald
                    : bit === "1"
                    ? THEME.colors.gold
                    : THEME.colors.textMuted,
                  boxShadow: isZeroed ? THEME.shadows.glowEmerald : "none",
                }}
              >
                {bit}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
