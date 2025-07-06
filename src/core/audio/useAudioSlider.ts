import { RefObject, useCallback, useEffect, useRef } from "react";
import { useGetPlayerRef } from "./useGetPlayer";

type AudioSliders = {
  progressSliderRef: RefObject<HTMLInputElement | null>;
  volumeSliderRef: RefObject<HTMLInputElement | null>;
};

type UseAudioSliderParams = {
  sliders: AudioSliders;
  progressChange: (value: number) => Promise<void>;
  volumeChange: (value: number) => void;
};

const useAudioSlider = (params: UseAudioSliderParams) => {
  const { sliders, progressChange, volumeChange } = params;
  const { progressSliderRef, volumeSliderRef } = sliders;

  const playerRef = useGetPlayerRef();

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntervals = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const setup = useCallback(async () => {
    // Progress slider setup
    if (progressSliderRef?.current) {
      progressSliderRef.current.value =
        playerRef.current?.getCurrentBufferProgress()?.toString() ?? "0";
      progressSliderRef.current.min = "0";
      progressSliderRef.current.max =
        playerRef.current?.getBufferDuration()?.toString() ?? "100";

      const updateProgress = () => {
        const audioDuration = playerRef.current?.getBufferDuration();
        const currentTime = playerRef.current?.getCurrentBufferProgress();

        if (
          currentTime === null ||
          audioDuration === null ||
          currentTime === undefined ||
          audioDuration === undefined ||
          !progressSliderRef.current ||
          currentTime > audioDuration
        ) {
          clearIntervals();
          return;
        }
        progressSliderRef.current.value = currentTime.toString();
      };

      progressIntervalRef.current = setInterval(updateProgress, 50);
    }

    // Volume slider setup
    if (volumeSliderRef?.current) {
      volumeSliderRef.current.step = "0.05";
      volumeSliderRef.current.value =
        playerRef.current?.getVolumeValue().toString() ?? "0.5";
      volumeSliderRef.current.min = "0";
      volumeSliderRef.current.max = "1";
    }
  }, [playerRef, progressSliderRef, volumeSliderRef]);

  const refresh = useCallback(async () => {
    clearIntervals();
    await setup();
  }, [setup]);

  // Event listeners
  useEffect(() => {
    const progressSlider = progressSliderRef?.current;
    const volumeSlider = volumeSliderRef?.current;

    // Progress events
    const onProgressMouseDown = () => {
      // stop listening to progress updates while dragging
      clearIntervals();
    };
    const onProgressMouseUp = (event: Event) => {
      const value = parseFloat((event.target as HTMLInputElement).value);
      // set progress on mouse release and setup listener in start event
      progressChange(value);
    };
    if (progressSlider) {
      progressSlider.addEventListener("mousedown", onProgressMouseDown);
      progressSlider.addEventListener("mouseup", onProgressMouseUp);
    }

    // Volume events
    const onVolumeChange = (event: Event) => {
      const value = parseFloat((event.target as HTMLInputElement).value);
      volumeChange(value);
    };
    if (volumeSlider) {
      volumeSlider.addEventListener("input", onVolumeChange);
    }

    // Cleanup event listeners
    return () => {
      progressSlider?.removeEventListener("mousedown", onProgressMouseDown);
      progressSlider?.removeEventListener("mouseup", onProgressMouseUp);
      volumeSlider?.removeEventListener("input", onVolumeChange);
    };
  }, [progressChange, progressSliderRef, volumeChange, volumeSliderRef]);

  useEffect(() => {
    setup();
    return () => {
      clearIntervals();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- need this on mount only
  }, []);

  return { setup, clear: clearIntervals, refresh };
};

export { useAudioSlider, type AudioSliders, type UseAudioSliderParams };
