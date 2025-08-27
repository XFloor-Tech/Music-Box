import { atomWithStorage } from 'jotai/utils';
import { AudioSettings } from './player/types';
import { atom } from 'jotai';
import { AudioStates } from './types';

const broadcastAudioAtom = atomWithStorage<string | null>(
  'broadcast',
  null,
  undefined,
  { getOnInit: true },
);

const audioSettingsAtom = atomWithStorage<AudioSettings>(
  'audio-settings',
  {
    volume: 0.5,
    loop: false,
    muted: false,
  },
  undefined,
  { getOnInit: true },
);

const initialAudioStates: AudioStates = {
  isPlaying: false,
  isPaused: false,
  isLoaded: false,
  isEnded: false,
  isResumed: false,
  progress: 0,
  duration: 0,
};

const audioStatesAtom = atom(initialAudioStates);

export { broadcastAudioAtom, audioSettingsAtom, audioStatesAtom };
