import { AudioSettingsStates } from '@/core/audio/useAudioPlayer';
import {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Slider } from '../ui/slider';

type Props = {
  states: AudioSettingsStates;
  onChange?: (value: number) => void;
};

const TrackProgressBar: FC<Props> = ({ states, onChange }) => {
  const [progress, setProgress] = useState([states.progress]);
  const [dragging, setDragging] = useState(false);

  const sliderRef = useRef<HTMLSpanElement | null>(null);

  const dragTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const onValueChange = useCallback((value: number[]) => {
    setProgress(value);
  }, []);

  const onValueCommit = useCallback(
    (value: number[]) => {
      if (value[0]) {
        onChange?.(value[0]);
      }
    },
    [onChange],
  );

  useLayoutEffect(() => {
    const slider = sliderRef.current;

    const handlePointerDown = () => {
      setDragging(true);
    };
    const handlePointerUp = () => {
      // timeout to allow the slider emit update before setting dragging to false and changing back to progress listen value
      dragTimeoutRef.current = setTimeout(() => {
        setDragging(false);
      }, 0);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pressure > 0) {
      }
    };

    if (slider) {
      slider.addEventListener('pointerdown', handlePointerDown);
      slider.addEventListener('pointerup', handlePointerUp);
      slider.addEventListener('pointermove', handlePointerMove);

      return () => {
        slider.removeEventListener('pointerdown', handlePointerDown);
        slider.removeEventListener('pointerup', handlePointerUp);
        slider.removeEventListener('pointermove', handlePointerMove);
        clearTimeout(dragTimeoutRef.current);
      };
    }
  }, []);

  const value = useMemo(
    () => (dragging ? progress : [states.progress]),
    [dragging, progress, states],
  );

  return (
    <Slider
      aria-label='player-progress-slider'
      defaultValue={[states.progress]}
      value={value}
      min={0}
      max={states.duration}
      ref={sliderRef}
      onValueChange={onValueChange}
      onValueCommit={onValueCommit}
      thumbless
    />
  );
};

export { TrackProgressBar };
