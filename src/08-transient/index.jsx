// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class TransientApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      key: 'greeting',
      initial: 'pending',
      states: {
        pending: {}
      }
    },
    { actions: this.actions },
    { hour: undefined }
  );
  state = {
    appState: this.machine.initialState
  };
  interpreter = interpret(this.machine, appState => {
    this.setState({ appState });
  });
  componentDidMount() {
    this.interpreter.init();
  }
  render() {
    return (
      <Exercise
        title="Transient States"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a greeting app that tells the user "Good
        morning/afternoon/evening", depending on what time (hour) it is.
      </Exercise>
    );
  }
}
