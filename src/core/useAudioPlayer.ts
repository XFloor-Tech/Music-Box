import { RefObject, useCallback, useEffect, useRef } from "react";
import { type AudioBufferStartParams, AudioPlayer } from "./audio-player";
import { fetchAudioFromUrl } from "./fetch-audio";

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
  slider?: RefObject<HTMLInputElement | null>;
};

const useAudioPlayer = () => {
  const playerRef = useRef(AudioPlayer.getInstance());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initPlayProgress = useCallback(
    async (
      sliderRef: RefObject<HTMLInputElement | null>,
      startParams?: AudioBufferStartParams,
    ) => {
      if (!sliderRef.current) return;

      sliderRef.current.value = startParams?.offset?.toString() ?? "0";
      sliderRef.current.max = playerRef.current.getBufferDuration().toString();

      const updateProgress = () => {
        const currentTime = playerRef.current.getCurrentBufferProgress();
        if (
          !currentTime ||
          !sliderRef.current ||
          currentTime > playerRef.current.getBufferDuration()
        ) {
          if (progressIntervalRef.current)
            clearInterval(progressIntervalRef.current);
          return;
        }
        sliderRef.current.value = currentTime.toString();
      };

      progressIntervalRef.current = setInterval(updateProgress, 50);
    },
    [],
  );

  const start = useCallback(
    async ({ path, startParams, slider }: StartAudioParams) => {
      const audio = await fetchAudioFromUrl(path);
      await playerRef.current.playArrayBuffer(audio, startParams);
      if (slider) await initPlayProgress(slider);
    },
    [initPlayProgress],
  );

  const pause = useCallback(() => {
    playerRef.current.pause();
  }, []);

  const resume = useCallback(() => {
    playerRef.current.resume();
  }, []);

  const changeVolume = useCallback((value: number) => {
    playerRef.current.setVolume(value);
  }, []);

  /** Clean up all player related refs and close audio context */
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      player.closeContextSources();
    };
  }, []);

  return { start, pause, resume, changeVolume };
};

export { useAudioPlayer };
