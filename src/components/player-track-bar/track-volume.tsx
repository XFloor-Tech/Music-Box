import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { AudioSettingsStates } from '@/core/audio/useAudioPlayer';

type Props = {
  states: AudioSettingsStates;
  onChange?: (value: number) => void;
};

const TrackVolumeBar: FC<Props> = ({ states, onChange }) => {
  const [volume, setVolume] = useState(0.5);
  const volumeBeforeMuteRef = useRef(0);

  useEffect(() => {
    setVolume(states.volume);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- on mount only. we do this to fetch local storage value from client after hydration
  }, []);

  const updateVolume = useCallback(
    (value: number) => {
      setVolume(value);
      onChange?.(value);
    },
    [onChange],
  );

  const onSliderChange = useCallback(
    (value: number[]) => {
      updateVolume(value[0]);
    },
    [updateVolume],
  );

  const icon = useMemo(() => {
    if (volume === 0) {
      return (
        <VolumeX
          size={16}
          className='text-primary group-hover:text-primary/90'
        />
      );
    }

    if (volume >= 0.5) {
      return (
        <Volume2
          size={16}
          className='text-primary group-hover:text-primary/90'
        />
      );
    }

    return (
      <Volume1 size={16} className='text-primary group-hover:text-primary/90' />
    );
  }, [volume]);

  const onVolumeClick = useCallback(() => {
    if (volume === 0) {
      updateVolume(volumeBeforeMuteRef.current);
      return;
    }

    volumeBeforeMuteRef.current = volume;
    updateVolume(0);
  }, [updateVolume, volume]);

  return (
    <div className='flex items-center gap-1 md:gap-2 lg:gap-3'>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={onVolumeClick}
        className='group'
        aria-description='mute'
      >
        {icon}
      </Button>

      <Slider
        aria-label='player-volume-slider'
        min={0}
        max={1}
        step={0.01}
        defaultValue={[volume]}
        value={[volume]}
        className='w-10 md:w-20 lg:w-30'
        onValueChange={onSliderChange}
      />
    </div>
  );
};

export { TrackVolumeBar };
