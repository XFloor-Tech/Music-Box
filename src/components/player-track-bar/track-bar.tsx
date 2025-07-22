import { useAudioPlayer } from '@/core/audio/useAudioPlayer';
import { FC, useCallback, useRef } from 'react';
import { Button } from '../ui/button';
import {
  ChevronFirst,
  ChevronLast,
  Ellipsis,
  Heart,
  Play,
  Repeat,
  Shuffle,
  Volume1,
} from 'lucide-react';
import { Slider } from '../ui/slider';

const PlayerTrackBar: FC = () => {
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
    <div className='sticky flex h-[58px] w-full flex-row justify-start gap-[40px] rounded-[16px] border border-neutral-600 bg-neutral-800 px-[24px] py-[10px] align-middle'>
      <div className='flex items-center justify-between gap-[12px]'>
        <Button variant='ghost' size='icon-sm'>
          <ChevronFirst size={24} className='text-pink' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full bg-neutral-50'
        >
          <Play size={24} className='text-pink' />
        </Button>
        <Button variant='ghost' size='icon-sm'>
          <ChevronLast size={24} className='text-pink' />
        </Button>
      </div>

      <div className='flex items-center gap-[16px]'>
        <Button variant='ghost' size='icon-sm'>
          <Repeat size={16} className='text-pink' />
        </Button>
        <Button variant='ghost' size='icon-sm'>
          <Shuffle size={16} className='text-pink' />
        </Button>
      </div>

      <div className='flex items-center gap-[8px]'>
        <div className='flex items-center gap-[12px]'>
          <Button variant='ghost' size='icon-sm'>
            <Volume1 size={16} className='text-pink' />
          </Button>

          <Slider className='h-[4px] w-[120px]' />
        </div>

        <Button variant='ghost' size='icon'>
          <Heart size={16} className='text-neutral-50' />
        </Button>
        <Button variant='ghost' size='icon'>
          <Ellipsis size={16} className='text-neutral-50' />
        </Button>
      </div>
    </div>
  );
};

export { PlayerTrackBar };
