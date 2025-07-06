"use client";

import { useCallback, useRef } from "react";
import { useAudioPlayer } from "@/core/audio/useAudioPlayer";

export default function Home() {
  const progressSliderRef = useRef<HTMLInputElement | null>(null);
  const volumeSliderRef = useRef<HTMLInputElement | null>(null);

  const { play, pause, resume, loop } = useAudioPlayer({
    sliders: { progressSliderRef, volumeSliderRef },
  });

  const onPlayClick = useCallback(() => {
    play({ path: "176.mp3" });
  }, [play]);

  const onPauseClick = useCallback(() => {
    pause();
  }, [pause]);

  const onResumeClick = useCallback(() => {
    resume();
  }, [resume]);

  const onLoopClick = useCallback(() => {
    loop();
  }, [loop]);

  return (
    <div className="flex flex-row gap-4 align-center w-full">
      <button onClick={onPlayClick}>play</button>
      <button onClick={onPauseClick}>pause</button>
      <button onClick={onResumeClick}>resume</button>
      <button onClick={onLoopClick}>loop</button>
      <input type="range" ref={progressSliderRef} className="w-[256px]" />
      <input
        type="range"
        ref={volumeSliderRef}
        min="0"
        max="1"
        className="w-[64px]"
      />
    </div>
  );
}
