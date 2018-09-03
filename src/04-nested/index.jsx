// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import { Exercise } from '../Exercise';

export class NestedApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      initial: 'gallery',
      states: {
        gallery: {}
      }
    },
    { actions: this.actions },
    { photos: [] }
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
        title="Nested (Hierarchical) States"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a gallery app with two states: <strong>gallery</strong> and{' '}
        <strong>photo</strong>. The <strong>gallery</strong> state loads the
        photos, and clicking a photo takes the user to the{' '}
        <strong>photo</strong> state and loads the photo.
      </Exercise>
    );
  }
}
