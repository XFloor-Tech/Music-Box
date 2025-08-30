import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  motion,
  PanInfo,
  useMotionValue,
  animate,
  AnimationPlaybackControlsWithThen,
} from 'framer-motion';
import { clamp } from 'lodash';

const HEIGHT = 56;

const TrackBarMobile: FC = () => {
  const [expanded, setExpanded] = useState(false);

  const currentAnimationRef = useRef<AnimationPlaybackControlsWithThen>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const height = useMotionValue(HEIGHT);
  const minHeight = HEIGHT;
  const maxHeight = window.innerHeight;

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

      if (info.velocity.y > 300 || currentHeight < maxHeight * 0.3) {
        expand(minHeight);
        return;
      }

      if (currentHeight > maxHeight * 0.3) {
        expand(maxHeight);
      }
    },
    [expand, height, maxHeight, minHeight],
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ height: height }}
      transition={{ type: 'spring', damping: 20, bounce: 0 }}
      className='fixed bottom-0 left-0 z-75 w-full overflow-hidden bg-white'
      onPan={onPan}
      onPanStart={onPanStart}
      onPanEnd={onPanEnd}
      onClick={() => {
        if (height.get() === minHeight) {
          expand(maxHeight);
        }
      }}
    >
      <div className='h-full cursor-grab bg-white' />
    </motion.div>
  );
};

export { TrackBarMobile };
