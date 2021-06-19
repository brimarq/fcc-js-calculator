import React from 'react';
import './CalcKey.css';

interface CalcKeyProps {
  id: string;
  value: string;
  // group: string;
  // handleClick(id: string, value: string, group: string): void;
  handleClick(e: React.MouseEvent): void;
}

function CalcKey({ id, value, handleClick }: CalcKeyProps) {
  return (
    <button
      type="button"
      id={id}
      className="calckey"
      value={value}
      // onClick={() => handleClick(id, value, group)}
      onClick={e => handleClick(e)}
    >
      {value}
    </button>
  );
}

export default CalcKey;
