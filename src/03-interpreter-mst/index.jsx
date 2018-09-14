// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';

export class InterpreterApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      initial: 'idle',
      states: {
        idle: {}
      }
    },
    { actions: this.actions },
    { data: [] }
  );
  state = {
    appState: this.machine.initialState
  };
  interpreter = undefined;
  componentDidMount() {
    // initialize the interpreter
  }
  render() {
    return (
      <Exercise
        title="Using the Interpreter"
        machine={this.machine}
        state={this.state.appState}
      >
        Now use the interpreter to interpret the state machine from the previous
        exercise. Use <code>assign()</code> to manage the external state.
      </Exercise>
    );
  }
}
