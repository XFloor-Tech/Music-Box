import { useAudioPlayer } from '@/core/audio/useAudioPlayer';
import { FC } from 'react';
import { Button } from '../ui/button';
import {
  ChevronFirst,
  ChevronLast,
  Ellipsis,
  Heart,
  Repeat,
  Shuffle,
  Volume1,
} from 'lucide-react';
import { Slider } from '../ui/slider';
import { progressFromRawValue } from './utils';
import { TrackProgressBar } from './track-progress';
import { TrackPlayButton } from './track-play-button';
import { TrackVolumeBar } from './track-volume';

const PlayerTrackBar: FC = () => {
  const { play, pause, resume, loop, states, changeProgress, changeVolume } =
    useAudioPlayer();

  return (
    <div className='sticky flex h-[58px] w-full flex-row justify-start gap-[40px] overflow-hidden rounded-[16px] border border-neutral-600 bg-neutral-800 px-[24px] py-[10px] align-middle'>
      <div className='flex items-center justify-between gap-[12px]'>
        <Button variant='ghost' size='icon-sm'>
          <ChevronFirst size={24} className='text-pink' />
        </Button>

        <TrackPlayButton
          states={states}
          onPlay={play}
          onPause={pause}
          onResume={resume}
        />

        <Button variant='ghost' size='icon-sm'>
          <ChevronLast size={24} className='text-pink' />
        </Button>
      </div>

      <div className='flex items-center gap-[16px]'>
        <Button variant='ghost' size='icon-sm' onClick={loop}>
          <Repeat
            size={16}
            className={states.loop ? 'text-pink' : 'text-neutral-50'}
            suppressHydrationWarning
          />
        </Button>
        <Button variant='ghost' size='icon-sm'>
          <Shuffle size={16} className='text-pink' />
        </Button>
      </div>

      <div className='flex flex-1 flex-col items-start gap-[6px]'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex flex-col'>
            <p className='max-w-128 overflow-hidden text-xs font-semibold text-nowrap text-ellipsis text-neutral-50'>
              Track name (feat. Other One)
            </p>
            <span className='text-xxs font-medium text-neutral-400'>
              Artist Name
            </span>
          </div>

          <span className='text-xs text-nowrap whitespace-nowrap text-neutral-100'>
            {progressFromRawValue(states.progress)}
          </span>
        </div>

        <TrackProgressBar states={states} onChange={changeProgress} />
      </div>

      <div className='flex items-center gap-[8px]'>
        <TrackVolumeBar states={states} onChange={changeVolume} />

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
