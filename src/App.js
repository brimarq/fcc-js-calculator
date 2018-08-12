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
  input: [],
  inputBuffer: [],
  inputLog: [],
  lastInput: 0,
  lastOperator: "",
  lastKeyGrp: "",
  lastKeyId: "",
  isLastKeyEquals: false,
  isLastKeyOperator: false,
  operands: [],
  subtotal: null,
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
    // HANDLE CLEAR KEY //
    if (keyId === "clear") {
      this.setState(defaultCalculatorState);
    } 
    
    // HANDLE NUMBER KEY INPUTS //
    else if (keyGrp === "number") {
      let inputVal = keyVal;
      
      // Callback function to update display after setState
      const updateDisplay = () => {
        let numStr = this.state.inputBuffer.join('');
        this.setState({display: numStr});
      }

      // Limit the number of characters in the buffer
      if (this.state.inputBuffer.length > 24) return;
      // Return early to prevent multiple zeroes at beginning of numbers (US#10)
      // if (keyId === "zero" && this.state.inputBuffer.length === 1 && this.state.inputBuffer[0] === "0") return;
      if (keyId === "decimal") {
        // Return early if number already contains a decimal point (US#11)
        if (this.state.inputBuffer.includes(keyVal)) return;
        // Prefix initial decimals with a "0"
        if (this.state.inputBuffer.length === 0) {
          inputVal = ["0", keyVal];
        }
      }

      // Prevent leading zeroes for integers by replacing inputBuffer
      if (this.state.inputBuffer.length === 1 && this.state.inputBuffer[0] === "0" && /[\d]/g.test(inputVal)) {
        this.setState({
            inputBuffer: [].concat(inputVal),
            isLastKeyEquals: false,
            isLastKeyOperator: false,
            lastKeyGrp: keyGrp
          },
          () => updateDisplay()
        );
      }
      // Otherwise, concat inputBuffer
      else {
        this.setState((prevState) => ({
            inputBuffer: prevState.inputBuffer.concat(inputVal),
            isLastKeyEquals: false,
            isLastKeyOperator: false,
            lastKeyGrp: keyGrp
          }),
          () => updateDisplay()
        );
      }
    }

    // HANDLE OPERATOR KEY INPUTS //
    else if (keyGrp === "operator") {
      // Save the inputBuffer as a number
      let numFromBuffer = Number(this.state.inputBuffer.join(''));
      // Consecutive operator key clicks? Just update the operator state.
      if (this.state.isLastKeyOperator) {
        this.setState({ lastOperator: keyId });
      }
      else {

        const calcInput = () => {
          let operands, operator, result;
          const doCalc = (operandArr, operator) => {
            const reducer = {
              'multiply': (accumulator, currentValue) => accumulator * currentValue, 
              'divide': (accumulator, currentValue) => accumulator / currentValue, 
              'add': (accumulator, currentValue) => accumulator + currentValue, 
              'subtract': (accumulator, currentValue) => accumulator - currentValue,
            };
            return operandArr.reduce(reducer[operator]);
          };
          // Capture the operands here
          operands = this.state.operands;

          // If the operand array length < 2, merely set the operator
          if (operands.length < 2) {
            this.setState({
              lastOperator: keyId,
            });

          }
          else {
            // Capture the operator here
            operator = this.state.lastOperator;
            // Abort operation if division by 0 and display error.
            if (operator === "divide" && operands[1] === 0) {
              console.log("Error: No division by 0. Operation aborted.");
              this.setState({
                // display: operands[0].toString(),
                // operands: [operands[0]],
                display: "Err: n / 0",
                operands: [],
                lastOperator: ""
              });
            }
            else {
              result = doCalc(operands, operator);
              this.setState({
                display: result.toString(),
                operands: [result],
                lastOperator: keyId,
              });
            }
          }

        }; // const = calcInput end

        this.setState((prevState) => ({ 
          inputBuffer: [],
          lastInput: numFromBuffer,
          // lastOperator: keyId, 
          isLastKeyEquals: false,
          isLastKeyOperator: true,
          lastKeyGrp: keyGrp, 
          operands: prevState.operands.concat(numFromBuffer)
          // subtotal: calculateInput([ operand1, operand2 ], operator)
          }),
          () => calcInput()
        );
      }
    } // END HANDLER FOR OPERATOR KEYS

    // HANDLER FOR EQUALS KEY //
    else {
      console.log("Equals key pressed.");
      // No previous operator set? Return early.
      if (!this.state.lastOperator) return;
      // Save the inputBuffer as a number. Consecutive equals keys use lastInput instead, as inputBuffer is cleared.
      let numFromBuffer = this.state.isLastKeyEquals ? this.state.lastInput : Number(this.state.inputBuffer.join(''));
      
      

      const calcInput = () => {
        let operands, operator, result;

        const doCalc = (operandArr, operator) => {
          const reducer = {
            'multiply': (accumulator, currentValue) => accumulator * currentValue, 
            'divide': (accumulator, currentValue) => accumulator / currentValue, 
            'add': (accumulator, currentValue) => accumulator + currentValue, 
            'subtract': (accumulator, currentValue) => accumulator - currentValue,
          };
          return operandArr.reduce(reducer[operator]);
        };

        // Capture the operands here
        operands = this.state.operands;

        // If the operand array length < 2, do nothing.
        if (operands.length < 2) {
          return;
        }
        else {
          // Capture the operator here
          operator = this.state.lastOperator;
          // Abort operation if division by 0 and display error.
          if (operator === "divide" && operands[1] === 0) {
            console.log("Error: No division by 0. Operation aborted.");
            this.setState({
              // display: operands[0].toString(),
              // operands: [operands[0]],
              display: "Err: n / 0",
              operands: [],
              lastOperator: ""
            });
          }
          else {
            result = doCalc(operands, operator);
            this.setState({
              display: result.toString(),
              operands: [result],
              // lastOperator: operator,
            });
          }
        }

      }; // const = calcInput end

      this.setState((prevState) => ({ 
        inputBuffer: [],
        isLastKeyEquals: true,
        isLastKeyOperator: false,
        lastInput: numFromBuffer,
        // lastOperator: keyId, 
        lastKeyGrp: keyGrp, 
        operands: prevState.operands.concat(numFromBuffer)
        // subtotal: calculateInput([ operand1, operand2 ], operator)
        }),
        () => calcInput()
      );

      // this.setState((prevState) => ({
      //   input: prevState.input.concat([Number(prevState.display), prevState.lastOperator]),
      //   inputLog: prevState.inputLog.concat([Number(prevState.display), prevState.lastOperator]),
      //   lastInput: Number(prevState.display),
      //   lastKeyGrp: keyGrp,
      //   }),
      //   () => calculateInput()
      // );

    } // END EQUALS KEY HANDLER
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
