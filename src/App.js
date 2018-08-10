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
      inputLog: [],
      lastInput: 0,
      lastOperator: "",
      lastKeyGrp: "",
      subtotal: null,
    };
    this.setDisplay = this.setDisplay.bind(this);
    this.collectInput = this.collectInput.bind(this);
  }

  setDisplay(str) {
    this.setState(() => ({display: str}));
  }

  collectInput(keyId, keyVal, keyGrp) {
    let inputVal;

    const calculate = (operand1, operand2, operator) => {
      let result;
      const reducer = {
        'multiply': (accumulator, currentValue) => accumulator * currentValue, 
        'divide': (accumulator, currentValue) => accumulator / currentValue, 
        'add': (accumulator, currentValue) => accumulator + currentValue, 
        'subtract': (accumulator, currentValue) => accumulator - currentValue,
      };
      if (operator === "divide" && operand2 === 0) {
        result = "err";
      }
      else {
        result = [operand1, operand2].reduce(reducer[operator]);
      }
      return result;
    };

    const calculateInput = () => {
      let operand1, operand2, operator, nextOperator;
      if (this.state.input.length < 4) {
        return;
      }
      else {
        if (keyGrp === "operator") {
          operand1 = this.state.input[0];
          operator = this.state.input[1];
          operand2 = this.state.input[2];
          nextOperator = this.state.input[3];
        }
        else {
          operand1 = this.state.input[0];
          operator = this.state.input[1];
          operand2 = this.state.input[2];
          nextOperator = this.state.lastOperator;
        }

        this.setState({
          display: calculate(operand1, operand2, operator).toString(),
          input: [calculate(operand1, operand2, operator), nextOperator],
          lastInput: operand2
        });
      }

    };

    if (keyGrp === "number") {

      // return early to prevent multiple zeroes at beginning of numbers (US#10)
      if (keyId === "zero" && this.state.display === "0") return; 
      if (keyId === "decimal") {
        // return early if number already contains a decimal point (US#11)
        if (this.state.lastKeyGrp === "number" && this.state.display.includes(keyVal)) {
          return;
        }
        // if display shows "0" or this click happens after an operator key is pressed, the decimal is prefixed with a "0"
        else if (this.state.display === "0" || this.state.lastKeyGrp === "operator") {
          inputVal = "0" + keyVal;
        }
        // otherwise, input just the decimal
        else {
          inputVal = keyVal;
        }
      }
      // for the actual numbers, just input the value
      else {
        inputVal = keyVal;
      }

      this.setState((prevState) => ({
        // if display reads "0" or this click is after an operator, replace display content, otherwise concat.
        display: prevState.display === "0" || prevState.lastKeyGrp === "operator" ? inputVal : prevState.display.concat(inputVal), 
        // input: prevState.input.length === "0" ? prevState.input.concat(inputVal) : prevState.input.push(inputVal), 
        lastKeyGrp: keyGrp,
        })
      );
    }

    else if (keyGrp === "operator") {
      
      // Consecutive operator key clicks? Just update the operator state.
      if (this.state.lastKeyGrp === "operator") {
        this.setState({ lastOperator: keyId });
      }
      else {
        
        this.setState((prevState) => ({ 
          // display: calculateInput([ operand1, operand2 ], operator).toString(),
          input: prevState.input.concat([Number(prevState.display), keyId]),
          inputLog: prevState.inputLog.concat([Number(prevState.display), keyId]),
          lastInput: Number(prevState.display),
          lastOperator: keyId, 
          lastKeyGrp: keyGrp, 
          // subtotal: calculateInput([ operand1, operand2 ], operator)
          }),
          () => calculateInput()
        );
      }
    }

    else {
      if (keyId === "clear") {
        this.setState(() => ({ display: "0", input: [], inputLog: [], lastInput: 0, lastOperator: "", lastKeyGrp: keyGrp, subtotal: null }));
      }
      else {
        console.log("Equals key pressed.");

        this.setState((prevState) => ({
          input: prevState.input.concat([Number(prevState.display), prevState.lastOperator]),
          inputLog: prevState.inputLog.concat([Number(prevState.display), prevState.lastOperator]),
          lastInput: Number(prevState.display),
          lastKeyGrp: keyGrp,
          }),
          () => calculateInput()
        );

        // Can this work to update state in two stages with a callback?
        // this.setState((prevState) => ({
        //   // obj literal
        // }), (prevState) => ({
        //   // obj literal
        // }));
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
