import React from 'react';
import './Display.css';

function Display({ display }: { display: string }) {
  return <div id="display">{display}</div>;
}

export default Display;
