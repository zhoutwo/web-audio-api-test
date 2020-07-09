import { ChromiumMediaService } from './chromium-media-service';

export default () => new ChromiumMediaService(
    new AudioContext({
      latencyHint: 0, // Request lowest latency possible
    }),
    new Audio(),
);
