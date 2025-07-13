import React from 'react';
import EffectController from './EffectController';

/**
 * A component for a 3-band equalizer.
 *
 * @param {object} eq - An object with low, mid, and high properties for the
 *   values of the three EQ bands.
 * @param {function} onEqChange - A function that takes a band name and a value
 *   to apply to that band.
 * @param {function} getEqName - A function that takes a band name and returns a
 *   string label for that band.
 * @param {boolean} isReady - A boolean indicating whether the component is
 *   ready to be interacted with.
 *
 * @return {React.Component} A React component for a 3-band equalizer.
 */
const Equalizer = ({ eq, onEqChange, getEqName, isReady }) => {
  return (
    <div className="eq-section">
      <h3 className="eq-title">3-Band Equalizer</h3>
      
      <div className="eq-band">
        <EffectController
          label="Bass"
          dynamicValue={getEqName("low")}
          numericValue={`${eq.low}dB`}
          min={-30}
          max={30}
          value={eq.low}
          onChange={(value) => onEqChange("low", value)}
          disabled={!isReady}
          className="eq-low"
        />
      </div>
      
      <div className="eq-band">
        <EffectController
          label="Mid"
          dynamicValue={getEqName("mid")}
          numericValue={`${eq.mid}dB`}
          min={-30}
          max={30}
          value={eq.mid}
          onChange={(value) => onEqChange("mid", value)}
          disabled={!isReady}
          className="eq-mid"
        />
      </div>
      
      <div className="eq-band">
        <EffectController
          label="Treble"
          dynamicValue={getEqName("high")}
          numericValue={`${eq.high}dB`}
          min={-30}
          max={30}
          value={eq.high}
          onChange={(value) => onEqChange("high", value)}
          disabled={!isReady}
          className="eq-high"
        />
      </div>
      
      <style jsx>{`
        .eq-section {
          background-color: #f8f9fa;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 1rem;
        }
        
        .eq-title {
          color: var(--primary-color);
          margin-top: 0;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.3rem;
        }
        
        .eq-band {
          margin-bottom: 1.2rem;
        }
        
        .eq-band:last-child {
          margin-bottom: 0;
        }
        
        .eq-low :global(.slider::-webkit-slider-thumb) {
          background: #0984e3;
        }
        
        .eq-mid :global(.slider::-webkit-slider-thumb) {
          background: #00b894;
        }
        
        .eq-high :global(.slider::-webkit-slider-thumb) {
          background: #e84393;
        }
      `}</style>
    </div>
  );
};

export default Equalizer;