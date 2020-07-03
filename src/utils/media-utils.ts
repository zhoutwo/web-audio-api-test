import { ACQUIRE_PERMISSION_RETRIES } from '../env-and-consts';

export const acquireAudioInputStream = async (deviceId: string): Promise<MediaStream> => {
  const constraint: MediaStreamConstraints = {
    audio: {
      deviceId,
      sampleRate: 44100,
      channelCount: 1,
    },
  };

  for (let attemptCount = 0; attemptCount < ACQUIRE_PERMISSION_RETRIES; attemptCount++) {
    try {
      // askForMediaAccess() is only for macOS
      const microphoneApproved = true;
      if (microphoneApproved) {
        return await navigator.mediaDevices.getUserMedia(constraint);
      } else {
        // noinspection ExceptionCaughtLocallyJS as this was intentional
        throw new Error('Entire app was not given microphone access');
      }
    } catch (e) {
      console.warn('Microphone access failed to acquire', e);
      alert(
        `We need to record audio in order to proceed${
          attemptCount < ACQUIRE_PERMISSION_RETRIES - 1 ? ", let's try again." : '!'
        }`,
      );
    }
  }

  throw new Error('Failed to obtain microphone stream');
};
