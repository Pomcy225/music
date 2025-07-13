import React from 'react';

/**
 * A component for controlling an audio player, with a play button and
 * real-time tracking progress bar.
 *
 * @param {object} props
 * @param {boolean} props.isReady - Whether the component is ready to be
 *   interacted with.
 * @param {boolean} props.isPlaying - Whether the audio is currently playing.
 * @param {function} props.togglePlay - A function to call when the play button
 *   is clicked.
 * @param {number} props.duration - The total duration of the audio in seconds.
 * @param {number} props.position - The current position of the audio in seconds.
 * @param {function} props.onSeek - A function to call when the user seeks to a
 *   new position with the progress bar.
 * @param {function} props.onSeekStart - A function to call when the user starts
 *   seeking with the progress bar.
 * @param {function} props.onSeekEnd - A function to call when the user stops
 *   seeking with the progress bar.
 * @return {React.Component} A React component for an audio player control.
 */
const PlayerControls = ({
  isReady,
  isPlaying,
  togglePlay,
  duration,
  position,
  onSeek,
  onSeekStart,
  onSeekEnd
}) => {
  // Format time for display
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="player-controls">
      <button
        onClick={togglePlay}
        disabled={!isReady}
        className={`play-button ${isPlaying ? 'playing' : ''}`}
      >
        {isPlaying ? (
          <>
            <span className="icon">⏸</span> Pause
          </>
        ) : (
          <>
            <span className="icon">▶️</span> Play
          </>
        )}
      </button>

      {/* Progress bar with real-time tracking */}
      <div className="progress-group">
        <div className="progress-info">
          <span className="time-display">{formatTime(position)}</span>
          <span className="time-display">{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 100}
          step="0.01"
          value={position}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          onMouseDown={onSeekStart}
          onMouseUp={onSeekEnd}
          onTouchStart={onSeekStart}
          onTouchEnd={onSeekEnd}
          disabled={!isReady}
          className="progress-slider"
        />
      </div>

      <style jsx>{`
        .player-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .play-button {
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 1.1rem;
          border-radius: 50px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(108, 92, 231, 0.3);
        }
        
        .play-button:hover:not(:disabled) {
          background-color: #5649d1;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(108, 92, 231, 0.4);
        }
        
        .play-button:disabled {
          background-color: #b2bec3;
          cursor: not-allowed;
        }
        
        .play-button.playing {
          background-color: var(--success-color);
          box-shadow: 0 4px 6px rgba(0, 184, 148, 0.3);
        }
        
        .play-button.playing:hover {
          background-color: #00a383;
          box-shadow: 0 6px 8px rgba(0, 184, 148, 0.4);
        }
        
        .icon {
          font-size: 1.2rem;
        }
        
        /* Progress bar styles */
        .progress-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 10px;
        }
        
        .progress-info {
          display: flex;
          justify-content: space-between;
        }
        
        .time-display {
          font-size: 0.9rem;
          color: #636e72;
          font-weight: 500;
        }
        
        .progress-slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #dfe6e9;
          outline: none;
          -webkit-appearance: none;
          transition: all 0.2s;
        }
        
        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .progress-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          background: #5649d1;
        }
        
        .progress-slider:disabled::-webkit-slider-thumb {
          background: #b2bec3;
        }
      `}</style>
    </div>
  );
};

export default PlayerControls;