import { Pause, Play } from 'lucide-react';
import { FC, MouseEvent, useCallback, useMemo } from 'react';
import { Button } from '../../ui/button';
import { AudioSettingsStates, StartAudioParams } from '@/core/audio/types';
import { cn } from '@/lib/utils';

type Props = {
  states: AudioSettingsStates;
  onPlay?: (params: StartAudioParams) => void;
  onPause?: () => void;
  onResume?: () => void;
  size?: number;
  className?: string;
};

const TrackPlayButton: FC<Props> = ({
  states,
  onPlay,
  onPause,
  onResume,
  className,
  size = 24,
}) => {
  const onClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();

      if (states.isPlaying) {
        onPause?.();
        return;
      }

      if ((states.isPaused && states.isLoaded) || states.isResumed) {
        onResume?.();
        return;
      }

      onPlay?.({ path: '176.mp3' });
    },
    [states, onPlay, onPause, onResume],
  );

  const icon = useMemo(() => {
    if (states.isPlaying && states.isLoaded) {
      return <Pause size={size} className='text-primary' strokeWidth={2} />;
    }

    return <Play size={size} className='text-primary' strokeWidth={2} />;
  }, [states, size]);

  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn(
        'h-9 w-9 rounded-full bg-neutral-50 opacity-80 hover:bg-neutral-300!',
        className,
      )}
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

export { TrackPlayButton };
