import { AudioContext } from "standardized-audio-context";

type AudioBufferStartParams = {
  when?: number;
  offset?: number;
  duration?: number;
};

class AudioPlayer {
  private static _instance: AudioPlayer;

  private _audioContext;
  private _audioBufferSource;
  private _gain;

  private _playerStartTime;
  private _startOffset;

  private constructor() {
    this._audioContext = new AudioContext();
    this._audioBufferSource = this._audioContext.createBufferSource();

    this._gain = this._audioContext.createGain();
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);

    this._playerStartTime = 0;
    this._startOffset = 0;
  }

  public static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AudioPlayer();
    return this._instance;
  }

  public audioFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    return this._audioContext.decodeAudioData(arrayBuffer);
  }

  private reconnectGain() {
    this._gain.disconnect();
    this._gain = this._audioContext.createGain();
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);
  }

  private invalidateAudioBufferSource() {
    this._audioBufferSource.disconnect();
    this._audioBufferSource = this._audioContext.createBufferSource();
    this.reconnectGain();
  }

  private async playAudioBuffer(
    audioBuffer: AudioBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    /** Invalidate existing source if there was a buffer and create a new source */
    if (this._audioBufferSource.buffer) {
      this.invalidateAudioBufferSource();
    }

    // Set player start time after source is loaded
    this._playerStartTime = this._audioContext.currentTime;
    // Update start offset if provided
    this._startOffset = startParams?.offset ?? 0;

    this._audioBufferSource.buffer = audioBuffer;
    // dont use another connect as we already connected it to gain
    // this._audioBufferSource.connect(this._audioContext.destination);

    this._audioBufferSource.start(
      startParams?.when,
      startParams?.offset,
      startParams?.duration,
    );

    // resume context if it was suspended
    this.resume();
  }

  public async playArrayBuffer(
    arrayBuffer: ArrayBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    const audioBuffer = await this.audioFromArrayBuffer(arrayBuffer);
    await this.playAudioBuffer(audioBuffer, startParams);
  }

  public closeContextSources() {
    this._audioBufferSource.stop();
    this._audioBufferSource.disconnect();
    this._gain.disconnect();
    this._audioContext.close();
  }

  public pause() {
    // maybe use source.stop() instead
    if (this.getAudioState() === "running") {
      this._audioContext.suspend();
    }
  }

  public resume() {
    // maybe use source.start() instead
    if (this.getAudioState() === "suspended") {
      this._audioContext.resume();
    }
  }

  public setVolume(value: number) {
    if (value > 1 || value < 0) {
      throw new Error("Provided value is not valid");
    }

    this._gain.gain.setValueAtTime(value, this._audioContext.currentTime);
  }

  public getAudioState() {
    return this._audioContext.state;
  }

  public getCurrentTime() {
    return this._audioContext.currentTime;
  }

  public getBufferDuration() {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) {
      throw new Error("There's no buffer to get duration from");
    }
    return currentBuffer.duration;
  }

  public changePlayTime(value: number) {
    const currentBuffer = this._audioBufferSource.buffer;
    if (value < 0 || !currentBuffer || value > currentBuffer.duration) {
      throw new Error("There's no buffer or provided value is out of range");
    }

    this._audioBufferSource.start(0, value);
  }

  public getVolumeValue() {
    return this._gain.gain.value;
  }

  public getCurrentBufferProgress() {
    const currentBuffer = this._audioBufferSource.buffer;
    if (!currentBuffer) {
      throw new Error("There's no buffer to get progress from");
    }

    const elapsed = this._audioContext.currentTime - this._playerStartTime;
    const playbackRate = this._audioBufferSource.playbackRate.value;
    const currentTime = this._startOffset + elapsed * playbackRate;

    return currentTime;
  }
}

export { AudioPlayer, type AudioBufferStartParams };
