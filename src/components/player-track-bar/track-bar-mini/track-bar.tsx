import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  PanInfo,
  useMotionValue,
  animate,
  AnimationPlaybackControlsWithThen,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { clamp } from 'lodash';
import { TrackBarControls } from './track-bar-controls';
import { BAR_HEIGHT, BAR_SNAP } from './constants';
import { TrackBarContent } from './track-bar-content';

const TrackBarMini: FC = () => {
  const [expanded, setExpanded] = useState(false);

  const currentAnimationRef = useRef<AnimationPlaybackControlsWithThen>(null);

  const height = useMotionValue(BAR_HEIGHT);
  const minHeight = BAR_HEIGHT;
  const maxHeight = window.innerHeight;

  useMotionValueEvent(height, 'change', (latest) => {
    // maybe reduce set state on every change and think of somethink else
    setExpanded(latest > maxHeight * BAR_SNAP);
  });

  const expand = useCallback(
    (targetHeight: number) => {
      currentAnimationRef.current = animate(height, targetHeight, {
        type: 'spring',
        damping: 20,
        bounce: 0,
      });
    },
    [height],
  );

  const onPan = useCallback(
    (event: PointerEvent, info: PanInfo) => {
      const newHeight = height.get() - info.delta.y;
      height.set(clamp(newHeight, minHeight, maxHeight));
    },
    [height, maxHeight, minHeight],
  );

  const onPanStart = useCallback(() => {
    currentAnimationRef?.current?.stop();
  }, []);

  const onPanEnd = useCallback(
    (event: PointerEvent, info: PanInfo) => {
      const currentHeight = height.get();

      if (info.velocity.y > 300 || currentHeight < maxHeight * BAR_SNAP) {
        expand(minHeight);
        return;
      }

      if (currentHeight > maxHeight * BAR_SNAP) {
        expand(maxHeight);
      }
    },
    [expand, height, maxHeight, minHeight],
  );

  return (
    <motion.div
      style={{ height }}
      transition={{ type: 'spring', damping: 20, bounce: 0 }}
      className='fixed bottom-0 left-0 z-75 w-full touch-none overflow-hidden bg-neutral-800'
      onPan={onPan}
      onPanStart={onPanStart}
      onPanEnd={onPanEnd}
      onClick={() => {
        if (height.get() === minHeight) {
          expand(maxHeight);
        }
      }}
      layout
    >
      <AnimatePresence mode='wait'>
        {!expanded && <TrackBarControls height={height} />}
        {expanded && (
          <motion.div
            key='expanded'
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='h-full w-full'
          >
            <TrackBarContent height={height} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export { TrackBarMini };
