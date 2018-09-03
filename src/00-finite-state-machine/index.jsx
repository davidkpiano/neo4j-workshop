// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { Exercise } from '../Exercise';

export class FiniteStateMachine extends React.Component {
  machine = Machine({
    initial: 'green',
    states: {
      green: {
        on: {
          TIMER: 'yellow'
        }
      },
      yellow: {
        on: {
          TIMER: 'red'
        }
      },
      red: {
        on: {
          TIMER: 'green'
        }
      }
    }
  });
  state = {
    appState: this.machine.initialState
  };
  send(event) {
    const { appState } = this.state;

    const nextState = this.machine.transition(appState, event);

    this.setState({ appState: nextState });
  }
  render() {
    return (
      <Exercise
        title="Finite State Machine"
        machine={this.machine}
        state={this.state.appState}
      >
        {this.state.appState.value}
        <button onClick={_ => this.send('TIMER')}>Trigger timer</button>
      </Exercise>
    );
  }
}
