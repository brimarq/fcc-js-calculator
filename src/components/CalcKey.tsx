import React from 'react';
import './CalcKey.css';

interface CalcKeyProps {
  id: string;
  value: string;
  group: string;
  defaultClassName: string;
  clickedClassName: string;
  handleInput(id: string, value: string, group: string): void;
}

function CalcKey({
  id,
  value,
  group,
  defaultClassName,
  clickedClassName,
  handleInput,
}: CalcKeyProps) {
  const [calcKeyClassName, setCalcKeyClassName] =
    React.useState(defaultClassName);

  function handleClick() {
    setCalcKeyClassName(clickedClassName);
    setTimeout(setCalcKeyClassName, 50, defaultClassName);
    handleInput(id, value, group);
  }

  return (
    <button
      type="button"
      id={id}
      className={calcKeyClassName}
      value={value}
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default CalcKey;
