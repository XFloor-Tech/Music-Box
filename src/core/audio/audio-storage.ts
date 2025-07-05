import { atomWithStorage } from "jotai/utils";
import { AudioSettings } from "./audio-player";

const broadcastAudioAtom = atomWithStorage<string | null>(
  "broadcast",
  null,
  undefined,
  { getOnInit: true },
);
const audioSettingsAtom = atomWithStorage<AudioSettings>(
  "audio-settings",
  {
    volume: 0.5,
    loop: false,
    muted: false,
  },
  undefined,
  { getOnInit: true },
);

export { broadcastAudioAtom, audioSettingsAtom };
