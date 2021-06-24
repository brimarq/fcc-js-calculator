import React from 'react';
import Display from './Display';
import CalcKey from './CalcKey';
import './Calculator.css';

interface CalculatorState {
  operand1: string;
  operand2: string;
  operator: string;
  result: string;
}

const defaultState: CalculatorState = {
  operand1: '0',
  operand2: '',
  operator: '',
  result: '',
};

function Calculator() {
  const [state, setState] = React.useState(defaultState);
  const { operand1, operand2, operator, result } = state;
  const display = state.result || state.operand2 || state.operand1;
  const maxDisplayChars = 16;

  // prettier-ignore
  const keyData = [
    ['clear','AC'], ['negate','+/−'], ['percent','%'], ['divide','÷'], 
    ['seven','7'], ['eight','8'], ['nine','9'], ['multiply','×'], 
    ['four','4'], ['five','5'], ['six','6'], ['subtract','−'], 
    ['one','1'], ['two', '2'], ['three','3'], ['add','+'], 
    ['zero', '0'], ['decimal','.'], ['equals','=']
  ];

  function handleClick(e: React.MouseEvent): void {
    e.preventDefault();
    const { id, value } = e.target as HTMLButtonElement;
    const lcd = document.querySelector('#display');
    let nextState: CalculatorState = { ...state };
    let currentOperand: 'operand2' | 'operand1';

    const getCurrentOperand = (operator: string) =>
      operator ? 'operand2' : 'operand1';

    function calculate(operand1: string, operand2: string, operator: string) {
      let result: number;

      function fitResultToDisplay(num: number, displayLength: number) {
        const numStr = num.toString();
        return numStr.length <= displayLength
          ? numStr
          : num.toPrecision(displayLength - 5);
      }

      switch (operator) {
        case 'add':
          result = Number(operand1) + Number(operand2);
          break;
        case 'subtract':
          result = Number(operand1) - Number(operand2);
          break;
        case 'multiply':
          result = Number(operand1) * Number(operand2);
          break;
        case 'divide':
          result = Number(operand1) / Number(operand2);
      }

      return fitResultToDisplay(result, maxDisplayChars);
    }

    // Clear div-by-0 'Err' from display if present
    if (value !== '0' && lcd.classList.contains('err')) {
      lcd.classList.toggle('err');
    }

    switch (id) {
      case 'clear':
        nextState = { ...defaultState };
        break;

      case 'negate': {
        // If negating equation result, reset state with result as operand1
        if (result) {
          nextState = { ...defaultState };
          nextState.operand1 = result;
        }
        currentOperand = getCurrentOperand(nextState.operator);
        if (nextState[currentOperand] === '0') {
          nextState[currentOperand] = '';
        } // forbid '-0'

        nextState[currentOperand] =
          nextState[currentOperand].charAt(0) === '-'
            ? nextState[currentOperand].slice(1)
            : `-${nextState[currentOperand]}`;
        break;
      }

      case 'percent': {
        // If on equation result, reset state with result as operand1
        if (result) {
          nextState = { ...defaultState };
          nextState.operand1 = result;
        }
        currentOperand = getCurrentOperand(nextState.operator);
        nextState[currentOperand] = (
          Number(nextState[currentOperand]) / 100
        ).toString();
        break;
      }

      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide': {
        if (result) {
          nextState.operand1 = result;
        } else if (operand2) {
          nextState.operand1 = calculate(operand1, operand2, operator);
        }
        nextState.operand2 = '';
        nextState.operator = id;
        nextState.result = '';
        break;
      }

      case 'equals': {
        if (result) {
          nextState.operand1 = result;
          nextState.result = calculate(result, operand2, operator);
        } else {
          nextState.result = calculate(operand1, operand2, operator);
        }
        break;
      }

      default: {
        // If after equation result, reset state
        nextState = result ? { ...defaultState } : { ...state };
        currentOperand = getCurrentOperand(nextState.operator);

        // Only one decimal point per operand
        if (id === 'decimal' && nextState[currentOperand].includes(value))
          return;
        // Forbid zero division
        if (value === '0' && operator === 'divide') {
          lcd.classList.toggle('err');
          return;
        }
        // No leading zeroes for integers
        nextState[currentOperand] =
          id !== 'decimal' && nextState[currentOperand] === '0'
            ? value
            : nextState[currentOperand].concat(value);
      }
    }

    console.log(nextState);
    setState(nextState);
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

export default Calculator;
