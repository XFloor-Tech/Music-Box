import { FC, useCallback, useState } from 'react';
import { motion, MotionValue, useTransform } from 'framer-motion';
import { TrackProgressBar } from '../components/track-progress';
import { TrackPlayButton } from '../components/track-play-button';
import { Logo } from '@/components/logo';
import { ChevronDown, ChevronFirst, ChevronLast } from 'lucide-react';
import { TrackEllipsis } from '../components/track-ellipsis';
import { Button } from '@/components/ui/button';
import { BAR_HEIGHT, BAR_PROGRESS } from './constants';
import { useAudioPlayer } from '@/core/audio/useAudioPlayer';
import { progressFromRawValue } from '../utils';

type Props = {
  height: MotionValue<number>;
  expand?: (targetHeight: number) => void;
};

const TrackBarContent: FC<Props> = ({ height, expand }) => {
  const { play, pause, resume, states, changeProgress } = useAudioPlayer();

  // progress to commit while dragging progress thumb
  const [commitProgress, setCommitProgress] = useState<number | null>(null);

  const onCollapse = useCallback(() => {
    expand?.(BAR_HEIGHT + BAR_PROGRESS);
  }, [expand]);

  const maxHeight = window.innerHeight;

  const collapseOpacity = useTransform(
    height,
    [maxHeight, maxHeight - BAR_HEIGHT, maxHeight - BAR_HEIGHT * 2],
    [1, 0.2, 0],
  );

  const onProgressChange = useCallback((value: number) => {
    setCommitProgress(value);
  }, []);

  const onProgressCommit = useCallback(
    (value: number) => {
      setCommitProgress(null);
      changeProgress(value);
    },
    [changeProgress],
  );

  return (
    <div className='xs:px-8 flex h-full w-full flex-col px-4 py-6'>
      <motion.div
        style={{ opacity: collapseOpacity }}
        className='flex h-fit w-full items-center justify-end'
      >
        <Button
          variant='ghost'
          size='icon'
          onClick={onCollapse}
          className='flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50 hover:bg-neutral-300!'
        >
          <ChevronDown size={32} className='text-pink' />
        </Button>
      </motion.div>

      <div className='flex h-full flex-col items-center justify-center gap-5'>
        <div className='flex w-full flex-col items-center gap-2'>
          <div className='flex aspect-square h-auto w-full max-w-[380px] items-center justify-center bg-neutral-900'>
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
            <span className='text-xs text-neutral-100'>
              {progressFromRawValue(commitProgress ?? states.progress)}
            </span>
            <TrackProgressBar
              states={states}
              onChange={onProgressCommit}
              onProgressChange={onProgressChange}
              hideTip
              className='size-4'
            />
            <span className='text-xs text-neutral-100'>
              {progressFromRawValue(states.duration)}
            </span>
          </div>
        </div>

        <div className='flex w-full items-center justify-center gap-6 p-3'>
          <ChevronFirst className='text-pink' size={36} />

          <TrackPlayButton
            states={states}
            onPlay={play}
            onPause={pause}
            onResume={resume}
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
