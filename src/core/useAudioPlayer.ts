import { useRef } from "react";
import { type AudioBufferStartParams, AudioPlayer } from "./audio-player";

const useAudioPlayer = () => {
  const playerRef = useRef(AudioPlayer.getInstance());

  const start = (path: string, startParams?: AudioBufferStartParams) => {
    playerRef.current.fetchAndPlayAudio(path, startParams);
  };

  const pause = () => {
    playerRef.current.pause();
  };

  const resume = () => {
    playerRef.current.resume();
  };

  const changeVolume = (value: number) => {
    playerRef.current.setVolume(value);
  };

  return { start, pause, resume, changeVolume };
};

export { useAudioPlayer };
