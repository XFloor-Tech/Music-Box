import { RefObject, useCallback, useEffect, useRef } from "react";
import { type AudioBufferStartParams, AudioPlayer } from "./audio-player";
import { fetchAudioFromUrl } from "./fetch-audio";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
};

type UseAudioPlayerParams = {
  slider?: RefObject<HTMLInputElement | null>;
};

const broadcastAudioAtom = atomWithStorage<string | null>("broadcast", null);

const useGetPlayerRef = () => useRef(AudioPlayer.getInstance());

const useAudioPlayer = (params?: UseAudioPlayerParams) => {
  const { slider } = params ?? {};

  const playerRef = useGetPlayerRef();
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [audioUrl, setAudioUrl] = useAtom(broadcastAudioAtom);

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
    [playerRef],
  );

  const fetchAndStart = useCallback(
    async ({ path, startParams }: StartAudioParams) => {
      const audio = await fetchAudioFromUrl(path);
      await playerRef.current.playArrayBuffer(audio, startParams);
      stopPlayProgress();
      if (slider) await initPlayProgress(slider);
    },
    [initPlayProgress, playerRef, slider],
  );

  const play = (params?: StartAudioParams) => {
    const path = params?.path ?? audioUrl;
    if (!path) {
      throw new Error("No audio URL provided to play.");
    }
    void fetchAndStart({ path, startParams: params?.startParams });
  };

  const pause = () => {
    playerRef.current.pause();
  };

  const resume = () => {
    playerRef.current.resume();
  };

  const loop = () => {
    playerRef.current.loop();
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
    [initPlayProgress, playerRef, slider],
  );

  /** Clean up all player related refs and close audio context */
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      stopPlayProgress();
      player.closeContextSources();
    };
  }, [playerRef]);

  return {
    play,
    pause,
    resume,
    loop,
    changeVolume,
    changeProgress,
    setAudioUrl,
  };
};

export { useAudioPlayer };
