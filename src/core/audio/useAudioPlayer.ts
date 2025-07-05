import { useAtom } from "jotai";
import { RefObject, useCallback, useEffect, useRef } from "react";
import {
  type AudioBufferStartParams,
  AudioPlayer,
  AudioScaffoldParams,
} from "./audio-player";
import { audioSettingsAtom, broadcastAudioAtom } from "./audio-storage";
import { fetchAudioFromUrl } from "./fetch-audio";

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
};

type UseAudioPlayerParams = {
  slider?: RefObject<HTMLInputElement | null>;
};

const useGetPlayerRef = (params?: AudioScaffoldParams) =>
  useRef(AudioPlayer.getInstance(params));

const useAudioPlayer = (params?: UseAudioPlayerParams) => {
  const { slider } = params ?? {};

  const [audioUrl, setAudioUrl] = useAtom(broadcastAudioAtom);
  const [audioSettings, setAudioSettings] = useAtom(audioSettingsAtom);

  const playerRef = useGetPlayerRef({ settings: audioSettings });
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
    setAudioSettings((prev) => ({ ...prev, loop: !prev.loop }));
    playerRef.current.loop();
  };

  const changeVolume = (value: number) => {
    if (value > 1 || value < 0) {
      return;
    }
    setAudioSettings((prev) => ({
      ...prev,
      volume: value,
      muted: value === 0,
    }));
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

  /** Attach listeners for play progress on component mount */
  useEffect(() => {
    playerRef.current.addListeners([
      {
        event: "end",
        on: () => {
          console.log("Audio playback ended.");
          stopPlayProgress();
          if (slider) void initPlayProgress(slider);
        },
      },
    ]);
  }, [initPlayProgress, playerRef, slider]);

  /** Set up slider change event listener for progress change trigger */
  // TODO: make useSlider hook
  useEffect(() => {
    const sliderElement = slider?.current;
    const onSliderChange = (event: Event) => {
      if (event.target) {
        const value = parseFloat((event.target as HTMLInputElement).value);
        console.log("Slider value changed:", value);
        changeProgress(value);
      }
    };

    if (sliderElement) {
      sliderElement.value = "0";
      sliderElement.addEventListener("input", onSliderChange);
    }

    return () => {
      sliderElement?.removeEventListener("input", onSliderChange);
    };
  }, [changeProgress, slider]);

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
