import { FC, useMemo } from 'react';

import { motion, MotionValue, useTransform } from 'framer-motion';
import { BAR_HEIGHT, BAR_SNAP } from './constants';
import { TrackPlayButton } from '../components/track-play-button';
import { TrackEllipsis } from '../components/track-ellipsis';
import { useAudioPlayer } from '@/core/audio/useAudioPlayer';

type Props = {
  height: MotionValue<number>;
};

const TrackBarControls: FC<Props> = ({ height }) => {
  const { play, pause, states, resume } = useAudioPlayer();

  const maxHeight = window.innerHeight;

  const playInputRange = useMemo<number[]>(
    () => [
      BAR_HEIGHT,
      BAR_HEIGHT + maxHeight * 0.2,
      BAR_HEIGHT + maxHeight * BAR_SNAP,
    ],
    [maxHeight],
  );

  const playX = useTransform(height, playInputRange, [
    0,
    window.innerWidth / 2 + 12 - 36 * 2,
    window.innerWidth / 2 - 36 + 12,
  ]);
  const playY = useTransform(height, playInputRange, [0, -50, -75]);
  const playOpacity = useTransform(height, playInputRange, [1, 0.5, 0]);
  const playScale = useTransform(height, playInputRange, [1, 1.4, 1.6]);

  const nameOpacity = useTransform(
    height,
    [BAR_HEIGHT, BAR_HEIGHT + maxHeight * 0.05, BAR_HEIGHT + maxHeight * 0.1],
    [1, 0.2, 0],
  );

  return (
    <div className='flex h-full w-full items-center justify-between px-3 py-2.5'>
      <div className='flex items-center gap-3'>
        <motion.div
          style={{ x: playX, opacity: playOpacity, scale: playScale }}
        >
          <TrackPlayButton
            states={states}
            onPlay={play}
            onPause={pause}
            onResume={resume}
          />
        </motion.div>

        <motion.div style={{ opacity: nameOpacity }}>
          <div className='flex w-fit flex-col items-start justify-center select-none'>
            <span className='text-xs font-semibold text-neutral-50'>
              Track name (feat. Other One)
            </span>
            <span className='text-xxs font-medium text-neutral-400'>
              Artist Name
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div style={{ opacity: playOpacity, y: playY }}>
        <TrackEllipsis className='gap-3' classNameHeart='inline-flex' />
      </motion.div>
    </div>
  );
};

export { TrackBarControls };
