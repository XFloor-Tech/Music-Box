import { useAudioPlayer } from '@/core/audio/useAudioPlayer';
import { ChevronFirst, ChevronLast, Ellipsis, Heart } from 'lucide-react';
import { FC } from 'react';
import { Button } from '../ui/button';
import { TrackPlayButton } from './track-play-button';
import { TrackProgressBar } from './track-progress';
import { TrackVolumeBar } from './track-volume';
import { progressFromRawValue } from './utils';
import { TrackRepeatShuffle } from './track-repeat-shuffle';
import { TrackEllipsis } from './track-ellipsis';

const TrackBar: FC = () => {
  const { play, pause, resume, loop, states, changeProgress, changeVolume } =
    useAudioPlayer();

  return (
    <div className='sticky top-20 z-50 w-full self-start overflow-hidden'>
      <div className='flex h-14.5 justify-start gap-4 rounded-[16px] border border-neutral-600 bg-neutral-800 px-6 py-2.5 md:gap-6 lg:gap-10'>
        <div className='flex items-center justify-between gap-1 md:gap-2 lg:gap-3'>
          <Button
            className='group hidden md:block'
            variant='ghost'
            size='icon-sm'
          >
            <ChevronFirst
              size={24}
              className='text-primary group-hover:text-primary/90'
            />
          </Button>

          <TrackPlayButton
            states={states}
            onPlay={play}
            onPause={pause}
            onResume={resume}
          />

          <Button
            className='group hidden md:block'
            variant='ghost'
            size='icon-sm'
          >
            <ChevronLast
              size={24}
              className='text-primary group-hover:text-primary/90'
            />
          </Button>
        </div>

        <TrackRepeatShuffle states={states} onLoop={loop} />

        <div className='flex flex-1 flex-col items-start gap-[6px]'>
          <div className='flex w-full items-center justify-between'>
            <div className='flex max-w-4/5 flex-col overflow-hidden'>
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

        <div className='flex items-center md:gap-1 lg:gap-2'>
          <TrackVolumeBar states={states} onChange={changeVolume} />
          <TrackEllipsis />
        </div>
      </div>
    </div>
  );
};

export { TrackBar };
