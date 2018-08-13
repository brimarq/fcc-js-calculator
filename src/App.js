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

const defaultCalculatorState = {
  display: "0",
  inputBuffer: [],
  lastInput: 0,
  lastOperator: "",
  isLastKeyEquals: false,
  isLastKeyOperator: false,
  operands: [],
};

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
    this.props.handleInput(this.props.id, this.props.value, this.props.group);
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
    this.state = defaultCalculatorState;
    this.setDisplay = this.setDisplay.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  setDisplay(str) {
    this.setState(() => ({display: str}));
  }

  handleInput(keyId, keyVal, keyGrp) {

    // CALLBACK FUNC TO CALCULATE INPUTS AFTER SETSTATE
    const calcInput = () => {
      // Capture the operands array and operator. 
      let operands = this.state.operands;
      let operator = this.state.lastOperator; 
      let result;
    
      const doCalc = (operandArr, operator) => {
        const reducer = {
          'multiply': (accumulator, currentValue) => accumulator * currentValue, 
          'divide': (accumulator, currentValue) => accumulator / currentValue, 
          'add': (accumulator, currentValue) => accumulator + currentValue, 
          'subtract': (accumulator, currentValue) => accumulator - currentValue,
        };
        return operandArr.reduce(reducer[operator]);
      };
    
      // If the operands array length < 2 
      if (operands.length < 2) {
        // Equals key pressed? Return early.
        if (keyId === "equals") {
          return;
        }
        // Operator key? Merely set the operator.
        else {
          this.setState({
            lastOperator: keyId,
          });
        }
      }
      else {
        // Abort operation if division by 0 and display error.
        if (operator === "divide" && operands[1] === 0) {
          console.log("Error: No division by 0. Operation aborted.");
          this.setState({
            display: "Err: n / 0",
            operands: [],
            lastOperator: ""
          });
        }
        else {
          // Keep the operator on equals keypress, otherwise set to operator keyId
          let nextOperator = keyId === "equals" ? operator : keyId;
          result = doCalc(operands, operator);
          this.setState({
            display: result.toString(),
            operands: [result],
            lastOperator: nextOperator,
          });
        }
      }
    }; // END calcInput function

    // HANDLE CLEAR KEY //
    if (keyId === "clear") {
      this.setState(defaultCalculatorState);
    } 
    
    // HANDLE NUMBER KEYS //
    else if (keyGrp === "number") {
      let inputVal = keyVal;
      // Boolean test for inputBuffer option in setState that prevents leading zeroes on integers
      let isBufferOnlyZeroAndInputIsInt = this.state.inputBuffer.length === 1 && this.state.inputBuffer[0] === "0" && /[\d]/g.test(inputVal);
      
      // Callback function to update display after setState
      const updateDisplay = () => {
        let numStr = this.state.inputBuffer.join('');
        this.setState({display: numStr});
      }

      // Limit the number of characters in the buffer
      if (this.state.inputBuffer.length > 24) return;

      // Decimal key options
      if (keyId === "decimal") {
        // Return early if number already contains a decimal point (US#11)
        if (this.state.inputBuffer.includes(keyVal)) return;
        // Prefix initial decimals with a "0"
        if (this.state.inputBuffer.length === 0) {
          inputVal = ["0", keyVal];
        }
      }

      this.setState((prevState) => ({
          inputBuffer: isBufferOnlyZeroAndInputIsInt ? [].concat(inputVal) : prevState.inputBuffer.concat(inputVal),
          isLastKeyEquals: false,
          isLastKeyOperator: false,
        }),
        () => updateDisplay()
      );
    }

    // HANDLE OPERATOR KEY INPUTS //
    else if (keyGrp === "operator") {
      // Save the inputBuffer as a number
      let numFromBuffer = Number(this.state.inputBuffer.join(''));
      // Consecutive operator key clicks or operator following equals key? Just update the operator state.
      if (this.state.isLastKeyOperator || this.state.isLastKeyEquals) {
        this.setState({ lastOperator: keyId, isLastKeyEquals: false, isLastKeyOperator: true });
      }
      else {
        this.setState((prevState) => ({ 
          inputBuffer: [],
          lastInput: numFromBuffer,
          // lastOperator: keyId, // moved this into the callback
          isLastKeyEquals: false,
          isLastKeyOperator: true,
          operands: prevState.operands.concat(numFromBuffer)
          }),
          () => calcInput()
        );
      }
    } 

    // HANDLER FOR EQUALS KEY //
    else {
      console.log("Equals key pressed.");
      // No previous operator set? Return early.
      if (!this.state.lastOperator) return;
      // Save the inputBuffer as a number. Consecutive equals keys recycle lastInput instead, as inputBuffer is cleared after each keypress.
      let numFromBuffer = this.state.isLastKeyEquals ? this.state.lastInput : Number(this.state.inputBuffer.join(''));

      this.setState((prevState) => ({ 
        inputBuffer: [],
        isLastKeyEquals: true,
        isLastKeyOperator: false,
        lastInput: numFromBuffer,
        // lastOperator: keyId, 
        operands: prevState.operands.concat(numFromBuffer)
        }),
        () => calcInput()
      );
    } 
  } // END handleInput()

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
              handleInput={this.handleInput} 
            />
          ))}
        </div>
      </div>
    );
  } // END render()
} // END Calculator class

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
