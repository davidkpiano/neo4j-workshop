// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { Exercise } from '../Exercise';

export class FiniteStateMachine extends React.Component {
  machine = Machine({
    initial: 'green',
    states: {
      green: {}
    }
  });
  state = {
    appState: this.machine.initialState
  };
  send(event) {}
  render() {
    return (
      <Exercise
        title="Finite State Machine"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a simple traffic light, that changes color when it is clicked (or
        on a timer).
      </Exercise>
    );
  }
}
