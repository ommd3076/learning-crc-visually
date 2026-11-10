import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { GrantTitle, MathTex } from "../components/MathTex";
import { CrcDivisionLadder } from "../components/CrcDivisionLadder";

export const Scene6_ReceiverError: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Map 1052 frames across 10 steps
  const stepProgress = interpolate(frame, [80, 800], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showRejection = frame >= 810;
  const progressRejection = interpolate(frame, [810, 930], [0, 1], { extrapolateRight: "clamp" });

  const corruptedCodeword = "11010110111011111011001100"; // Last bit flipped 1 -> 0
  const divisor = "10001000000100001";

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1700, height: "100%", display: "flex", flexDirection: "column" }}>
        <GrantTitle
          title="Detecting Corruption: The Non-Zero Syndrome"
          subtitle="A single bit flip at the tail violates polynomial invariance, yielding syndrome 0000000000000001"
          style={{ marginBottom: 12 }}
        />

        {/* Division Ladder for Scenario B */}
        <div style={{ flex: 1, position: "relative" }}>
          <CrcDivisionLadder
            dividend={corruptedCodeword}
            divisor={divisor}
            mode="receiver-corrupt"
            stepProgress={stepProgress}
          />
        </div>

        {/* Syndrome Alert & Mathematical Explanation */}
        {showRejection && (
          <div
            style={{
              opacity: progressRejection,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <MathTex
              math="T'(x) \pmod{G(x)} = (T(x) \oplus E(x)) \pmod{G(x)} = E(x) \pmod{G(x)} = 1 \neq 0"
              fontSize={34}
              color={COLORS.salmon}
            />
            <div style={{ fontSize: 24, color: COLORS.salmon, marginTop: 4 }}>
              ⚠ Non-Zero Syndrome S = 0000000000000001 → Single-Bit Corruption Flagged → Packet Rejected
            </div>
          </div>
        )}
      </div>
    </VoidCanvas>
  );
};
