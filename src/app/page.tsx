"use client";

import { ChangeEvent, useCallback } from "react";
import { useAudioPlayer } from "@/core/useAudioPlayer";

export default function Home() {
  const { start, pause, resume, changeVolume } = useAudioPlayer();

  const onPlayClick = useCallback(() => {
    start("176.mp3");
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
    <div className="flex flex-row gap-4 align-center justify-center w-full">
      <button onClick={onPlayClick}>play</button>
      <button onClick={onPauseClick}>pause</button>
      <button onClick={onResumeClick}>resume</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        className="w-64"
        onChange={onSliderVolumeChange}
      />
    </div>
  );
}
