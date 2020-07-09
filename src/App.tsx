import React, { useRef } from 'react';

import getMediaService from './services/media';

import './App.css';
import { ChromiumMediaService } from './services/media/chromium-media-service';

function App() {
  const oscillatorRef = useRef<OscillatorNode>();
  const mediaServiceRef = useRef<ChromiumMediaService>();

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => {
          if (!mediaServiceRef.current) {
            mediaServiceRef.current = getMediaService();
          }

          const mediaService = mediaServiceRef.current;

          if (oscillatorRef.current) {
            mediaService.stopPlaying().catch(console.error);
            oscillatorRef.current = undefined;
          } else {
            const oscillator = oscillatorRef.current = mediaService.createOscillator({
              frequency: 880,
            });
            mediaService.playAudioNode(oscillator).catch(console.error);
          }
        }}>Here</button>
      </header>
    </div>
  );
}

export default App;
