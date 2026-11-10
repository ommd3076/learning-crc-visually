import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import timings from "./audioTimings.json";
import { Scene1_Intro } from "./scenes/Scene1_Intro";
import { Scene2_MathTheory } from "./scenes/Scene2_MathTheory";
import { Scene3_FrameSetup } from "./scenes/Scene3_FrameSetup";
import { Scene4_DivisionWalkthrough } from "./scenes/Scene4_DivisionWalkthrough";
import { Scene5_ReceiverValid } from "./scenes/Scene5_ReceiverValid";
import { Scene6_ReceiverError } from "./scenes/Scene6_ReceiverError";

export const CrcMasterComposition: React.FC = () => {
  let currentFrame = 0;
  const scenes = [
    { Component: Scene1_Intro, audio: "audio/scene1_intro.wav", frames: timings.scene1_intro.durationInFrames },
    { Component: Scene2_MathTheory, audio: "audio/scene2_mathTheory.wav", frames: timings.scene2_mathTheory.durationInFrames },
    { Component: Scene3_FrameSetup, audio: "audio/scene3_frameSetup.wav", frames: timings.scene3_frameSetup.durationInFrames },
    { Component: Scene4_DivisionWalkthrough, audio: "audio/scene4_divisionWalkthrough.wav", frames: timings.scene4_divisionWalkthrough.durationInFrames },
    { Component: Scene5_ReceiverValid, audio: "audio/scene5_receiverValid.wav", frames: timings.scene5_receiverValid.durationInFrames },
    { Component: Scene6_ReceiverError, audio: "audio/scene6_receiverError.wav", frames: timings.scene6_receiverError.durationInFrames },
  ];

  return (
    <div style={{ flex: 1, backgroundColor: "#000000", width: 1920, height: 1080 }}>
      {/* Continuous Subtle Acoustic Drone Bed */}
      <Audio src={staticFile("audio/ambient_bed.mp3")} volume={0.08} loop />

      {/* Strictly Clamped Continuous Audio Sequences */}
      {scenes.map((scene, i) => {
        const from = currentFrame;
        currentFrame += scene.frames;

        return (
          <Sequence key={i} from={from} durationInFrames={scene.frames}>
            <Audio src={staticFile(scene.audio)} volume={1.0} />
            <scene.Component />
          </Sequence>
        );
      })}
    </div>
  );
};
