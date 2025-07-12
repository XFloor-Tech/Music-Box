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
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntervals = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const setup = useCallback(async () => {
    const player = playerRef.current;

    // Progress slider setup
    if (progressSliderRef?.current) {
      progressSliderRef.current.value =
        player?.getCurrentBufferProgress()?.toString() ?? "0";
      progressSliderRef.current.min = "0";
      progressSliderRef.current.max =
        player?.getBufferDuration()?.toString() ?? "100";

      const updateProgress = () => {
        const audioDuration = player?.getBufferDuration();
        const currentTime = player?.getCurrentBufferProgress();

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
        player?.getVolumeValue().toString() ?? "0.5";
      volumeSliderRef.current.min = "0";
      volumeSliderRef.current.max = "1";

      const updateVolume = () => {
        const volume = player?.getVolumeValue() ?? 0.5;
        volumeSliderRef.current!.value = volume.toString();
      };

      volumeIntervalRef.current = setInterval(updateVolume, 50);
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
      progressSlider.addEventListener("touchstart", onProgressMouseDown);
      progressSlider.addEventListener("touchend", onProgressMouseUp);
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
      progressSlider?.removeEventListener("touchstart", onProgressMouseDown);
      progressSlider?.removeEventListener("touchend", onProgressMouseUp);
      volumeSlider?.removeEventListener("input", onVolumeChange);
    };
  }, [progressChange, progressSliderRef, volumeChange, volumeSliderRef]);

  useEffect(() => {
    setup();
    return () => {
      clearIntervals();
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
        volumeIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- need this on mount only
  }, []);

  return { setup, clear: clearIntervals, refresh };
};

export { useAudioSlider, type AudioSliders, type UseAudioSliderParams };
