import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FiniteStateMachine } from './00-finite-state-machine';
import { PromiseApp } from './01-promise';
import { ExternalStateApp } from './02-external-state';
import { InterpreterApp } from './03-interpreter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <FiniteStateMachine />
        <PromiseApp />
        <ExternalStateApp />
        <InterpreterApp />
      </div>
    );
  }
}

export default App;
