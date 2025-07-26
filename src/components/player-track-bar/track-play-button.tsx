import {
  AudioSettingsStates,
  StartAudioParams,
} from '@/core/audio/useAudioPlayer';
import { Pause, Play } from 'lucide-react';
import { FC, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';

type Props = {
  states: AudioSettingsStates;
  onPlay?: (params: StartAudioParams) => void;
  onPause?: () => void;
  onResume?: () => void;
};

const TrackPlayButton: FC<Props> = ({ states, onPlay, onPause, onResume }) => {
  const onClick = useCallback(() => {
    if (states.isPlaying) {
      onPause?.();
      return;
    }

    if ((states.isPaused && states.isLoaded) || states.isResumed) {
      onResume?.();
      return;
    }

    onPlay?.({ path: '176.mp3' });
  }, [states, onPlay, onPause, onResume]);

  const icon = useMemo(() => {
    if (states.isPlaying && states.isLoaded) {
      return <Pause size={24} className='text-pink' />;
    }

    // if (states.isPaused || states.isResumed) {
    //   return <Play size={24} className='text-pink' />;
    // }

    return <Play size={24} className='text-pink' />;
  }, [states]);

  return (
    <Button
      variant='ghost'
      size='icon'
      className='rounded-full bg-neutral-50 hover:bg-neutral-300!'
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

export { TrackPlayButton };
