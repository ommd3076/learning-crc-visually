import React from "react";
import { Composition } from "remotion";
import { CrcMasterComposition } from "./CrcMasterComposition";
import timings from "./audioTimings.json";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_MathTheory } from "./scenes/Scene2_MathTheory";
import { Scene3_FrameSetup } from "./scenes/Scene3_FrameSetup";
import { Scene4_DivisionWalkthrough } from "./scenes/Scene4_DivisionWalkthrough";
import { Scene5_ReceiverValid } from "./scenes/Scene5_ReceiverValid";
import { Scene6_ReceiverError } from "./scenes/Scene6_ReceiverError";

export const RemotionRoot: React.FC = () => {
  const totalFrames =
    timings.scene1_intro.durationInFrames +
    timings.scene2_mathTheory.durationInFrames +
    timings.scene3_frameSetup.durationInFrames +
    timings.scene4_divisionWalkthrough.durationInFrames +
    timings.scene5_receiverValid.durationInFrames +
    timings.scene6_receiverError.durationInFrames;

  return (
    <>
      {/* Canonical 3Blue1Brown Master Composition */}
      <Composition
        id="Crc3B1BExplainer"
        component={CrcMasterComposition}
        durationInFrames={totalFrames}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Alias composition for backwards compatibility */}
      <Composition
        id="CrcExplainer"
        component={CrcMasterComposition}
        durationInFrames={totalFrames}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Scene Compositions for Preview and Rapid Iteration */}
      <Composition
        id="Scene1-Intro"
        component={Scene1_Intro}
        durationInFrames={timings.scene1_intro.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2-MathTheory"
        component={Scene2_MathTheory}
        durationInFrames={timings.scene2_mathTheory.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3-FrameSetup"
        component={Scene3_FrameSetup}
        durationInFrames={timings.scene3_frameSetup.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4-DivisionWalkthrough"
        component={Scene4_DivisionWalkthrough}
        durationInFrames={timings.scene4_divisionWalkthrough.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene5-ReceiverValid"
        component={Scene5_ReceiverValid}
        durationInFrames={timings.scene5_receiverValid.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene6-ReceiverError"
        component={Scene6_ReceiverError}
        durationInFrames={timings.scene6_receiverError.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
