import React from "react";
import { THEME } from "../../styles/theme";

export interface BitVectorProps {
  bits: string;
  label?: string;
  sublabel?: string;
  highlightIndices?: number[];
  highlightColor?: string;
  colorMap?: Record<number, string>;
  splitIndex?: number;
  splitLabelLeft?: string;
  splitLabelRight?: string;
  showIndices?: boolean;
  powerIndices?: boolean; // Show x^k powers
  cellSize?: number;
  fontSize?: number;
  activeWindow?: { start: number; length: number; label?: string };
  style?: React.CSSProperties;
  staggerProgress?: number; // 0 to 1 for progressive entrance
}

export const BitVector: React.FC<BitVectorProps> = ({
  bits,
  label,
  sublabel,
  highlightIndices = [],
  highlightColor = THEME.colors.cyan,
  colorMap = {},
  splitIndex,
  splitLabelLeft,
  splitLabelRight,
  showIndices = false,
  powerIndices = false,
  cellSize = 44,
  fontSize = 20,
  activeWindow,
  style,
  staggerProgress = 1,
}) => {
  const bitArray = bits.split("");
  const totalBits = bitArray.length;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {(label || sublabel) && (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            marginBottom: 10,
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {label && (
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 14,
                fontWeight: 700,
                color: THEME.colors.textSecondary,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 12,
                color: THEME.colors.textMuted,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}

      {/* Split header indicators if provided */}
      {splitIndex !== undefined && (splitLabelLeft || splitLabelRight) && (
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: 6,
            fontFamily: THEME.fonts.mono,
            fontSize: 11,
            color: THEME.colors.textMuted,
            letterSpacing: "0.05em",
          }}
        >
          <div
            style={{
              width: `${(splitIndex / totalBits) * 100}%`,
              textAlign: "center",
              borderBottom: `2px solid ${THEME.colors.cyan}`,
              paddingBottom: 4,
              color: THEME.colors.cyan,
              fontWeight: 700,
            }}
          >
            {splitLabelLeft} ({splitIndex} bits)
          </div>
          <div
            style={{
              width: `${((totalBits - splitIndex) / totalBits) * 100}%`,
              textAlign: "center",
              borderBottom: `2px solid ${THEME.colors.gold}`,
              paddingBottom: 4,
              color: THEME.colors.gold,
              fontWeight: 700,
            }}
          >
            {splitLabelRight} ({totalBits - splitIndex} bits)
          </div>
        </div>
      )}

      {/* Main Bits Row */}
      <div
        style={{
          display: "flex",
          position: "relative",
          gap: 6,
          padding: 8,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          borderRadius: 12,
          border: `1px solid ${THEME.colors.borderSubtle}`,
        }}
      >
        {/* Active sliding window bounding highlight */}
        {activeWindow && (
          <div
            style={{
              position: "absolute",
              left: 8 + activeWindow.start * (cellSize + 6) - 4,
              top: 4,
              width: activeWindow.length * (cellSize + 6) + 2,
              height: cellSize + 8,
              border: `2px solid ${THEME.colors.cyan}`,
              borderRadius: 8,
              backgroundColor: "rgba(56, 189, 248, 0.12)",
              boxShadow: THEME.shadows.glowCyan,
              pointerEvents: "none",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              zIndex: 5,
            }}
          >
            {activeWindow.label && (
              <span
                style={{
                  position: "absolute",
                  top: -22,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: THEME.fonts.mono,
                  fontSize: 11,
                  color: THEME.colors.cyan,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  backgroundColor: THEME.colors.bgDark,
                  padding: "1px 6px",
                  borderRadius: 4,
                  border: `1px solid ${THEME.colors.cyan}`,
                }}
              >
                {activeWindow.label}
              </span>
            )}
          </div>
        )}

        {bitArray.map((bit, index) => {
          const isHighlighted = highlightIndices.includes(index);
          const customColor = colorMap[index];
          const isSplitBorder = splitIndex !== undefined && index === splitIndex - 1;
          
          // Progressive entrance animation
          const revealThreshold = index / totalBits;
          const isVisible = staggerProgress >= revealThreshold;
          const cellScale = isVisible ? Math.min(1, (staggerProgress - revealThreshold) * 10 + 0.8) : 0;
          const cellOpacity = isVisible ? 1 : 0;

          const bitColor =
            customColor ||
            (isHighlighted
              ? highlightColor
              : bit === "1"
              ? THEME.colors.one
              : THEME.colors.textMuted);

          return (
            <React.Fragment key={index}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: cellOpacity,
                  transform: `scale(${cellScale})`,
                }}
              >
                {/* Optional Index or Power */}
                {(showIndices || powerIndices) && (
                  <span
                    style={{
                      fontFamily: THEME.fonts.mono,
                      fontSize: 10,
                      color: isHighlighted ? highlightColor : THEME.colors.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {powerIndices ? `x^${totalBits - 1 - index}` : index}
                  </span>
                )}

                {/* Bit Cell */}
                <div
                  style={{
                    width: cellSize,
                    height: cellSize,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 8,
                    backgroundColor: isHighlighted
                      ? "rgba(56, 189, 248, 0.16)"
                      : "rgba(30, 41, 59, 0.8)",
                    border: `1.5px solid ${isHighlighted ? highlightColor : "rgba(71, 85, 105, 0.4)"}`,
                    fontFamily: THEME.fonts.mono,
                    fontSize,
                    fontWeight: 700,
                    color: bitColor,
                    boxShadow: isHighlighted ? `0 0 12px ${highlightColor}44` : "none",
                    position: "relative",
                  }}
                >
                  {bit}
                </div>
              </div>

              {/* Vertical separation bar at split point */}
              {isSplitBorder && (
                <div
                  style={{
                    width: 2,
                    height: cellSize,
                    backgroundColor: THEME.colors.gold,
                    alignSelf: "flex-end",
                    margin: "0 2px",
                    opacity: 0.8,
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
