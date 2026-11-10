import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../styles/colors";
import { MathTex, MathInline } from "./MathTex";

export const XorTruthTable: React.FC<{ progress?: number; style?: React.CSSProperties }> = ({
  progress = 1,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: progress,
        ...style,
      }}
    >
      <div style={{ fontSize: 24, color: COLORS.blue, fontFamily: "'KaTeX_Main', serif" }}>
        Addition & Subtraction in Galois Field GF(2):
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 32,
          marginTop: 10,
        }}
      >
        <MathTex math="0 \oplus 0 = 0" fontSize={34} color={COLORS.textWhite} />
        <MathTex math="0 \oplus 1 = 1" fontSize={34} color={COLORS.gold} />
        <MathTex math="1 \oplus 0 = 1" fontSize={34} color={COLORS.gold} />
        <MathTex math="1 \oplus 1 = 0" fontSize={34} color={COLORS.mint} />
      </div>

      <div
        style={{
          fontSize: 22,
          color: COLORS.textMuted,
          fontStyle: "italic",
          marginTop: 8,
          fontFamily: "'KaTeX_Main', serif",
        }}
      >
        No carries across columns. No borrows across digits.
      </div>
    </div>
  );
};

export const PolynomialMappingVisualizer: React.FC<{
  polyFormula: string;
  bitVector: string;
  activePowers?: number[];
  style?: React.CSSProperties;
}> = ({ polyFormula, bitVector, activePowers = [16, 12, 5, 0], style }) => {
  const bits = bitVector.split("");
  const totalBits = bits.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        ...style,
      }}
    >
      <MathTex math={polyFormula} fontSize={46} color={COLORS.blue} />

      {/* Bit alignment with powers */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {bits.map((b, idx) => {
          const power = totalBits - 1 - idx;
          const isActive = activePowers.includes(power);

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 44,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  color: isActive ? COLORS.gold : COLORS.textDim,
                  fontFamily: "'KaTeX_Main', serif",
                  marginBottom: 6,
                }}
              >
                x^{power}
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: isActive ? COLORS.gold : COLORS.textMuted,
                  fontFamily: "'KaTeX_Main', monospace",
                }}
              >
                {b}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
