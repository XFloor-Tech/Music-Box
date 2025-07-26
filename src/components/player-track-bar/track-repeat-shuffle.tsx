import { Repeat, Shuffle } from 'lucide-react';
import { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { AudioSettingsStates } from '@/core/audio/useAudioPlayer';

type Props = {
  states: AudioSettingsStates;
  onLoop?: () => void;
};

const TrackRepeatShuffle: FC<Props> = ({ states, onLoop }) => {
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    setLoop(states.loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount: get local storage value from client when hydrated
  }, []);

  const onLoopClick = useCallback(() => {
    setLoop((prev) => !prev);
    onLoop?.();
  }, [onLoop]);

  const onShuffleClick = useCallback(() => {
    setShuffle((prev) => !prev);
  }, []);

  return (
    <div className='flex items-center gap-[16px]'>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={onLoopClick}
        className='group'
      >
        <Repeat
          size={16}
          className={
            loop
              ? 'text-pink group-hover:text-pink/90'
              : 'text-neutral-50 group-hover:text-neutral-50/90'
          }
        />
      </Button>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={onShuffleClick}
        className='group'
      >
        <Shuffle
          size={16}
          className={
            shuffle
              ? 'text-pink group-hover:text-pink/90'
              : 'text-neutral-50 group-hover:text-neutral-50/90'
          }
        />
      </Button>
    </div>
  );
};

export { TrackRepeatShuffle };
