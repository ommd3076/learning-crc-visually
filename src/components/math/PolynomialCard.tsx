import React from "react";
import { THEME } from "../../styles/theme";
import { Card, Badge } from "../layout/Primitives";

export interface PolynomialCardProps {
  title: string;
  polyName: string;
  algebraicFormula: string;
  bitString: string;
  degree: number;
  highlightExponents?: number[];
  style?: React.CSSProperties;
}

export const PolynomialCard: React.FC<PolynomialCardProps> = ({
  title,
  polyName,
  algebraicFormula,
  bitString,
  degree,
  highlightExponents = [16, 12, 5, 0],
  style,
}) => {
  const bits = bitString.split("");
  const totalLength = bits.length;

  return (
    <Card
      glow="cyan"
      borderColor="rgba(56, 189, 248, 0.4)"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: THEME.colors.textPrimary,
              fontFamily: THEME.fonts.sans,
            }}
          >
            {title}
          </span>
          <Badge label={polyName} variant="cyan" />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Badge label={`DEGREE r = ${degree}`} variant="gold" />
          <Badge label={`${totalLength} BITS`} variant="neutral" />
        </div>
      </div>

      {/* Algebraic Representation */}
      <div
        style={{
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          borderRadius: 10,
          padding: "16px 20px",
          border: `1px solid ${THEME.colors.borderSubtle}`,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 12,
            color: THEME.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Polynomial Algebra in GF(2)[x]
        </span>
        <div
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 28,
            fontWeight: 700,
            color: THEME.colors.cyan,
            letterSpacing: "0.02em",
          }}
        >
          {algebraicFormula}
        </div>
      </div>

      {/* Bit Mapping View */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span
          style={{
            fontFamily: THEME.fonts.mono,
            fontSize: 12,
            color: THEME.colors.textMuted,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Direct Coefficient Mapping (Power Alignment)
        </span>

        <div
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            padding: "8px 0",
          }}
        >
          {bits.map((b, i) => {
            const exp = totalLength - 1 - i;
            const isNonZeroTerm = highlightExponents.includes(exp);

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 42,
                }}
              >
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 11,
                    color: isNonZeroTerm ? THEME.colors.gold : THEME.colors.textMuted,
                    fontWeight: isNonZeroTerm ? 700 : 400,
                    marginBottom: 4,
                  }}
                >
                  x^{exp}
                </span>

                <div
                  style={{
                    width: "100%",
                    height: 38,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                    backgroundColor: isNonZeroTerm
                      ? "rgba(250, 204, 21, 0.15)"
                      : "rgba(30, 41, 59, 0.4)",
                    border: `1.5px solid ${
                      isNonZeroTerm ? THEME.colors.gold : THEME.colors.borderSubtle
                    }`,
                    fontFamily: THEME.fonts.mono,
                    fontSize: 18,
                    fontWeight: 700,
                    color: isNonZeroTerm ? THEME.colors.gold : THEME.colors.textMuted,
                  }}
                >
                  {b}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
