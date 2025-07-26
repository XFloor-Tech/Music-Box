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

  useEffect(() => {
    setLoop(states.loop);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on mount: get local storage value from client when hydrated
  }, []);

  const onLoopClick = useCallback(() => {
    setLoop((prev) => !prev);
    onLoop?.();
  }, [onLoop]);

  return (
    <div className='flex items-center gap-[16px]'>
      <Button variant='ghost' size='icon-sm' onClick={onLoopClick}>
        <Repeat size={16} className={loop ? 'text-pink' : 'text-neutral-50'} />
      </Button>
      <Button variant='ghost' size='icon-sm'>
        <Shuffle size={16} className='text-pink' />
      </Button>
    </div>
  );
};

export { TrackRepeatShuffle };
