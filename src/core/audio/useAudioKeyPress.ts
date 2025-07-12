import { useEffect, useRef } from 'react';
import { useGetPlayerRef } from './useGetPlayer';
import { throttle } from 'lodash';

/*
 * Handles audio player controls via keyboard events.
 */
const useAudioKeyControl = () => {
  const playerRef = useGetPlayerRef();
  const isSpacePressingRef = useRef(false);

  useEffect(() => {
    const player = playerRef.current;

    const throttledPause = throttle(() => {
      if (player && player.getContextState() === 'running') {
        player.pause();
      } else if (player && player.getContextState() === 'suspended') {
        player.resume();
      }
    }, 250);

    const throttledChangeProgress = throttle((reverse?: boolean) => {
      const audioDuration = player?.getBufferDuration();
      const progress = player?.getCurrentBufferProgress() ?? 0;
      const value = progress + (reverse ? -5 : 5);
      const time = Math.max(0, Math.min(value, audioDuration ?? 0));
      player?.setProgress(time);
    }, 250);

    const throttledSetVolume = throttle((down?: boolean) => {
      const volume = player?.getVolumeValue() ?? 0.5;
      const value = volume + (down ? -0.1 : 0.1);
      player?.setVolume(Math.max(0, Math.min(value, 1)));
    }, 100);

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (!playerRef.current) return;

      if (key === ' ' && !isSpacePressingRef.current) {
        isSpacePressingRef.current = true;
        throttledPause();
      }

      if (key === 'arrowright') {
        throttledChangeProgress();
      }

      if (key === 'arrowleft') {
        throttledChangeProgress(true);
      }

      if (key === 'arrowup') {
        throttledSetVolume();
      }

      if (key === 'arrowdown') {
        throttledSetVolume(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === ' ') {
        isSpacePressingRef.current = false;
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      isSpacePressingRef.current = false;
    };
  }, [playerRef]);
};

export { useAudioKeyControl };
