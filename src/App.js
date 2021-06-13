import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <main className="App-main">
          <Calculator />
        </main>
        <footer className="App-footer"></footer>
      </div>
    );
  }
}

export default App;
