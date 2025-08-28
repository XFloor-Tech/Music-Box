import { AudioBufferStartParams, AudioSettings } from './player/types';
import { AudioSliders } from './useAudioSlider';

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
  progress: number;
  duration: number;
};

type AudioSettingsStates = AudioStates & AudioSettings;

export type {
  StartAudioParams,
  UseAudioPlayerParams,
  AudioStates,
  AudioSettingsStates,
};
