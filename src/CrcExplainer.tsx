import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import timings from "./audioTimings.json";
import { Scene1 } from "./scenes/Scene1";
import { Scene2 } from "./scenes/Scene2";
import { Scene3 } from "./scenes/Scene3";
import { Scene4 } from "./scenes/Scene4";
import { Scene5 } from "./scenes/Scene5";
import { Scene6 } from "./scenes/Scene6";

export const CrcExplainer: React.FC = () => {
  let currentFrame = 0;
  const scenes = [
    { Component: Scene1, audio: "audio/scene1.wav", frames: timings.scene1.durationInFrames },
    { Component: Scene2, audio: "audio/scene2.wav", frames: timings.scene2.durationInFrames },
    { Component: Scene3, audio: "audio/scene3.wav", frames: timings.scene3.durationInFrames },
    { Component: Scene4, audio: "audio/scene4.wav", frames: timings.scene4.durationInFrames },
    { Component: Scene5, audio: "audio/scene5.wav", frames: timings.scene5.durationInFrames },
    { Component: Scene6, audio: "audio/scene6.wav", frames: timings.scene6.durationInFrames },
  ];

  return (
    <div style={{ flex: 1, backgroundColor: "#0d1117", width: 1920, height: 1080 }}>
      {/* Continuous Subtle Acoustic Bed Drone (3B1B ambient) */}
      <Audio src={staticFile("audio/ambient_bed.mp3")} volume={0.08} loop />

      {/* Strictly Clamped Zero-Dead-Air Narration & Visual Sequences */}
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
