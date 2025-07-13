import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";
import demoAudio from "./assets/demo.mp3";
import PlayerControls from "./components/PlayerControls";
import EffectController from "./components/EffectController";
import Equalizer from "./components/Equalizer";

/**
 * The main application component for the dynamic audio studio. It sets up
 * audio processing using the Tone.js library and provides controls for
 * playback and real-time audio effects adjustments. This component manages
 * state for audio playback, pitch shifting, reverb, equalization, and more.
 * It initializes audio components and handles user interactions through
 * various effect controllers and player controls.
 */

export default function App() {
  // References
  const playerRef = useRef(null);
  const pitchShiftRef = useRef(null);
  const reverbRef = useRef(null);
  const eq3Ref = useRef(null);
  
  // States
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [reverbDecay, setReverbDecay] = useState(1.5);
  const [eq, setEq] = useState({ low: 0, mid: 0, high: 0 });
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const animationFrameRef = useRef(null);

  // Initialize audio effects
  useEffect(() => {
    async function setup() {
      await Tone.start();

      const player = new Tone.Player(demoAudio, () => {
        setIsReady(true);
        setDuration(player.buffer.duration);
      });

      const pitchShift = new Tone.PitchShift(pitch);
      const reverb = new Tone.Reverb(reverbDecay);
      await reverb.generate();

      const eq3 = new Tone.EQ3(eq.low, eq.mid, eq.high);

      player.chain(pitchShift, reverb, eq3, Tone.Destination);

      playerRef.current = player;
      pitchShiftRef.current = pitchShift;
      reverbRef.current = reverb;
      eq3Ref.current = eq3;
    }
    
    setup();

    return () => {
      playerRef.current?.dispose();
      pitchShiftRef.current?.dispose();
      reverbRef.current?.dispose();
      eq3Ref.current?.dispose();
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Update position during playback
  useEffect(() => {
    const updatePosition = () => {
      if (playerRef.current && playerRef.current.state === "started" && !isSeeking) {
        setPosition(playerRef.current.position);
      }
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(updatePosition);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isSeeking]);

  // Update effects
  useEffect(() => {
    if (pitchShiftRef.current) pitchShiftRef.current.pitch = pitch;
  }, [pitch]);

  useEffect(() => {
    if (reverbRef.current) {
      reverbRef.current.decay = reverbDecay;
      reverbRef.current.generate();
    }
  }, [reverbDecay]);

  useEffect(() => {
    if (eq3Ref.current) {
      eq3Ref.current.low.value = eq.low;
      eq3Ref.current.mid.value = eq.mid;
      eq3Ref.current.high.value = eq.high;
    }
  }, [eq]);

  // Handlers
  const togglePlay = () => {
    if (!playerRef.current) return;

    if (!isPlaying) {
      playerRef.current.playbackRate = playbackRate;
      playerRef.current.start();
      setIsPlaying(true);
    } else {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handlePlaybackRateChange = (value) => {
    setPlaybackRate(value);
    if (playerRef.current) playerRef.current.playbackRate = value;
  };

  const handlePitchChange = (value) => setPitch(value);
  const handleReverbChange = (value) => setReverbDecay(value);
  const handleEqChange = (band, value) => {
    setEq((prev) => ({ ...prev, [band]: parseInt(value) }));
  };

  // Progress bar handling
  const handleSeek = (value) => {
    setPosition(value);
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    if (playerRef.current) {
      playerRef.current.seek(position);
    }
  };

  // Functions for dynamic labels
  const getPlaybackRateName = () => {
    if (playbackRate < 0.8) return "Slow";
    if (playbackRate > 1.2) return "Fast";
    return "Normal";
  };

  const getPitchName = () => {
    if (pitch === 0) return "Original";
    if (pitch > 0) return `+${pitch} semitones (higher)`;
    return `${pitch} semitones (lower)`;
  };

  const getReverbName = () => {
    if (reverbDecay < 0.5) return "Dry";
    if (reverbDecay < 1.5) return "Medium Room";
    if (reverbDecay < 3) return "Large Hall";
    return "Cathedral";
  };

  const getEqName = (band) => {
    const value = eq[band];
    if (value === 0) return "Neutral";
    if (value > 0) return `Boost +${value}dB`;
    return `Cut ${Math.abs(value)}dB`;
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🎛️ Dynamic Audio Studio</h1>
        <p className="app-subtitle">Experiment in real-time with audio effects</p>
      </div>

      <div className="control-panel">
        <PlayerControls 
          isReady={isReady}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          duration={duration}
          position={position}
          onSeek={handleSeek}
          onSeekStart={handleSeekStart}
          onSeekEnd={handleSeekEnd}
        />

        <EffectController
          label="Playback Speed"
          dynamicValue={getPlaybackRateName()}
          numericValue={`${playbackRate.toFixed(1)}x`}
          min={0.5}
          max={2}
          step={0.1}
          value={playbackRate}
          onChange={handlePlaybackRateChange}
          disabled={!isReady}
        />

        <EffectController
          label="Pitch Shift"
          dynamicValue={getPitchName()}
          numericValue={`${pitch} semitones`}
          min={-12}
          max={12}
          step={1}
          value={pitch}
          onChange={handlePitchChange}
          disabled={!isReady}
        />

        <EffectController
          label="Reverb"
          dynamicValue={getReverbName()}
          numericValue={`${reverbDecay}s`}
          min={0}
          max={5}
          step={0.1}
          value={reverbDecay}
          onChange={handleReverbChange}
          disabled={!isReady}
        />

        <Equalizer 
          eq={eq}
          onEqChange={handleEqChange}
          getEqName={getEqName}
          isReady={isReady}
        />
      </div>

      <style jsx>{`
        :root {
          --primary-color: #6c5ce7;
          --secondary-color: #a29bfe;
          --dark-color: #2d3436;
          --light-color: #f5f6fa;
          --success-color: #00b894;
        }
        
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: var(--dark-color);
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .app-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .app-header h1 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 2.2rem;
        }
        
        .app-subtitle {
          color: #636e72;
          font-size: 1rem;
          margin-top: 0;
        }
        
        .control-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
}