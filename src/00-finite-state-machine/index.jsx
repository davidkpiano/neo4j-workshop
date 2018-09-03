// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class FiniteStateMachine extends React.Component {
  machine = Machine({
    initial: 'green',
    states: {
      green: { on: { TIMER: 'yellow' } },
      yellow: { on: { TIMER: 'red' } },
      red: { on: { TIMER: 'green' } }
    }
  });
  state = {
    appState: this.machine.initialState
  };
  send(event) {
    this.setState({
      appState: this.machine.transition(this.state.appState, event)
    });
  }
  render() {
    return (
      <Exercise
        title="Finite State Machine"
        machine={this.machine}
        state={this.state.appState}
      >
        <div onClick={_ => this.send('TIMER')}>{this.state.appState.value}</div>
      </Exercise>
    );
  }
}
