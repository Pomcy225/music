import React from 'react';

/**
 * A component for controlling a single audio effect.
 *
 * @param {object} props
 * @param {string} props.label - The label to display above the slider.
 * @param {string} props.dynamicValue - The value to display next to the label.
 * @param {string} props.numericValue - The value to display below the slider.
 * @param {number} props.min - The minimum value for the slider.
 * @param {number} props.max - The maximum value for the slider.
 * @param {number} props.step - The step value for the slider.
 * @param {number} props.value - The current value of the slider.
 * @param {function} props.onChange - A function to call when the slider value changes.
 * @param {boolean} props.disabled - Whether the slider is disabled.
 * @param {string} [props.className=''] - An optional class name to apply to the component.
 */
const EffectController = ({
  label,
  dynamicValue,
  numericValue,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
  className = ''
}) => {
  return (
    <div className={`control-group ${className}`}>
      <div className="control-header">
        <label>{label}</label>
        <span className="dynamic-value">{dynamicValue}</span>
      </div>
      <span className="numeric-value">{numericValue}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="slider"
      />
      
      <style jsx>{`
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .control-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        
        .control-header label {
          font-weight: 600;
          color: var(--dark-color);
        }
        
        .dynamic-value {
          font-size: 0.9rem;
          color: var(--primary-color);
          font-weight: 500;
          background: rgba(108, 92, 231, 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
        }
        
        .numeric-value {
          font-size: 0.8rem;
          color: #636e72;
          text-align: right;
          margin-bottom: 0.3rem;
        }
        
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #dfe6e9;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .slider:hover {
          opacity: 1;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--primary-color);
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          background: #5649d1;
        }
      `}</style>
    </div>
  );
};

export default EffectController;