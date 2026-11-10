import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../styles/colors";
import { VoidCanvas } from "../components/VoidCanvas";
import { MathTex, GrantTitle } from "../components/MathTex";
import { FloatingBitString } from "../components/MathRegisters";

export const Scene3_FrameSetup: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressPayload = interpolate(frame, [30, 150], [0, 1], { extrapolateRight: "clamp" });
  const progressGenerator = interpolate(frame, [180, 400], [0, 1], { extrapolateRight: "clamp" });
  const progressAugment = interpolate(frame, [450, 750], [0, 1], { extrapolateRight: "clamp" });

  const dataword = "1101011011";
  const generatorBits = "10001000000100001";
  const augmentedBits = "11010110110000000000000000";

  return (
    <VoidCanvas>
      <div style={{ opacity: progressHeader, width: "100%", maxWidth: 1400 }}>
        <GrantTitle
          title="Structuring Dividend & Degree-16 Generator"
          subtitle="Aligning the 10-bit laboratory message with the CRC-CCITT polynomial specification"
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 36,
            gap: 36,
          }}
        >
          {/* Payload Dataword */}
          <div style={{ opacity: progressPayload, textAlign: "center" }}>
            <div style={{ fontSize: 24, color: COLORS.textMuted, marginBottom: 8 }}>
              1. Laboratory Data Payload D (10 bits):
            </div>
            <FloatingBitString bits={dataword} cellSize={44} fontSize={30} />
            <MathTex
              math="D(x) = x^9 + x^8 + x^6 + x^4 + x^3 + x + 1"
              fontSize={32}
              color={COLORS.textWhite}
            />
          </div>

          {/* Generator Polynomial */}
          <div style={{ opacity: progressGenerator, textAlign: "center" }}>
            <div style={{ fontSize: 24, color: COLORS.textMuted, marginBottom: 8 }}>
              2. Standard Generator Polynomial G(x) (Degree r = 16, 17 bits):
            </div>
            <MathTex
              math="G(x) = x^{16} + x^{12} + x^5 + 1 \longleftrightarrow \texttt{10001000000100001}_2"
              fontSize={38}
              color={COLORS.blue}
            />
          </div>

          {/* Augmented Dividend */}
          <div style={{ opacity: progressAugment, textAlign: "center", marginTop: 10 }}>
            <div style={{ fontSize: 24, color: COLORS.gold, marginBottom: 8 }}>
              3. Augmented Dividend: Append r = 16 Zeros to D (26 bits total):
            </div>
            <FloatingBitString
              bits={augmentedBits}
              splitIndex={10}
              sublabel="10 Data Bits || 16 Appended Zeros"
              cellSize={38}
              fontSize={26}
            />
            <div style={{ fontSize: 22, color: COLORS.textMuted, marginTop: 8 }}>
              These 16 zero placeholder slots create the algebraic space where our remainder will be forged.
            </div>
          </div>
        </div>
      </div>
    </VoidCanvas>
  );
};
