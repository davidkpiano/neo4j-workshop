// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';

const FontStyle = styled.button`
  background: transparent;
  border: 1px solid blue;
  display: inline-block;
  padding: 0.5rem;
  color: blue;
  font-weight: bold;

  &[data-state='active'] {
    background: blue;
    color: white;
  }
`;

export class ParallelApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      id: 'fontStyles',
      parallel: true,
      states: {}
    },
    { actions: this.actions }
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
        title="Orthogonal (Parallel) States"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a font style toolbar that toggles between the bold, italic,
        underline states. Add reset functionality.
      </Exercise>
    );
  }
}
