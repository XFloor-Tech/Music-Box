import { AudioContext } from 'standardized-audio-context';
import {
  AudioEventType,
  AudioBufferStartParams,
  AudioEventListener,
  AudioScaffoldParams,
} from './types';
import { IAudioPlayer } from './IAudioPlayer';

/*
 * Class that manages audio playback using the Web Audio API and provides basic audio functions.
 */
class AudioPlayer implements IAudioPlayer {
  private static _instance: AudioPlayer | null;

  private _audioContext;
  private _audioBufferSource;
  private _gain;

  private _playerStartTime;
  private _startOffset;
  private _volume;
  private _elapsed;

  private _loaded;
  private _paused;
  private _ended;
  private _muted;
  private _loop;

  private _endTimer: NodeJS.Timeout | undefined;
  private _tickTimer: NodeJS.Timeout | undefined;
  private _listeners;

  private constructor(params?: AudioScaffoldParams) {
    const settings = params?.settings;

    this._playerStartTime = 0;
    this._startOffset = 0;
    this._volume = settings?.volume ?? 0.5;
    this._elapsed = 0;

    this._loaded = false;
    this._paused = false;
    this._ended = false;
    this._muted = settings?.muted ?? false;
    this._loop = settings?.loop ?? false;

    this._listeners = {} as Record<AudioEventType, () => void>;
    if (params?.listeners) {
      params.listeners.forEach((listener) => {
        this._listeners[listener.event] = listener.on;
      });
    }

    this._audioContext = params?.context ?? new AudioContext();
    this._audioBufferSource = this._audioContext.createBufferSource();

    this._gain = this._audioContext.createGain();
    this.setVolume(this._volume);
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);
  }

  public static getInstance(params?: AudioScaffoldParams) {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AudioPlayer(params);
    return this._instance;
  }

  private _clearTimers() {
    clearTimeout(this._endTimer);
    clearInterval(this._tickTimer);
  }

  private _setupTimers() {
    const duration = Math.max(
      0,
      (this.getBufferDuration() ?? 0) - this._startOffset,
    );

    const tickInterval = 1000 * this._audioBufferSource.playbackRate.value;
    this._tickTimer = setInterval(() => {
      this._elapsed += tickInterval / 1000;
      this._listeners.tick?.();
    }, tickInterval);

    // Set up timer manually, because there's not good native way to listen for end of playback
    this._endTimer = setTimeout(() => {
      this._listeners.end?.();
      if (this._loop) this._listeners.start?.();
      if (!this._loop) {
        this._ended = true;
        this._clearTimers();
      }
      // When playback ends, start over
      this._playerStartTime = this._audioContext.currentTime;
      this._startOffset = 0;
      this._elapsed = 0;
    }, duration * 1000);
  }

  public audioFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    return this._audioContext.decodeAudioData(arrayBuffer);
  }

  private _reconnectGain() {
    this._gain.disconnect();
    this._gain = this._audioContext.createGain();
    this.setVolume(this._volume);
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);
  }

  public invalidateAudioBufferSource() {
    this._loaded = false;
    this._audioBufferSource.stop();
    this._audioBufferSource.disconnect();

    this._clearTimers();
  }

  private _revalidateAudioBufferSource() {
    this.invalidateAudioBufferSource();
    this._audioBufferSource = this._audioContext.createBufferSource();
    this._reconnectGain();
  }

  private async playAudioBuffer(
    audioBuffer: AudioBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    // Revalidate existing source if there was a buffer and create a new source
    if (this._audioBufferSource.buffer) {
      this._revalidateAudioBufferSource();
    }

    // Set player start time after source is loaded
    this._playerStartTime = this._audioContext.currentTime;
    // Update start offset if provided
    this._startOffset = startParams?.offset ?? 0;
    this._elapsed = this._startOffset;

    this._audioBufferSource.buffer = audioBuffer;
    this._loaded = true;
    this._ended = false;

    const looped = (startParams?.loop ?? false) || this._loop;
    this._audioBufferSource.loop = looped;
    this._audioBufferSource.loopStart = 0;
    this._audioBufferSource.loopEnd = audioBuffer.duration;
    this._loop = looped;

    if (!this._paused) {
      this._setupTimers();
    }

    if (startParams?.type !== 'progress') {
      this._listeners.start?.();
    }

    this._audioBufferSource.start(
      startParams?.when,
      startParams?.offset,
      startParams?.duration,
    );
  }

  private _playCurrentAudioBuffer(startParams?: AudioBufferStartParams) {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) return;
    this.playAudioBuffer(currentBuffer, startParams);
  }

  public async playArrayBuffer(
    arrayBuffer: ArrayBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    const audioBuffer = await this.audioFromArrayBuffer(arrayBuffer);
    await this.playAudioBuffer(audioBuffer, startParams);
  }

  public close() {
    this.invalidateAudioBufferSource();
    this._gain.disconnect();
    this._audioContext.close();
    // Remove all listeners
    this._listeners = {} as Record<AudioEventType, () => void>;
    AudioPlayer._instance = null;
  }

  public pause() {
    if (!this._paused && this.getContextState() === 'running' && !this._ended) {
      this._clearTimers();
      this._paused = true;
      this._listeners.pause?.();
      // this._startOffset = this.getCurrentBufferProgress() ?? 0;
      this._startOffset = this._elapsed;
      this._playerStartTime = this._audioContext.currentTime;
      this._audioContext.suspend();
    }
  }

  public resume() {
    if (
      this._paused &&
      this.getContextState() === 'suspended' &&
      !this._ended
    ) {
      this._audioContext.resume();
      this._setupTimers();
      this._listeners.resume?.();
      this._paused = false;
    }
  }

  public setVolume(value: number) {
    this._muted = value === 0;
    this._volume = value;
    this._gain.gain.setValueAtTime(value, this._audioContext.currentTime);
  }

  public mute() {
    this.setVolume(this._muted ? 1 : 0);
    this._muted = !this._muted;
  }

  public loop() {
    this._loop = !this._loop;
    const audioBuffer = this._audioBufferSource.buffer;
    if (audioBuffer) {
      this._audioBufferSource.loopStart = 0;
      this._audioBufferSource.loopEnd = audioBuffer.duration;
      this._audioBufferSource.loop = this._loop;
    }
  }

  public getContextState() {
    return this._audioContext.state;
  }

  public getCurrentTime() {
    return this._audioContext.currentTime;
  }

  public getBufferDuration() {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) {
      return null;
    }
    return currentBuffer.duration;
  }

  public setProgress(value: number) {
    const duration = this.getBufferDuration();
    if (value < 0 || !duration || value > duration) {
      return;
    }
    this._startOffset = value;

    this._playCurrentAudioBuffer({
      when: 0,
      offset: value,
      loop: this._loop,
      type: 'progress',
    });
    this._listeners.tick?.();
  }

  public getVolumeValue() {
    return this._volume;
  }

  public getIsLoaded() {
    return this._loaded;
  }

  public getIsLooped() {
    return this._loop;
  }

  // unstable: calculates wrong elapsed time on progress change because of assumingly audiocontext currentTime
  public getCurrentBufferProgress() {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) {
      return null;
    }

    const elapsed = this._audioContext.currentTime - this._playerStartTime;
    const playbackRate = this._audioBufferSource.playbackRate.value;
    const currentTime = (this._startOffset + elapsed) * playbackRate;

    return currentTime;
  }

  public getElapsedTime() {
    return this._elapsed;
  }

  public addListeners(listeners: AudioEventListener[]) {
    listeners.forEach((listener) => {
      this._listeners[listener.event] = listener.on;
    });
  }
}

export { AudioPlayer };
