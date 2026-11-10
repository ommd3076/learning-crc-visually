import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge } from "../components/layout/Primitives";
import { DivisionLadder } from "../components/math/DivisionLadder";
import { BitVector } from "../components/math/BitVector";

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  
  // Step progression across the 1555 frames (10 division steps)
  // Step 0 to 9.99 between frames 60 and 1250
  const stepProgress = interpolate(frame, [60, 1250], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showCodeword = frame >= 1260;
  const progressCodeword = interpolate(frame, [1260, 1360], [0, 1], { extrapolateRight: "clamp" });

  const dividend = "11010110110000000000000000";
  const divisor = "10001000000100001";
  const finalCodeword = "11010110111011111011001101";

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={4}
        category="SENDER EXECUTION"
        title="The Modulo-2 Long Division Engine"
        subtitle="Step-by-step XOR reduction forging the 16-bit CRC checksum remainder"
        progress={progressHeader}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
        {/* Animated Division Ladder */}
        <DivisionLadder
          initialDividend={dividend}
          divisor={divisor}
          title="Sender Long Division Ladder"
          mode="sender"
          stepProgress={stepProgress}
          style={{ flex: 1 }}
        />

        {/* Final Transmitted Codeword Card */}
        {showCodeword && (
          <Card
            glow="emerald"
            borderColor={THEME.colors.emerald}
            style={{
              padding: "16px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: progressCodeword,
              transform: `translateY(${(1 - progressCodeword) * 15}px)`,
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    fontFamily: THEME.fonts.mono,
                    fontSize: 12,
                    color: THEME.colors.emerald,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                  }}
                >
                  TRANSMITTED CODEWORD T = DATA || CRC CHECKSUM
                </span>
                <Badge label="26 BITS" variant="emerald" />
              </div>
              <div style={{ marginTop: 8 }}>
                <BitVector
                  bits={finalCodeword}
                  splitIndex={10}
                  splitLabelLeft="Data Bits D"
                  splitLabelRight="Forged CRC-16 Checksum"
                  cellSize={32}
                  fontSize={15}
                />
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4 }}>
              <Badge label="READY FOR TRANSMISSION" variant="emerald" style={{ fontSize: 13 }} />
              <span style={{ fontFamily: THEME.fonts.mono, fontSize: 12, color: THEME.colors.textMuted }}>
                1101011011 ⊕ 1011111011001101
              </span>
            </div>
          </Card>
        )}
      </div>
    </SceneContainer>
  );
};
