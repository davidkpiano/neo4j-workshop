// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';

class Todo extends React.Component {
  actions = {};
  machine = Machine(
    {
      key: 'todo',
      parallel: true,
      states: {}
    },
    { actions: this.actions },
    this.props.todo || { value: '', id: undefined, status: 'pending' }
  );
  state = {
    todoState: this.machine.initialState
  };
  interpreter = interpret(this.machine, todoState => {
    this.setState({ todoState });
  });
  componentDidMount() {
    this.interpreter.init();
  }
  render() {
    return (
      <div>
        <div>{JSON.stringify(this.state.todoState.value)}</div>
        <input
          type="text"
          onChange={this.interpreter.send}
          value={this.state.todoState.context.value}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              this.interpreter.send('COMMIT');
            }
          }}
        />
        <button onClick={_ => this.interpreter.send('COMPLETE')}>✅</button>
        <button onClick={_ => this.interpreter.send('DELETE')}>❌</button>
      </div>
    );
  }
}

export class MultipleApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      key: 'todos',
      initial: 'all',
      states: {
        all: {}
      }
    },
    { actions: this.actions },
    { todos: [] }
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
        title="Multiple + Dynamic Statecharts"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a TodoMVC app.
      </Exercise>
    );
  }
}
