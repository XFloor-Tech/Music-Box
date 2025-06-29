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

  private constructor(args: unknown) {
    this._audioContext = new AudioContext();
    this._audioBufferSource = this._audioContext.createBufferSource();

    this._gain = this._audioContext.createGain();
    this._audioBufferSource.connect(this._gain);
    this._gain.connect(this._audioContext.destination);
  }

  public static getInstance(args: unknown) {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new AudioPlayer(args);
    return this._instance;
  }

  public audioFromArrayBuffer(arrayBuffer: ArrayBuffer) {
    return this._audioContext.decodeAudioData(arrayBuffer);
  }

  private playAudioBuffer(
    audioBuffer: AudioBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    this._audioBufferSource.buffer = audioBuffer;
    this._audioBufferSource.connect(this._audioContext.destination);
    this._audioBufferSource.start(
      startParams?.when,
      startParams?.offset,
      startParams?.duration,
    );
  }

  public async playArrayBuffer(
    arrayBuffer: ArrayBuffer,
    startParams?: AudioBufferStartParams,
  ) {
    const audioBuffer = await this.audioFromArrayBuffer(arrayBuffer);
    this.playAudioBuffer(audioBuffer, startParams);
  }

  public async playAudioFile(
    path: string,
    startParams?: AudioBufferStartParams,
  ) {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    this.playArrayBuffer(arrayBuffer, startParams);
  }

  public closeContext() {
    this._audioBufferSource.stop();
    this._audioContext.close();
  }

  public pause() {
    // maybe use source.stop() instead
    this._audioContext.suspend();
  }

  public resume() {
    // maybe use source.start() instead
    this._audioContext.resume();
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

  public changePlayTime(value: number) {
    const currentBuffer = this._audioBufferSource.buffer;
    if (value < 0 || !currentBuffer || value > currentBuffer.duration) {
      throw new Error("There no buffer or provided value is out of range");
    }

    this._audioBufferSource.start(0, value);
  }
}

export { AudioPlayer };
