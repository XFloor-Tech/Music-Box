import { AudioSettingsStates } from '@/core/audio/types';
import { FC, useLayoutEffect, useMemo, useState } from 'react';

import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
} from 'framer-motion';
import { clamp } from 'lodash';
import { BAR_HEIGHT, BAR_PROGRESS } from './constants';

type Props = {
  height: MotionValue<number>;
  states: AudioSettingsStates;
};

const TrackProgressMini: FC<Props> = ({ height, states }) => {
  const [shown, setShown] = useState(states.isLoaded);

  useLayoutEffect(() => {
    setShown(height.get() <= BAR_HEIGHT + BAR_PROGRESS && states.isLoaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on states change
  }, [states]);

  const progress = useMemo(() => {
    if (!states.progress || !states.duration) {
      return 0;
    }

    const maxWidth = window.innerWidth;

    return clamp((states.progress / states.duration) * maxWidth, 0, maxWidth);
  }, [states]);

  useMotionValueEvent(height, 'change', (latest) => {
    setShown(latest <= BAR_HEIGHT + BAR_PROGRESS && states.isLoaded);
  });

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          layout
          initial={{ height: 0 }}
          animate={{ height: BAR_PROGRESS }}
          exit={{ height: 0 }}
          className='w-full bg-neutral-700'
        >
          <motion.div
            style={{ width: progress }}
            animate={{ width: progress, height: BAR_PROGRESS }}
            initial={{ height: 0 }}
            exit={{ height: 0 }}
            className='bg-pink h-1'
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { TrackProgressMini };
