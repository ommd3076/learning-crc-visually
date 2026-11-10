import React from "react";
import { Composition } from "remotion";
import { CrcExplainer } from "./CrcExplainer";
import timings from "./audioTimings.json";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";

export const RemotionRoot: React.FC = () => {
  const totalDurationInFrames =
    timings.scene1.durationInFrames +
    timings.scene2.durationInFrames +
    timings.scene3.durationInFrames +
    timings.scene4.durationInFrames +
    timings.scene5.durationInFrames +
    timings.scene6.durationInFrames;

  return (
    <>
      {/* Full Feature Video Composition */}
      <Composition
        id="CrcExplainer"
        component={CrcExplainer}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Individual Scene Compositions for Preview and Rapid Iteration */}
      <Composition
        id="Scene1"
        component={Scene1}
        durationInFrames={timings.scene1.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene2"
        component={Scene2}
        durationInFrames={timings.scene2.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene3"
        component={Scene3}
        durationInFrames={timings.scene3.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene4"
        component={Scene4}
        durationInFrames={timings.scene4.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene5"
        component={Scene5}
        durationInFrames={timings.scene5.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene6"
        component={Scene6}
        durationInFrames={timings.scene6.durationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
