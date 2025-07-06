import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect } from "react";
import { type AudioBufferStartParams } from "./audio-player";
import { audioSettingsAtom, broadcastAudioAtom } from "./audio-storage";
import { fetchAudioFromUrl } from "./fetch-audio";
import { AudioSliders, useAudioSlider } from "./useAudioSlider";
import { useGetPlayerRef } from "./useGetPlayer";

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
};

type UseAudioPlayerParams = {
  sliders: AudioSliders;
};

const useAudioPlayer = (params: UseAudioPlayerParams) => {
  const [audioUrl, setAudioUrl] = useAtom(broadcastAudioAtom);
  const setAudioSettings = useSetAtom(audioSettingsAtom);

  const playerRef = useGetPlayerRef();

  const play = (params?: StartAudioParams) => {
    const path = params?.path ?? audioUrl;
    if (!path) {
      throw new Error("No audio URL provided to play.");
    }
    void fetchAndStart({ path, startParams: params?.startParams });
  };

  const pause = () => {
    playerRef.current?.pause();
  };

  const resume = () => {
    playerRef.current?.resume();
  };

  const loop = () => {
    setAudioSettings((prev) => ({ ...prev, loop: !prev.loop }));
    playerRef.current?.loop();
  };

  const changeVolume = useCallback(
    (value: number) => {
      if (value > 1 || value < 0) {
        return;
      }
      setAudioSettings((prev) => ({
        ...prev,
        volume: value,
        muted: value === 0,
      }));
      playerRef.current?.setVolume(value);
    },
    [playerRef, setAudioSettings],
  );

  const changeProgress = useCallback(
    async (value: number) => {
      const audioDuration = playerRef.current?.getBufferDuration();
      const time = Math.max(0, Math.min(value, audioDuration ?? 0));
      playerRef.current?.setProgress(time);
    },
    [playerRef],
  );

  // Sliders logic
  const sliders = useAudioSlider({
    sliders: params.sliders,
    progressChange: changeProgress,
    volumeChange: changeVolume,
  });

  const fetchAndStart = useCallback(
    async ({ path, startParams }: StartAudioParams) => {
      const audio = await fetchAudioFromUrl(path);
      await playerRef.current?.playArrayBuffer(audio, startParams);
      await sliders.refresh();
    },
    [playerRef, sliders],
  );

  // Attach listeners
  useEffect(() => {
    playerRef.current?.addListeners([
      {
        event: "start",
        on: () => {
          void sliders.refresh();
        },
      },
      {
        event: "end",
        on: () => {
          void sliders.clear();
        },
      },
    ]);
  }, [playerRef, sliders]);

  // Close audio context
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      player?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- need this on mount only
  }, []);

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
