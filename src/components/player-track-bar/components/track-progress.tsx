import {
  FC,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Slider } from '../../ui/slider';
import { progressFromRawValue } from '../utils';
import { AudioSettingsStates } from '@/core/audio/types';
import { useScreenSize } from '@/utils/screen-size';

type Props = {
  states: AudioSettingsStates;
  onChange?: (value: number) => void;
};

const TrackProgressBar: FC<Props> = ({ states, onChange }) => {
  const [progress, setProgress] = useState([states.progress]);
  const [dragging, setDragging] = useState(false);
  const [moving, setMoving] = useState(false);

  const sliderRef = useRef<HTMLSpanElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  const dragTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const size = useScreenSize();

  const onValueChange = useCallback((value: number[]) => {
    setProgress(value);
  }, []);

  const onValueCommit = useCallback(
    (value: number[]) => {
      onChange?.(value[0]);
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
      setMoving(false);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pressure > 0 && tipRef.current) {
        setMoving(true);
        const tip = tipRef.current;
        // const offset = event.offsetX - tip.getBoundingClientRect().width / 2; -- trying to get right tip width but as its hidden its gone get itchy as my asshole
        const pointerXOffset = Math.min(
          slider?.getBoundingClientRect().width ?? 100,
          Math.max(0, event.offsetX),
        );
        const offset = pointerXOffset - 27;
        tip.style.transform = `translateX(${offset}px)`;
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

  const showTip = useMemo(
    () => states.isLoaded && moving,
    [moving, states.isLoaded],
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
      thumbless={size !== 'xs'}
    >
      <div
        className={`${showTip ? 'flex' : 'hidden'} text-text absolute bottom-1 z-20 flex-col items-center text-sm`}
        ref={tipRef}
      >
        <span className='flex items-center justify-center rounded-md bg-neutral-50 px-3 py-1.5 text-sm after:content-[``]'>
          {progressFromRawValue(value[0])}
        </span>
        <span className='border-5 border-t-5 border-transparent border-t-neutral-50' />
      </div>
    </Slider>
  );
};

export { TrackProgressBar };
