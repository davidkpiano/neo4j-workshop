// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class PromiseApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      initial: 'idle',
      states: {
        idle: {}
      }
    },
    { actions: this.actions }
  );
  state = {
    appState: this.machine.initialState,
    data: []
  };
  send(event) {}
  render() {
    return (
      <Exercise
        title="Promise"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a simple state machine that fetches data and displays it when a
        button is clicked.
      </Exercise>
    );
  }
}
