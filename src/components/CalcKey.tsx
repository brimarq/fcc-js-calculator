import React from 'react';
import './CalcKey.css';

interface CalcKeyProps {
  id: string;
  value: string;
  group: string;
  handleClick(id: string, value: string, group: string): void;
}

function CalcKey({ id, value, group, handleClick }: CalcKeyProps) {
  return (
    <button
      type="button"
      id={id}
      className="calckey"
      value={value}
      onClick={() => handleClick(id, value, group)}
    >
      {value}
    </button>
  );
}

export default CalcKey;
