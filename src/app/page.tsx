"use client";

import { ChangeEvent, useCallback, useRef } from "react";
import { useAudioPlayer } from "@/core/useAudioPlayer";

export default function Home() {
  const progressSliderRef = useRef<HTMLInputElement | null>(null);

  const { play, pause, resume, loop, changeVolume, changeProgress } =
    useAudioPlayer({
      slider: progressSliderRef,
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

  const onSliderVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      changeVolume(parseFloat(event.target.value));
    },
    [changeVolume],
  );

  const onSliderProgressChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      changeProgress(parseFloat(event.target.value));
    },
    [changeProgress],
  );

  return (
    <div className="flex flex-row gap-4 align-center w-full">
      <button onClick={onPlayClick}>play</button>
      <button onClick={onPauseClick}>pause</button>
      <button onClick={onResumeClick}>resume</button>
      <button onClick={onLoopClick}>loop</button>
      <input
        value="0"
        type="range"
        ref={progressSliderRef}
        className="w-[256px]"
        onChange={onSliderProgressChange}
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
