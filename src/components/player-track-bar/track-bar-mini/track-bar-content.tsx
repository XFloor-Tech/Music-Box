import { FC } from 'react';
import { MotionValue } from 'framer-motion';
import { TrackProgressBar } from '../track-progress';
import { AudioSettingsStates } from '@/core/audio/types';
import { TrackPlayButton } from '../track-play-button';
import { Logo } from '@/components/logo';
import { ChevronDown, ChevronFirst, ChevronLast } from 'lucide-react';
import { TrackEllipsis } from '../track-ellipsis';

type Props = {
  height: MotionValue<number>;
};

const TrackBarContent: FC<Props> = () => {
  return (
    <div className='flex h-full w-full flex-col px-4 py-6'>
      <div className='flex h-fit w-full items-center justify-end'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50'>
          <ChevronDown size={32} className='text-pink' />
        </div>
      </div>

      <div className='flex h-full flex-col items-center justify-center gap-5'>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='flex aspect-square h-auto w-full items-center justify-center bg-neutral-900'>
            <Logo className='h-20 w-20' />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <span className='text-center text-lg font-semibold text-neutral-50'>
              Track name (feat. Other One)
            </span>
            <span className='text-center text-neutral-200'>Artist Name</span>
          </div>
        </div>

        <div className='flex w-full flex-col items-end gap-2'>
          <TrackEllipsis className='gap-1' classNameHeart='inline-flex' />

          <div className='flex w-full items-center gap-3'>
            <span className='text-xs text-neutral-100'>1:12</span>
            <TrackProgressBar states={{} as AudioSettingsStates} />
            <span className='text-xs text-neutral-100'>8:52</span>
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-6 p-3'>
          <ChevronFirst className='text-pink' size={36} />

          <TrackPlayButton
            states={{} as AudioSettingsStates}
            className='h-16 w-16'
            size={42}
          />
          <ChevronLast className='text-pink' size={36} />
        </div>
      </div>
    </div>
  );
};

export { TrackBarContent };
