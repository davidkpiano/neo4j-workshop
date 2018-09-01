// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';

const lightMachine = Machine({
  initial: 'green',
  states: {
    green: { on: { TIMER: 'yellow' } },
    yellow: { on: { TIMER: 'red' } },
    red: { on: { TIMER: 'green' } }
  }
});

const light = styled.div`
  width: 10vmin;
  height: 10vmin;
  border-radius: 50%;
`;

export class FiniteStateMachine extends React.Component {
  state = {
    appState: lightMachine.initialState
  };
  send(event) {
    this.setState({
      appState: lightMachine.transition(this.state.appState, event)
    });
  }
  render() {
    return (
      <div onClick={_ => this.send('TIMER')}>{this.state.appState.value}</div>
    );
  }
}
