"use client";

import { ChangeEvent, useCallback, useRef } from "react";
import { useAudioPlayer } from "@/core/useAudioPlayer";

export default function Home() {
  const { start, pause, resume, changeVolume } = useAudioPlayer();

  const progressSliderRef = useRef<HTMLInputElement | null>(null);

  const onPlayClick = useCallback(() => {
    start({ path: "176.mp3", slider: progressSliderRef });
  }, [start]);

  const onPauseClick = useCallback(() => {
    pause();
  }, [pause]);

  const onResumeClick = useCallback(() => {
    resume();
  }, [resume]);

  const onSliderVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      changeVolume(parseFloat(event.target.value));
    },
    [changeVolume],
  );

  return (
    <div className="flex flex-row gap-4 align-center w-full">
      <button onClick={onPlayClick}>play</button>
      <button onClick={onPauseClick}>pause</button>
      <button onClick={onResumeClick}>resume</button>
      <input
        value="0"
        type="range"
        ref={progressSliderRef}
        className="w-[256px]"
      />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        className="w-[64px]"
        onChange={onSliderVolumeChange}
      />
    </div>
  );
}
