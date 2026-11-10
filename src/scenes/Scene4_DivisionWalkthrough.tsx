import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { GrantTitle, MathTex } from "../components/MathTex";
import { CrcDivisionLadder } from "../components/CrcDivisionLadder";
import { FloatingBitString } from "../components/MathRegisters";

export const Scene4_DivisionWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Map 2046 frames smoothly across the 10 cycles (each cycle gets ~170 frames)
  // Step 0 to 9.99 from frame 120 to 1800
  const stepProgress = interpolate(frame, [120, 1800], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showCodeword = frame >= 1820;
  const progressCodeword = interpolate(frame, [1820, 1920], [0, 1], { extrapolateRight: "clamp" });

  const dividend = "11010110110000000000000000";
  const divisor = "10001000000100001";
  const finalCodeword = "11010110111011111011001101";

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1700, height: "100%", display: "flex", flexDirection: "column" }}>
        <GrantTitle
          title="The Modulo-2 Long Division Engine"
          subtitle="Step-by-step XOR reduction: 1 → Generator, 0 → All Zeros"
          style={{ marginBottom: 12 }}
        />

        {/* Division Ladder with Spring Camera Kinematics */}
        <div style={{ flex: 1, position: "relative" }}>
          <CrcDivisionLadder
            dividend={dividend}
            divisor={divisor}
            mode="sender"
            stepProgress={stepProgress}
          />
        </div>

        {/* Final Transmitted Codeword Reveal */}
        {showCodeword && (
          <div
            style={{
              opacity: progressCodeword,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <div style={{ fontSize: 24, color: COLORS.mint, marginBottom: 4 }}>
              Transmitted Codeword T = Payload (10 bits) || Checksum (16 bits):
            </div>
            <FloatingBitString
              bits={finalCodeword}
              splitIndex={10}
              sublabel="10 Data Bits || 16 Forged CRC Bits"
              cellSize={38}
              fontSize={24}
              highlightColor={COLORS.mint}
            />
          </div>
        )}
      </div>
    </VoidCanvas>
  );
};
