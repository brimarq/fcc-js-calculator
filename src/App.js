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
  { id: "multiply", face: "×", value: "*", group: "operator" },
  { id: "divide", face: "÷", value: "/", group: "operator" },
  { id: "add", face: "+", value: "+", group: "operator" },
  { id: "subtract", face: "−", value: "-", group: "operator" },
  { id: "seven", face: "7", value: "7", group: "number" },
  { id: "eight", face: "8", value: "8", group: "number" },
  { id: "nine", face: "9", value: "9", group: "number" },
  { id: "clear", face: "AC", value: "AC", group: "clr-eql" },
  { id: "four", face: "4", value: "4", group: "number" },
  { id: "five", face: "5", value: "5", group: "number" },
  { id: "six", face: "6", value: "6", group: "number" },
  { id: "one", face: "1", value: "1", group: "number" },
  { id: "two", face: "2", value: "2", group: "number" },
  { id: "three", face: "3", value: "3", group: "number" },
  { id: "equals", face: "=", value: "=", group: "clr-eql" },
  { id: "zero", face: "0", value: "0", group: "number" },
  { id: "decimal", face: ".", value: ".", group: "number" }
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
    this.props.collectInput(this.props.id, this.props.value, this.props.group);
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
      input: [],
      operator: "",
      lastKeyGrpClicked: ""
    };
    this.setDisplay = this.setDisplay.bind(this);
    this.collectInput = this.collectInput.bind(this);
    this.calculateInput = this.calculateInput.bind(this);
  }

  setDisplay(str) {
    this.setState(() => ({display: str}));
  }

  calculateInput(input, operator) {
    const reducer = {
      'multiply': (accumulator, currentValue) => accumulator * currentValue, 
      'divide': (accumulator, currentValue) => accumulator / currentValue, 
      'add': (accumulator, currentValue) => accumulator + currentValue, 
      'subtract': (accumulator, currentValue) => accumulator - currentValue,
    };
    let result = input.reduce(reducer[operator]);
  }

  collectInput(keyId, keyVal, keyGrp) {

    // const inputSwitch = (keyInput) => ({
    //   'AC': this.setState(() => ({ display: "0", input: "" })),
    //   '.'
    // });

    if (keyGrp === "number") {
      // return early to prevent multiple zeroes at beginning of numbers (US#10)
      if (keyId === "zero" && this.state.display === "0") return;
      // return early if number already contains a decimal point (US#11)
      if (keyId === "decimal" && this.state.display.includes(keyVal)) return;

      // Operator last clicked before this? Replace display with new input character, prefixing with "0" if decimal
      if (this.state.lastKeyGrpClicked === "operator") {
        this.setState(() => ({
          display: keyId !== "decimal" ? keyVal : "0" + keyVal, 
          lastKeyGrpClicked: keyGrp
        }));
      }
      else {
        this.setState((prevState) => ({
          // Allow decimal points to concatenate initial zero on display instead of replacing it, otherwise concat new characters.
          display: prevState.display === "0" && keyId !== "decimal" ? keyVal : prevState.display.concat(keyVal), 
          lastKeyGrpClicked: keyGrp
        })); 
      }
    }

    else if (keyGrp === "operator") {
      // Consecutive operator key clicks? Just update the operator state.
      if (this.state.lastKeyGrpClicked === "operator") {
        this.setState(() => ({
          operator: keyId, 
        }));
      }
      else {
        
        this.setState((prevState) => ({ 
          input: prevState.input.concat([ Number(prevState.display) ]),
          operator: keyId, 
          lastKeyGrpClicked: keyGrp, 
        }));
      }

      // // No pervious operator set? Set it and update input state. 
      // if (!this.state.operator) {
      //   this.setState((prevState) => ({ 
      //     input: prevState.input.concat([prevState.display]),
      //     operator: keyId, 
      //     lastKeyGrpClicked: keyGrp
      //   }));
      // }
      // // Operator already chosen. 
      // else {
      //   // Input state array not full? Just update the operator state. 
      //   if (this.state.input.length < 2) {
      //     this.setState(() => ({
      //       operator: keyId, 
      //       lastKeyGrpClicked: keyGrp
      //     }));
      //   }
      //   // Input state is full (=== 2). Calculate and display result.
      //   else {
      //     return;
      //   }
      // }
    }

    else {
      if (keyId === "clear") {
        this.setState(() => ({ display: "0", input: [], operator: "", lastKeyGrpClicked: keyGrp }));
      }
      else {
        console.log("Equals key pressed.");
      }
    }

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
              group={calcKey.group}
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
