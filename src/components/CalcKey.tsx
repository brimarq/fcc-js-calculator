import React from 'react';
import './CalcKey.css';

interface CalcKeyProps {
  id: string;
  value: string;
  handleClick(e: React.MouseEvent): void;
}

function CalcKey({ id, value, handleClick }: CalcKeyProps) {
  return (
    <button
      type="button"
      id={id}
      className="calckey"
      value={value}
      onClick={e => handleClick(e)}
    >
      {value}
    </button>
  );
}

export default CalcKey;
