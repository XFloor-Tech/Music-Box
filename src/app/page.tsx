'use client';

import { useAudioPlayer } from '@core/audio/useAudioPlayer';
import { useCallback, useRef } from 'react';

export default function Home() {
  const progressSliderRef = useRef<HTMLInputElement | null>(null);
  const volumeSliderRef = useRef<HTMLInputElement | null>(null);

  const { play, pause, resume, loop } = useAudioPlayer({
    sliders: { progressSliderRef, volumeSliderRef },
  });

  const onPlayClick = useCallback(() => {
    play({ path: '176.mp3' });
  }, [play]);

  const onPauseClick = useCallback(() => {
    pause();
  }, [pause]);

  const onResumeClick = useCallback(() => {
    resume();
  }, [resume]);

  const onLoopClick = useCallback(() => {
    loop();
  }, [loop]);

  return (
    <div className='align-center bg-rosewater text-mauve flex w-full flex-row gap-4'>
      <button onClick={onPlayClick}>play</button>
      <button onClick={onPauseClick}>pause</button>
      <button onClick={onResumeClick}>resume</button>
      <button onClick={onLoopClick}>loop</button>
      <input
        defaultValue='0'
        type='range'
        ref={progressSliderRef}
        className='w-[256px]'
      />
      <input
        type='range'
        ref={volumeSliderRef}
        min='0'
        max='1'
        defaultValue='0.5'
        className='w-[64px]'
      />
    </div>
  );
}
