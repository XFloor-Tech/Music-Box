import { FC, useCallback, useState } from 'react';
import {
  motion,
  PanInfo,
  useDragControls,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from 'framer-motion';

const TrackBarMobile: FC = () => {
  const [expanded, setExpanded] = useState(false);

  const height = useMotionValue(40);
  const minHeight = 40;
  const maxHeight = window.innerHeight;
  // const controls = useDragControls();

  // useMotionValueEvent(height, 'change', (latest) => {
  //   if (latest < -200) {
  //     setExpanded(true);
  //   }
  // });

  const onPan = useCallback(
    (event: PointerEvent, info: PanInfo) => {
      const newHeight = height.get() - info.delta.y;
      height.set(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    },
    [height, maxHeight],
  );

  const onPanEnd = useCallback(
    (event: PointerEvent, info: PanInfo) => {
      const currentHeight = height.get();

      if (info.velocity.y > 300 || currentHeight < maxHeight * 0.5) {
        // height.set(minHeight);
        animate(height, minHeight, { type: 'spring', damping: 25 });
        return;
      }

      if (currentHeight > maxHeight * 0.5) {
        animate(height, maxHeight, { type: 'spring', damping: 25 });
      }
    },
    [height, maxHeight],
  );

  return (
    <motion.div
      style={{ height: expanded ? '100vh' : height }}
      transition={{ type: 'spring', damping: 20 }}
      // animate={{ height: expanded ? '100vh' : height }}
      className='fixed bottom-0 left-0 z-75 w-full overflow-hidden bg-white'
      onPan={onPan}
      onPanEnd={onPanEnd}
    >
      <div className='h-full cursor-grab bg-white' />
    </motion.div>
  );
};

export { TrackBarMobile };
