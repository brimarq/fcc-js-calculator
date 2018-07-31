import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">Header</header>
        <main className="App-main">

          <div id="calculator">

            <div id="display">display</div>
            <div id="multiply" className="calckey operator">x</div>
            <div id="divide" className="calckey operator">/</div>
            <div id="add" className="calckey operator">+</div>
            <div id="subtract" className="calckey operator">-</div>
            <div id="seven" className="calckey num">7</div>
            <div id="eight" className="calckey num">8</div>
            <div id="nine" className="calckey num">9</div>
            <div id="clear" className="calckey clear">AC</div>
            <div id="four" className="calckey num">4</div>
            <div id="five" className="calckey num">5</div>
            <div id="six" className="calckey num">6</div>
            <div id="one" className="calckey num">1</div>
            <div id="two" className="calckey num">2</div>
            <div id="three" className="calckey num">3</div>
            <div id="equals" className="calckey equals">=</div>
            <div id="zero" className="calckey num">0</div>
            <div id="decimal" className="calckey num">.</div>

          </div>
        </main>
        <footer className="App-footer">Footer</footer>
      </div>
    );
  }
}

export default App;
