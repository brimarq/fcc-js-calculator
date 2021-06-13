import React from 'react';
import './CalcKey.css';

class CalcKey extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      calcKeyClassName: this.props.defaultClassName,
    };
    this.handleClick = this.handleClick.bind(this);
    this.setCalcKeyClassName = this.setCalcKeyClassName.bind(this);
  }

  setCalcKeyClassName(str) {
    this.setState(() => ({ calcKeyClassName: str }));
  }

  handleClick() {
    this.setCalcKeyClassName(this.props.clickedClassName);
    setTimeout(this.setCalcKeyClassName, 50, this.props.defaultClassName);
    this.props.handleInput(this.props.id, this.props.value, this.props.group);
  }

  render() {
    return (
      <div
        id={this.props.id}
        className={this.state.calcKeyClassName}
        onClick={this.handleClick}
      >
        {this.props.value}
      </div>
    );
  }
}

export default CalcKey;
