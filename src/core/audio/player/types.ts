import { AudioContext } from 'standardized-audio-context';

type AudioBufferStartParams = {
  when?: number;
  offset?: number;
  duration?: number;
  loop?: boolean;
  type?: 'default' | 'loop' | 'progress';
};

type AudioEventType = 'start' | 'end' | 'pause' | 'resume' | 'tick';
type AudioEventListener = { event: AudioEventType; on: () => void };

type AudioSettings = {
  volume: number;
  loop: boolean;
  muted: boolean;
};

type AudioScaffoldParams = {
  listeners?: AudioEventListener[];
  settings?: AudioSettings;
  context?: AudioContext;
};

export type {
  AudioBufferStartParams,
  AudioEventListener,
  AudioEventType,
  AudioSettings,
  AudioScaffoldParams,
};
