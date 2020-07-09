import { MediaServiceState } from './types';

/**
 * 1. Provides audio data playing capabilities
 * 2. Provides audio file playing capabilities
 * 3. Provides audio data/file conversion (media-utils)
 * 4. Provides audio input recording capabilities
 * 5. Allow configurations
 */
export class ChromiumMediaService {
  private readonly gainNode: GainNode = this.audioCtx.createGain();
  private readonly destinationNode: MediaStreamAudioDestinationNode = this.audioCtx.createMediaStreamDestination();
  private currentSource?: AudioScheduledSourceNode | AudioNode;

  constructor(
      private readonly audioCtx: AudioContext,
      private readonly audioElement: HTMLAudioElement,
  ) {
    this.gainNode.connect(this.destinationNode);
    this.audioElement.autoplay = true;
    this.audioElement.srcObject = this.destinationNode.stream;
  }

  private removeCurrentSource = (): void => {
    if (this.currentSource) {
      this.currentSource.disconnect();
    }
    this.currentSource = undefined;
  };

  setSource = (source: AudioScheduledSourceNode | AudioNode): void => {
    this.removeCurrentSource();
    source.connect(this.gainNode);
    this.currentSource = source;
  };

  currentState = (): MediaServiceState => {
    if (this.audioCtx.state === 'closed') {
      return 'closed';
    } else if (!this.currentSource) {
      return 'suspended';
    } else {
      return 'running';
    }
  };

  resumePlaying = async (): Promise<void> => {
    this.audioElement.muted = false;
    return this.audioCtx.resume();
    // FIXME Not sure if this works well
    // if (this.currentState() === 'suspended') {
    //   return this.audioCtx.resume();
    // }
  };

  suspendPlaying = async (): Promise<void> => {
    this.audioElement.muted = true;
    // FIXME Not sure if this works well
    // if (this.currentState() === 'running') {
    //   return this.audioCtx.suspend();
    // }
  };

  stopPlaying = async (): Promise<void> => {
    if (this.currentState() === 'running') {
      if (this.currentSource && 'stop' in this.currentSource) {
        this.currentSource.stop();
        if (this.currentSource.onended) {
          // Because this is set by startPlaying();
          (this.currentSource.onended as () => void)();
        }
      }
      await this.suspendPlaying();
      this.removeCurrentSource();
    }
  };

  playAudioNode = async (node: AudioScheduledSourceNode | AudioNode): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        this.setSource(node);
        const resumePlayingPromise = this.resumePlaying();
        if ('start' in node) {
          node.start();
          node.onended = (): void => {
            node.onended = null;
            resolve();
          };
          resumePlayingPromise.catch(reject);
        } else {
          resumePlayingPromise.then(resolve).catch(reject);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  createOscillator = (options?: OscillatorOptions): OscillatorNode => {
    return new OscillatorNode(this.audioCtx, options);
  };
}
