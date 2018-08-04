import React, { Component } from 'react';
import './App.css';

// ÷
// DIVISION SIGN
// Unicode: U+00F7, UTF-8: C3 B7

// ×
// MULTIPLICATION SIGN
// Unicode: U+00D7, UTF-8: C3 97

// −
// MINUS SIGN
// Unicode: U+2212, UTF-8: E2 88 92

const calcKeys = [
  { id: "multiply", face: "×", value: "*" },
  { id: "divide", face: "÷", value: "/" },
  { id: "add", face: "+", value: "+" },
  { id: "subtract", face: "−", value: "-" },
  { id: "seven", face: "7", value: "7" },
  { id: "eight", face: "8", value: "8" },
  { id: "nine", face: "9", value: "9" },
  { id: "clear", face: "AC", value: "?" },
  { id: "four", face: "4", value: "4" },
  { id: "five", face: "5", value: "5" },
  { id: "six", face: "6", value: "6" },
  { id: "one", face: "1", value: "1" },
  { id: "two", face: "2", value: "2" },
  { id: "three", face: "3", value: "3" },
  { id: "equals", face: "=", value: "=" },
  { id: "zero", face: "0", value: "0" },
  { id: "decimal", face: ".", value: "." }
]

class CalcKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calcKeyClassName: this.props.defaultClassName,
    }
    this.handleClick = this.handleClick.bind(this);
    this.setCalcKeyClassName = this.setCalcKeyClassName.bind(this);
  }

  setCalcKeyClassName(str) {
    this.setState(() => ({calcKeyClassName: str}));
  }
  
  handleClick() {
    this.setCalcKeyClassName(this.props.clickedClassName);
    setTimeout(this.setCalcKeyClassName, 80, this.props.defaultClassName);
    this.props.collectInput(this.props.value);
  }

  render() {
    return (
      <div id={this.props.id} className={this.state.calcKeyClassName} onClick={this.handleClick}>{this.props.face}</div>
    );
  }

}


class Display extends Component {
  render() {
    return (
      <div id="display">{this.props.display}</div>
    );
  }
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      input: "",
    };
    this.setDisplay = this.setDisplay.bind(this);
    this.collectInput = this.collectInput.bind(this);
  }

  setDisplay(str) {
    this.setState(() => ({display: str}));
  }

  collectInput(str) {
    this.setState((prevState) => ({input: prevState.input.concat(str)}));
  }

  render() {
    return (
      <div id="calculator">

        <Display 
          display={this.state.display} 
        />
        <div id="keypad">
          { calcKeys.map(calcKey => (
            <CalcKey 
              key={calcKey.id} 
              id={calcKey.id} 
              face={calcKey.face} 
              value={calcKey.value} 
              defaultClassName="calckey"
              clickedClassName="calckey calckey-clicked" 
              setDisplay={this.setDisplay} 
              collectInput={this.collectInput} 
            />
          ))}
        </div>
        

      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">Header</header>
        <main className="App-main">
          <Calculator />
        </main>
        <footer className="App-footer">Footer</footer>
      </div>
    );
  }
}

export default App;
