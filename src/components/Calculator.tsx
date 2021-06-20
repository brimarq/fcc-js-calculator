import React from 'react';
import Display from './Display';
import CalcKey from './CalcKey';
import './Calculator.css';

// TODO: REFACTOR CLICK HANDLER AND CALCULATION LOGIC: setState in hooks have no callbacks like their counterpart in class components!
//! Clear button returns calculator to initialized state, shows '0' on display
//! In any order, I should be able to add, subtract, multiply and divide a chain of numbers of any length, and when I hit "=", the correct result should be shown in the element with the id of "display"
//! When inputting numbers, my calculator should not allow a number to begin with multiple zeros.
//! When the decimal element is clicked, a "." should append to the currently displayed value; two "." in one number should not be accepted
//! I should be able to perform any operation (+, -, *, /) on numbers containing decimal points
//! If 2 or more operators are entered consecutively, the operation performed should be the last operator entered (excluding the negative (-) sign.
//! Pressing an operator immediately following "=" should start a new calculation that operates on the result of the previous evaluation
//! My calculator should have several decimal places of precision when it comes to rounding (note that there is no exact standard, but you should be able to handle calculations like "2 / 7" with reasonable precision to at least 4 decimal places)

interface CalculatorState {
  operand1: string;
  operand2: string;
  operator: string;
  result: string;
}

const defaultState: CalculatorState = {
  operand1: '',
  operand2: '',
  operator: '',
  result: '',
};

function Calculator() {
  // const [display, setDisplay] = React.useState('0');
  const [state, setState] = React.useState(defaultState);

  // const display = state.operand2
  //   ? state.operand2
  //   : state.operand1
  //   ? state.operand1
  //   : '0';

  const display = state.result || state.operand2 || state.operand1 || '0';

  // prettier-ignore
  const keyData = [
    ['clear','AC'], ['negate','+/−'], ['percent','%'], ['divide','÷'], 
    ['seven','7'], ['eight','8'], ['nine','9'], ['multiply','×'], 
    ['four','4'], ['five','5'], ['six','6'], ['subtract','−'], 
    ['one','1'], ['two', '2'], ['three','3'], ['add','+'], 
    ['zero', '0'], ['decimal','.'], ['equals','=']
  ];

  function handleClick(e) {
    e.preventDefault();
    const { id, value }: { id: string; value: string } = e.target;

    const currentOperand = state.operator ? 'operand2' : 'operand1';
    let newState = { ...state };

    switch (id) {
      case 'clear':
        newState = defaultState;
        break;
      case 'negate':
        if (state[currentOperand] === '0') return; // forbid '-0'
        newState[currentOperand] =
          state[currentOperand].charAt(0) === '-'
            ? state[currentOperand].slice(1)
            : `-${state[currentOperand]}`;
        break;
      case 'percent':
        newState[currentOperand] = (
          Number(state[currentOperand]) / 100
        ).toString();
        break;
      case 'equals':
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        newState.operator = id;
        break;
      default: {
        // newState = { ...state };
        if (id === 'decimal') {
          // Only one decimal point per operand
          if (state[currentOperand].includes(value)) return;
        } else {
          newState[currentOperand] = state[currentOperand].concat(value);
        }

        // console.log(newState);

        // console.log(newState);
      }
      // Only one decimal point per entry
      // if (id === 'decimal' && input.includes(value)) return;
      // if (input === '-0') {
      // no leading zero for negative values
      // input = `-${value}`;
      // } else {
      //   input = input === '0' && value !== '.' ? value : input.concat(value);
      // }

      // if (!input) {
      //   // setInputBuffer(inputBuffer.concat(input));
      // }
    }

    console.log(newState);
    setState(newState);
  }

  return (
    <div id="calculator">
      <Display display={display} />
      <div id="calcLabel">
        <span id="calcLabelLeft">FCC FEL-P4</span>
        <span id="calcLabelRight">JS-CALCULATOR</span>
      </div>
      <div id="keypad">
        {keyData.map(data => {
          const [id, value] = data;
          return (
            <CalcKey key={id} id={id} value={value} handleClick={handleClick} />
          );
        })}
      </div>
    </div>
  );
}

// const calcKeys = [
//   { id: 'clear', value: 'AC', group: 'clr-eql' },
//   { id: 'posneg', value: '+/−', group: 'numChange' },
//   { id: 'percent', value: '%', group: 'numChange' },
//   { id: 'divide', value: '÷', group: 'operator' },
//   { id: 'seven', value: '7', group: 'number' },
//   { id: 'eight', value: '8', group: 'number' },
//   { id: 'nine', value: '9', group: 'number' },
//   { id: 'multiply', value: '×', group: 'operator' },
//   { id: 'four', value: '4', group: 'number' },
//   { id: 'five', value: '5', group: 'number' },
//   { id: 'six', value: '6', group: 'number' },
//   { id: 'subtract', value: '−', group: 'operator' },
//   { id: 'one', value: '1', group: 'number' },
//   { id: 'two', value: '2', group: 'number' },
//   { id: 'three', value: '3', group: 'number' },
//   { id: 'add', value: '+', group: 'operator' },
//   { id: 'zero', value: '0', group: 'number' },
//   { id: 'decimal', value: '.', group: 'number' },
//   { id: 'equals', value: '=', group: 'clr-eql' },
// ];

// type Operand = string | number;

// interface CalculatorState {
//   display: string;
//   inputBuffer: string[];
//   lastInput: number;
//   lastOperator: string;
//   isLastKeyEquals: boolean;
//   isLastKeyOperator: boolean;
//   operands: Operand[];
// }

// const defaultCalculatorState: CalculatorState = {
//   display: '0',
//   inputBuffer: [],
//   lastInput: 0,
//   lastOperator: '',
//   isLastKeyEquals: false,
//   isLastKeyOperator: false,
//   operands: [],
// };

// class Calculator extends React.Component<{}, CalculatorState> {
//   constructor(props) {
//     super(props);
//     this.state = defaultCalculatorState;
//     this.handleInput = this.handleInput.bind(this);
//   }

//   handleInput(keyId, keyVal, keyGrp) {
//     // Set the display character limit
//     const maxChars = 16;

//     // FUNC TO CALCULATE INPUTS - USEFUL AS A CALLBACK AFTER SETSTATE
//     const calcInput = (operands, operator) => {
//       let result;

//       // Set the highest number of decimal places in operands as the exponent for converting them to Ints in order to avoid any wonky JS floating-point arithmetic.
//       const exp = Math.max(
//         ...operands.map(e => {
//           let numStr = e.toString();
//           // If element is an Int, return 0. Otherwise, to the number of decimal places.
//           return !numStr.includes('.')
//             ? 0
//             : numStr.slice(numStr.indexOf('.') + 1).length;
//         })
//       );

//       // Convert any floats to integers to avoid any wonky JS floating-point arithmetic.
//       const operandsAsInts = operands.map(e => e * Math.pow(10, exp));

//       // Use appropriate exponent for reversing the ones used when converting operands to Ints.
//       const expRev = {
//         multiply: exp * 2, // When multiplying nums w/exponents, the exps are added. Here, return exp * 2, since the same exp was used to convert the operands to integers.
//         divide: 0, // When dividing nums w/exponents, the exps are subtracted. Here, return 0, since the same exp was used to convert the operands to integers.
//         // For addition and subtraction, just use the original exp to restore the decimal place.
//         add: exp,
//         subtract: exp,
//       };

//       const doCalc = (operandsArr, operatorStr) => {
//         const reducer = {
//           multiply: (accumulator, currentValue) => accumulator * currentValue,
//           divide: (accumulator, currentValue) => accumulator / currentValue,
//           add: (accumulator, currentValue) => accumulator + currentValue,
//           subtract: (accumulator, currentValue) => accumulator - currentValue,
//         };
//         return operandsArr.reduce(reducer[operatorStr]);
//       };

//       // If the operands array length < 2
//       if (operands.length < 2) {
//         // Equals key pressed? Return early.
//         if (keyId === 'equals') {
//           return;
//         }
//         // Operator key? Merely set the operator.
//         else {
//           this.setState({
//             lastOperator: keyId,
//           });
//         }
//       } else {
//         // Abort operation if division by 0 and display error.
//         if (operator === 'divide' && operands[1] === 0) {
//           console.log('Error: No division by 0. Operation aborted.');
//           this.setState({
//             display: 'Err: n / 0',
//             operands: [],
//             lastOperator: '',
//           });
//         } else {
//           // Do the calculation and restore the proper decimal place if needed.
//           result =
//             doCalc(operandsAsInts, operator) / Math.pow(10, expRev[operator]);

//           // For fitting the result to the display
//           const fitResultToDisplay = (num, l) => {
//             let numStr = num.toString();
//             // Return early with numStr if its length <= l
//             if (numStr.length <= l) return numStr;
//             // Otherwise, make room for possible exponential notation.
//             return num.toPrecision(l - 5);
//           };

//           if (keyGrp === 'numChange') {
//             if (this.state.isLastKeyEquals) {
//               this.setState({
//                 display: fitResultToDisplay(result, maxChars),
//                 operands: [result],
//               });
//             } else {
//               this.setState({
//                 display: fitResultToDisplay(result, maxChars),
//                 inputBuffer: [...result.toString()],
//               });
//             }
//           } else {
//             // Keep the operator on equals keypress, otherwise set to operator keyId
//             let nextOperator = keyId === 'equals' ? operator : keyId;

//             this.setState({
//               display: fitResultToDisplay(result, maxChars),
//               operands: [result],
//               lastOperator: nextOperator,
//             });
//           }
//         }
//       }
//     }; // END calcInput function

//     // HANDLE CLEAR KEY //
//     if (keyId === 'clear') {
//       this.setState(defaultCalculatorState);
//     }

//     // HANDLE NUMBER KEYS //
//     else if (keyGrp === 'number') {
//       let inputVal = keyVal;
//       // Boolean test for inputBuffer option in setState that prevents leading zeroes on integers
//       let isBufferOnlyZeroAndInputIsInt =
//         this.state.inputBuffer.length === 1 &&
//         this.state.inputBuffer[0] === '0' &&
//         /[\d]/g.test(inputVal);

//       // Callback function to update display after setState
//       const updateDisplay = () => {
//         let numStr = this.state.inputBuffer.join('');
//         this.setState({ display: numStr });
//       };

//       // Limit the number of characters in the buffer
//       if (this.state.inputBuffer.length === maxChars) return;

//       // Decimal key options
//       if (keyId === 'decimal') {
//         // Return early if number already contains a decimal point (US#11)
//         if (this.state.inputBuffer.includes(keyVal)) return;
//         // Prefix initial decimals with a "0"
//         if (this.state.inputBuffer.length === 0) {
//           inputVal = ['0', keyVal];
//         }
//       }

//       this.setState(
//         prevState => ({
//           inputBuffer: isBufferOnlyZeroAndInputIsInt
//             ? [].concat(inputVal)
//             : prevState.inputBuffer.concat(inputVal),
//           isLastKeyEquals: false,
//           isLastKeyOperator: false,
//         }),
//         () => updateDisplay()
//       );
//     }

//     // HANDLE OPERATOR KEY INPUTS //
//     else if (keyGrp === 'operator') {
//       // Save the inputBuffer as a number
//       let numFromBuffer = Number(this.state.inputBuffer.join(''));
//       // Consecutive operator key clicks or operator following equals key? Just update the operator state.
//       if (this.state.isLastKeyOperator || this.state.isLastKeyEquals) {
//         this.setState({
//           lastOperator: keyId,
//           isLastKeyEquals: false,
//           isLastKeyOperator: true,
//         });
//       } else {
//         this.setState(
//           prevState => ({
//             inputBuffer: [],
//             lastInput: numFromBuffer,
//             // lastOperator: keyId, // moved this into the callback
//             isLastKeyEquals: false,
//             isLastKeyOperator: true,
//             operands: prevState.operands.concat(numFromBuffer),
//           }),
//           () => calcInput(this.state.operands, this.state.lastOperator)
//         );
//       }
//     }

//     // HANDLE NUMCHANGE (% OR +/-) KEY INPUTS //
//     else if (keyGrp === 'numChange') {
//       // Init variables
//       let operand1;
//       let operand2 = keyId === 'posneg' ? -1 : 100;
//       let operator = keyId === 'posneg' ? 'multiply' : 'divide';

//       // Return early if key is pressed directly after an operator key.
//       if (this.state.isLastKeyOperator) return;

//       // where to get the first operand
//       if (this.state.isLastKeyEquals) {
//         operand1 = this.state.operands[0];
//       } else {
//         operand1 = Number(this.state.inputBuffer.join(''));
//       }
//       calcInput([operand1, operand2], operator);
//     }

//     // HANDLER FOR EQUALS KEY //
//     else {
//       // No previous operator set? Return early.
//       if (!this.state.lastOperator) return;
//       // Save the inputBuffer as a number. Consecutive equals key presses recycle lastInput instead, as inputBuffer is cleared after each keypress.
//       let numFromBuffer = this.state.isLastKeyEquals
//         ? this.state.lastInput
//         : Number(this.state.inputBuffer.join(''));

//       this.setState(
//         prevState => ({
//           inputBuffer: [],
//           isLastKeyEquals: true,
//           isLastKeyOperator: false,
//           lastInput: numFromBuffer,
//           // lastOperator: keyId,
//           operands: prevState.operands.concat(numFromBuffer),
//         }),
//         () => calcInput(this.state.operands, this.state.lastOperator)
//       );
//     }
//   } // END handleInput()

//   render() {
//     return (
//       <div id="calculator">
//         <Display display={this.state.display} />
//         <div id="calcLabel">
//           <span id="calcLabelLeft">FCC FEL-P4</span>
//           <span id="calcLabelRight">JS-CALCULATOR</span>
//         </div>
//         <div id="keypad">
//           {calcKeys.map(calcKey => (
//             <CalcKey
//               key={calcKey.id}
//               id={calcKey.id}
//               value={calcKey.value}
//               group={calcKey.group}
//               handleClick={this.handleInput}
//             />
//           ))}
//         </div>
//       </div>
//     );
//   } // END render()
// } // END Calculator class

export default Calculator;
