import React from 'react';
import './CalcKey.css';

interface CalcKeyProps {
  id: string;
  value: string;
  group: string;
  handleInput(id: string, value: string, group: string): void;
}

function CalcKey({ id, value, group, handleInput }: CalcKeyProps) {
  function handleClick() {
    handleInput(id, value, group);
  }

  return (
    <button
      type="button"
      id={id}
      className="calckey"
      value={value}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default CalcKey;
