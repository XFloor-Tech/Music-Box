import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { AudioContext } from 'standardized-audio-context';
import { audioSettingsAtom } from './audio-storage';
import { AudioPlayer } from './player/audio-player';
import { AudioScaffoldParams } from './player/types';

const audioPlayerRef = { current: null } as { current: AudioPlayer | null };

type GetPlayerOptions = {
  unmountReset?: boolean;
};

const useGetPlayerRef = (options?: GetPlayerOptions) => {
  const audioSettings = useAtomValue(audioSettingsAtom);

  // Wait until component is mounted to have access to window.AudioContext on client side
  // then create and get audio player instance
  useEffect(() => {
    if (audioPlayerRef.current) return;
    // window.AudioContext =
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any -- wtf
    //   window.AudioContext || (window as any).webkitAudioContext;

    const context = new AudioContext();
    audioPlayerRef.current = AudioPlayer.getInstance({
      context,
      // settings go from local storage here
      settings: audioSettings,
    });

    // Close context and remove instance on unmount
    return () => {
      if (options?.unmountReset) {
        audioPlayerRef.current?.close();
        audioPlayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);

  return audioPlayerRef;
};

export { useGetPlayerRef, type AudioScaffoldParams };
