import { AudioContext } from "standardized-audio-context";

type AudioBufferStartParams = {
  when?: number;
  offset?: number;
  duration?: number;
  loop?: boolean;
};

type AudioEventType = "end";
type AudioEventListener = { event: AudioEventType; on: () => void };

type AudioScaffoldParams = {
  listeners?: AudioEventListener[];
};

/*
 * Class that manages audio playback using the Web Audio API and provides basic audio functions.
 */
class AudioPlayer {
  private static _instance: AudioPlayer;

  private _audioContext;
  private _audioBufferSource;
  private _gain;

  private _playerStartTime;
  private _startOffset;

  private _loaded;
  private _paused;
  private _muted;
  private _loop;

  private _endTimer: NodeJS.Timeout | null;
  private _listeners;

  private constructor(params?: AudioScaffoldParams) {
    this._audioContext = new AudioContext();
    this._audioBufferSource = this._audioContext.createBufferSource();

    this._gain = this._audioContext.createGain();
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);

    this._playerStartTime = 0;
    this._startOffset = 0;

    this._loaded = false;
    this._paused = false;
    this._muted = false;
    this._loop = false;

    this._endTimer = null;
    this._listeners = {} as Record<AudioEventType, () => void>;
    if (params?.listeners) {
      params.listeners.forEach((listener) => {
        this._listeners[listener.event] = listener.on;
      });
    }
  }

  public static getInstance(params?: AudioScaffoldParams) {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AudioPlayer(params);
    return this._instance;
  }

  public audioFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    return this._audioContext.decodeAudioData(arrayBuffer);
  }

  private _reconnectGain() {
    this._gain.disconnect();
    this._gain = this._audioContext.createGain();
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);
  }

  public invalidateAudioBufferSource() {
    this._loaded = false;
    this._audioBufferSource.stop();
    this._audioBufferSource.disconnect();

    if (this._endTimer) {
      clearTimeout(this._endTimer);
    }
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
    // if (this._audioContext.state === "suspended") {
    //   this._audioContext.resume();
    // }

    /** Revalidate existing source if there was a buffer and create a new source */
    if (this._audioBufferSource.buffer) {
      this._revalidateAudioBufferSource();
    }

    // Set player start time after source is loaded
    this._playerStartTime = this._audioContext.currentTime;
    // Update start offset if provided
    this._startOffset = startParams?.offset ?? 0;

    this._audioBufferSource.buffer = audioBuffer;
    this._loaded = true;
    // dont use another connect as we already connected it to gain
    // this._audioBufferSource.connect(this._audioContext.destination);

    const looped = (startParams?.loop ?? false) || this._loop;
    this._audioBufferSource.loop = looped;
    this._audioBufferSource.loopStart = 0;
    this._audioBufferSource.loopEnd = audioBuffer.duration;
    this._loop = looped;

    const duration = Math.max(
      0,
      audioBuffer.duration - (startParams?.offset ?? 0),
    );

    this._endTimer = setTimeout(() => {
      this._listeners.end?.();
      if (!this._loop) this.pause();
      // when playback ends, start over
      this._playerStartTime = this._audioContext.currentTime;
      this._startOffset = 0;
    }, duration * 1000);

    this._audioBufferSource.start(
      startParams?.when,
      startParams?.offset,
      startParams?.duration,
    );

    // resume context if it was suspended
    // this.resume();
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

  public closeContextSources() {
    this.invalidateAudioBufferSource();
    this._gain.disconnect();
    this._audioContext.close();
    // Remove all listeners
    this._listeners = {} as Record<AudioEventType, () => void>;
  }

  public pause() {
    if (!this._paused && this.getContextState() === "running") {
      this._audioContext.suspend();
      this._paused = true;
    }
  }

  public resume() {
    if (this._paused && this.getContextState() === "suspended") {
      this._audioContext.resume();
      // this._audioBufferSource.start(0, this._startOffset);
      this._paused = false;
    }
  }

  public setVolume(value: number) {
    if (value > 1 || value < 0) {
      return;
    }
    this._muted = value === 0;
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

    this._playCurrentAudioBuffer({ when: 0, offset: value, loop: this._loop });
  }

  public getVolumeValue() {
    return this._gain.gain.value;
  }

  public getIsLoaded() {
    return this._loaded;
  }

  public getIsLooped() {
    return this._loop;
  }

  public getCurrentBufferProgress() {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) {
      return null;
    }

    const elapsed = this._audioContext.currentTime - this._playerStartTime;
    const playbackRate = this._audioBufferSource.playbackRate.value;
    const currentTime = this._startOffset + elapsed * playbackRate;

    return currentTime;
  }

  public addListeners(listeners: AudioEventListener[]) {
    listeners.forEach((listener) => {
      this._listeners[listener.event] = listener.on;
    });
  }
}

export {
  AudioPlayer,
  type AudioBufferStartParams,
  type AudioEventListener,
  type AudioScaffoldParams,
};
