import { AudioBuffer } from 'standardized-audio-context';

import { AudioBufferStartParams, AudioEventListener } from './types';

export interface IAudioPlayer {
  audioFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<AudioBuffer>;
  invalidateAudioBufferSource(): void;
  playArrayBuffer(
    arrayBuffer: ArrayBuffer,
    startParams?: AudioBufferStartParams,
  ): Promise<void>;
  close(): void;
  pause(): void;
  resume(): void;
  loop(): void;
  getContextState(): AudioContextState;
  getCurrentTime(): number;
  getBufferDuration(): number | null;
  setProgress(time: number): void;
  setVolume(volume: number): void;
  getVolumeValue(): number;
  getIsLoaded(): boolean;
  getIsLooped(): boolean;
  getCurrentBufferProgress(): number | null;
  addListeners(listeners: AudioEventListener[]): void;
}
