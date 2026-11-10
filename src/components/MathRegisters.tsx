import React from "react";
import { COLORS } from "../styles/colors";

export interface BitStringProps {
  bits: string;
  label?: string;
  sublabel?: string;
  splitIndex?: number;
  highlightIndex?: number;
  highlightColor?: string;
  cellSize?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}

export const FloatingBitString: React.FC<BitStringProps> = ({
  bits,
  label,
  sublabel,
  splitIndex,
  highlightIndex,
  highlightColor = COLORS.gold,
  cellSize = 38,
  fontSize = 26,
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "18px 0",
        fontFamily: "'KaTeX_Main', 'Computer Modern', monospace",
        ...style,
      }}
    >
      {label && (
        <div
          style={{
            fontSize: 22,
            color: COLORS.textMuted,
            marginBottom: 8,
            fontFamily: "'KaTeX_Main', serif",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{label}</span>
          {sublabel && (
            <span style={{ fontSize: 16, color: COLORS.blue }}>({sublabel})</span>
          )}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
        {bits.split("").map((bit, idx) => {
          const isHighlighted = idx === highlightIndex;
          const isRightOfSplit = splitIndex !== undefined && idx >= splitIndex;

          const color = isHighlighted
            ? highlightColor
            : isRightOfSplit
            ? COLORS.gold
            : COLORS.textWhite;

          return (
            <React.Fragment key={idx}>
              <div
                style={{
                  width: cellSize,
                  textAlign: "center",
                  fontSize,
                  fontWeight: 600,
                  color,
                  position: "relative",
                  transition: "all 0.2s ease",
                }}
              >
                {bit}

                {/* Delicate animated bounding box if highlighted */}
                {isHighlighted && (
                  <div
                    style={{
                      position: "absolute",
                      left: 2,
                      top: -4,
                      width: cellSize - 4,
                      height: fontSize + 10,
                      border: `2px solid ${highlightColor}`,
                      borderRadius: 6,
                      boxShadow: `0 0 12px ${highlightColor}44`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </div>

              {/* Vertical divider bar at split point */}
              {splitIndex !== undefined && idx === splitIndex - 1 && (
                <div
                  style={{
                    width: 2,
                    height: fontSize + 8,
                    backgroundColor: COLORS.textMuted,
                    margin: "0 6px",
                    opacity: 0.7,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
