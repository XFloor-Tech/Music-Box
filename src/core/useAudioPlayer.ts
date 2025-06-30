import { RefObject, useCallback, useEffect, useRef } from "react";
import { type AudioBufferStartParams, AudioPlayer } from "./audio-player";
import { fetchAudioFromUrl } from "./fetch-audio";

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
  slider?: RefObject<HTMLInputElement | null>;
};

type UseAudioPlayerParams = {
  slider?: RefObject<HTMLInputElement | null>;
};

const useAudioPlayer = (params?: UseAudioPlayerParams) => {
  const { slider } = params ?? {};

  const playerRef = useRef(AudioPlayer.getInstance());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopPlayProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const initPlayProgress = useCallback(
    async (
      sliderRef: RefObject<HTMLInputElement | null>,
      startParams?: AudioBufferStartParams,
    ) => {
      if (!sliderRef.current) return;

      sliderRef.current.value = startParams?.offset?.toString() ?? "0";
      sliderRef.current.max =
        playerRef.current.getBufferDuration()?.toString() ?? "100";

      const updateProgress = () => {
        const audioDuration = playerRef.current.getBufferDuration();
        const currentTime = playerRef.current.getCurrentBufferProgress();

        if (
          currentTime === null ||
          audioDuration === null ||
          !sliderRef.current ||
          currentTime > audioDuration
        ) {
          stopPlayProgress();
          return;
        }
        sliderRef.current.value = currentTime.toString();
      };

      progressIntervalRef.current = setInterval(updateProgress, 50);
    },
    [],
  );

  const fetchAndStart = useCallback(
    async ({ path, startParams }: StartAudioParams) => {
      const audio = await fetchAudioFromUrl(path);
      await playerRef.current.playArrayBuffer(audio, startParams);
      stopPlayProgress();
      if (slider) await initPlayProgress(slider);
    },
    [initPlayProgress, slider],
  );

  const pause = () => {
    playerRef.current.pause();
  };

  const resume = () => {
    playerRef.current.resume();
  };

  const changeVolume = (value: number) => {
    playerRef.current.setVolume(value);
  };

  const changeProgress = useCallback(
    async (value: number) => {
      const audioDuration = playerRef.current.getBufferDuration();
      const time = Math.max(0, Math.min(value, audioDuration ?? 0));
      stopPlayProgress();
      playerRef.current.setProgress(time);
      if (slider) await initPlayProgress(slider);
    },
    [initPlayProgress, slider],
  );

  /** Clean up all player related refs and close audio context */
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      stopPlayProgress();
      player.closeContextSources();
    };
  }, []);

  return { fetchAndStart, pause, resume, changeVolume, changeProgress };
};

export { useAudioPlayer };
