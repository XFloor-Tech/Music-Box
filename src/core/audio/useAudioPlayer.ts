import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { audioSettingsAtom, broadcastAudioAtom } from './audio-storage';
import { fetchAudioFromUrl } from './fetch-audio';
import { AudioSliders, useAudioSlider } from './useAudioSlider';
import { useGetPlayerRef } from './useGetPlayer';
import { AudioBufferStartParams } from './player/types';
import { useAudioKeyControl } from './useAudioKeyControl';

type StartAudioParams = {
  path: string;
  startParams?: AudioBufferStartParams;
};

type UseAudioPlayerParams = {
  sliders: AudioSliders; // player sliders refs
};

type AudioStates = {
  isPlaying: boolean;
  isPaused: boolean;
  isLoaded: boolean;
  isEnded: boolean;
  isResumed: boolean;
};

const initialAudioStates: AudioStates = {
  isPlaying: false,
  isPaused: false,
  isLoaded: false,
  isEnded: false,
  isResumed: false,
};

const useAudioPlayer = (params: UseAudioPlayerParams) => {
  const [audioUrl, setAudioUrl] = useAtom(broadcastAudioAtom);
  const [audioSettings, setAudioSettings] = useAtom(audioSettingsAtom);

  const [audioStates, setAudioStates] = useState(initialAudioStates);

  const playerRef = useGetPlayerRef();

  const updateAudioStates = useCallback((update: Partial<AudioStates>) => {
    setAudioStates((prev) => ({ ...prev, ...update }));
  }, []);

  const play = (params?: StartAudioParams) => {
    const path = params?.path ?? audioUrl;
    if (!path) {
      throw new Error('No audio URL provided to play.');
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

  // Key press listener for audio controls
  useAudioKeyControl();

  // Sliders logic
  const sliders = useAudioSlider({
    sliders: params.sliders,
    progressChange: changeProgress,
    volumeChange: changeVolume,
  });

  const fetchAndStart = useCallback(
    async ({ path, startParams }: StartAudioParams) => {
      const audio = await fetchAudioFromUrl(path);
      updateAudioStates({ isLoaded: true });
      await playerRef.current?.playArrayBuffer(audio, startParams);
      await sliders.refresh();
    },
    [playerRef, sliders, updateAudioStates],
  );

  // Attach listeners
  useEffect(() => {
    playerRef.current?.addListeners([
      {
        event: 'start',
        on: () => {
          void sliders.refresh();
          updateAudioStates({
            isPlaying: true,
            isPaused: false,
            isEnded: false,
            isResumed: false,
          });
        },
      },
      {
        event: 'end',
        on: () => {
          void sliders.clear();
          updateAudioStates({
            isPlaying: false,
            isPaused: false,
            isEnded: true,
            isResumed: false,
          });
        },
      },
      {
        event: 'pause',
        on: () => {
          void sliders.clear();
          updateAudioStates({
            isPlaying: false,
            isPaused: true,
            isEnded: false,
            isResumed: false,
          });
        },
      },
      {
        event: 'resume',
        on: () => {
          void sliders.refresh();
          updateAudioStates({
            isPlaying: true,
            isPaused: false,
            isEnded: false,
            isResumed: true,
          });
        },
      },
    ]);
  }, [playerRef, sliders, updateAudioStates]);

  const states = useMemo(
    () => ({ ...audioStates, ...audioSettings }),
    [audioSettings, audioStates],
  );

  return {
    play,
    pause,
    resume,
    loop,
    changeVolume,
    changeProgress,
    setAudioUrl,
    states,
  };
};

export { useAudioPlayer };
