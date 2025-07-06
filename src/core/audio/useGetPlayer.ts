import { useRef } from "react";
import { AudioScaffoldParams, AudioPlayer } from "./audio-player";

const useGetPlayerRef = (params?: AudioScaffoldParams) =>
  useRef(AudioPlayer.getInstance(params));

export { useGetPlayerRef, type AudioScaffoldParams };
