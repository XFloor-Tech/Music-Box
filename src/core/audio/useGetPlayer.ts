import { useRef } from "react";
import { AudioPlayer, AudioScaffoldParams } from "./audio-player";

const useGetPlayerRef = (params?: AudioScaffoldParams) => {
  // useEffect(() => {
  //   if (audioPlayerRef.current) return;
  //   window.AudioContext =
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any -- wtf
  //     window.AudioContext || (window as any).webkitAudioContext;
  //   // setContext(new AudioContext());
  //
  //   const context = new AudioContext();
  //   audioPlayerRef.current = AudioPlayer.getInstance({
  //     context,
  //     settings: audioSettings,
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount only
  // }, []);

  return useRef(AudioPlayer.getInstance(params));
};

export { useGetPlayerRef, type AudioScaffoldParams };
