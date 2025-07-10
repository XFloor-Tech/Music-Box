import { AudioContext } from "standardized-audio-context";
import { useEffect, useRef } from "react";
import { AudioPlayer } from "./player/audio-player";
import { useAtomValue } from "jotai";
import { audioSettingsAtom } from "./audio-storage";
import { AudioScaffoldParams } from "./player/types";

const useGetPlayerRef = () => {
  const audioPlayerRef = useRef<AudioPlayer | null>(null);

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
      settings: audioSettings,
    });

    // Close context and remove instance on unmount
    return () => {
      audioPlayerRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount
  }, []);

  return audioPlayerRef;
};

export { useGetPlayerRef, type AudioScaffoldParams };
