import { AudioContext } from "standardized-audio-context";

class AudioPlayer {
  private static _instance: AudioPlayer;

  private _audioContext;
  private _audioBufferSource;

  private constructor(args: unknown) {
    this._audioContext = new AudioContext();
    this._audioBufferSource = this._audioContext.createBufferSource();
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

  private playAudioBuffer(audioBuffer: AudioBuffer) {
    this._audioBufferSource.buffer = audioBuffer;
    this._audioBufferSource.connect(this._audioContext.destination);
    this._audioBufferSource.start();
  }

  public async playAudioFile(path: string) {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioFromArrayBuffer(arrayBuffer);
    this.playAudioBuffer(audioBuffer);
  }
}

export { AudioPlayer };
