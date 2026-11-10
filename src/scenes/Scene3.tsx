import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../styles/theme";
import { SceneContainer, HeaderBanner, Card, Badge } from "../components/layout/Primitives";
import { BitVector } from "../components/math/BitVector";
import { PolynomialCard } from "../components/math/PolynomialCard";

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();

  const progressHeader = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const progressDataword = interpolate(frame, [20, 100], [0, 1], { extrapolateRight: "clamp" });
  const progressGenerator = interpolate(frame, [120, 320], [0, 1], { extrapolateRight: "clamp" });
  const progressAugment = interpolate(frame, [350, 550], [0, 1], { extrapolateRight: "clamp" });

  const dataword = "1101011011";
  const generatorBits = "10001000000100001";
  const augmentedBits = "11010110110000000000000000";

  return (
    <SceneContainer>
      <HeaderBanner
        sceneNumber={3}
        category="ENCODING SETUP"
        title="Structuring Dividend & Degree-16 Generator"
        subtitle="Aligning the 10-bit laboratory message with the CRC-CCITT polynomial specification"
        progress={progressHeader}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
        {/* Top Split: Dataword and Polynomial Specification */}
        <div style={{ display: "flex", gap: 24 }}>
          {/* Dataword Card */}
          <Card
            glow="cyan"
            style={{
              flex: 0.9,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              opacity: progressDataword,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 800, fontFamily: THEME.fonts.sans }}>
                1. Lab Dataword Payload D
              </span>
              <Badge label="10 BITS" variant="cyan" />
            </div>

            <p style={{ margin: 0, fontSize: 14, color: THEME.colors.textSecondary }}>
              Exact verified bit vector from the laboratory notebook:
            </p>

            <BitVector
              bits={dataword}
              showIndices
              cellSize={42}
              fontSize={18}
              staggerProgress={progressDataword}
            />

            <div
              style={{
                fontFamily: THEME.fonts.mono,
                fontSize: 13,
                color: THEME.colors.cyan,
                backgroundColor: "rgba(56, 189, 248, 0.08)",
                padding: "8px 12px",
                borderRadius: 6,
                border: `1px solid rgba(56, 189, 248, 0.2)`,
              }}
            >
              Payload D(x) = x^9 + x^8 + x^6 + x^4 + x^3 + x^1 + 1
            </div>
          </Card>

          {/* Generator Polynomial Card */}
          <div style={{ flex: 1.1, opacity: progressGenerator }}>
            <PolynomialCard
              title="2. Standard Generator Polynomial G(x)"
              polyName="CRC-16 / CCITT"
              algebraicFormula="G(x) = x¹⁶ + x¹² + x⁵ + 1"
              bitString={generatorBits}
              degree={16}
              highlightExponents={[16, 12, 5, 0]}
            />
          </div>
        </div>

        {/* Bottom Card: The Augmented Dividend */}
        <Card
          glow="gold"
          borderColor="rgba(250, 204, 21, 0.4)"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            opacity: progressAugment,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: THEME.fonts.sans }}>
                3. The Augmented Dividend: D(x) · x¹⁶
              </span>
              <Badge label="26 BITS TOTAL" variant="gold" />
            </div>
            <div style={{ fontFamily: THEME.fonts.mono, fontSize: 13, color: THEME.colors.gold }}>
              Append r = 16 Zeros to Shift Payload Left by 16 Positions
            </div>
          </div>

          <p style={{ margin: 0, fontSize: 15, color: THEME.colors.textSecondary, lineHeight: 1.5 }}>
            Because the polynomial degree is $r = 16$, we append exactly sixteen binary zeros to the right of our dataword. These sixteen placeholder slots represent the exact mathematical territory that our CRC remainder will inhabit.
          </p>

          <BitVector
            bits={augmentedBits}
            splitIndex={10}
            splitLabelLeft="Original Dataword D"
            splitLabelRight="Appended Placeholder Zeros (Degree r=16)"
            cellSize={34}
            fontSize={16}
            showIndices
            staggerProgress={progressAugment}
            style={{ width: "100%" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              padding: "12px 20px",
              borderRadius: 8,
              border: `1px solid ${THEME.colors.borderSubtle}`,
            }}
          >
            <div style={{ fontFamily: THEME.fonts.mono, fontSize: 14, color: THEME.colors.textSecondary }}>
              Equation: <span style={{ color: THEME.colors.gold }}>Dividend = (D &lt;&lt; 16) | 0000000000000000</span>
            </div>
            <Badge label="READY FOR LONG DIVISION" variant="emerald" />
          </div>
        </Card>
      </div>
    </SceneContainer>
  );
};
