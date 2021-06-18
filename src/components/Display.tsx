import React from 'react';
import './Display.css';

// class Display extends React.PureComponent<{ display: string }> {
//   render() {
//     return <div id="display">{this.props.display}</div>;
//   }
// }

function Display({ display }: { display: string }) {
  return <div id="display">{display}</div>;
}

export default Display;
