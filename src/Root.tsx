import React from "react";
import { Composition } from "remotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CrcExplainer"
        component={() => <div style={{ flex: 1, backgroundColor: "#0d1117" }} />}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
