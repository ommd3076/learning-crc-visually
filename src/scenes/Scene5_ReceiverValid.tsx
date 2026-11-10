import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { GrantTitle, MathTex } from "../components/MathTex";
import { CrcDivisionLadder } from "../components/CrcDivisionLadder";

export const Scene5_ReceiverValid: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // Map 1101 frames across 10 steps
  const stepProgress = interpolate(frame, [80, 850], [0, 9.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showProof = frame >= 860;
  const progressProof = interpolate(frame, [860, 980], [0, 1], { extrapolateRight: "clamp" });

  const receivedCodeword = "11010110111011111011001101";
  const divisor = "10001000000100001";

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1700, height: "100%", display: "flex", flexDirection: "column" }}>
        <GrantTitle
          title="Receiver Verification: The Clean Invariant"
          subtitle="The incoming codeword is an exact multiple of the generator polynomial"
          style={{ marginBottom: 12 }}
        />

        {/* Division Ladder for Scenario A */}
        <div style={{ flex: 1, position: "relative" }}>
          <CrcDivisionLadder
            dividend={receivedCodeword}
            divisor={divisor}
            mode="receiver-clean"
            stepProgress={stepProgress}
          />
        </div>

        {/* Mathematical Proof of Zero Remainder */}
        {showProof && (
          <div
            style={{
              opacity: progressProof,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            <MathTex
              math="T(x) = D(x) \cdot x^{16} \oplus R(x) = Q(x) \cdot G(x) \implies T(x) \pmod{G(x)} \equiv 0"
              fontSize={34}
              color={COLORS.mint}
            />
            <div style={{ fontSize: 24, color: COLORS.mint, marginTop: 4 }}>
              ✓ Remainder = 0000000000000000 → No Error Detected → Data Accepted
            </div>
          </div>
        )}
      </div>
    </VoidCanvas>
  );
};
