import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FiniteStateMachine } from './00-finite-state-machine';
import { PromiseApp } from './01-promise';
import { ExternalStateApp } from './02-external-state';
import { InterpreterApp } from './03-interpreter';
import { NestedApp } from './04-nested';
import { ParallelApp } from './05-parallel';
import { HistoryApp } from './06-history';
import { GuardsApp } from './07-guards';
import { TransientApp } from './08-transient';
import { InternalExternalApp } from './09-internal-external';
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
        <NestedApp />
        <ParallelApp />
        <HistoryApp />
        <GuardsApp />
        <TransientApp />
        <InternalExternalApp />
      </div>
    );
  }
}

export default App;
