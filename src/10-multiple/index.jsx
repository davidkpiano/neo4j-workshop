// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';

class Todo extends React.Component {
  actions = {
    update: assign({ value: (_, e) => e.target.value }),
    commit: ctx => {
      this.props.onChange && this.props.onChange(ctx);
    }
  };
  machine = Machine(
    {
      key: 'todo',
      parallel: true,
      states: {
        mode: {
          initial: 'editing',
          states: {
            idle: {},
            editing: {
              on: {
                change: [{ actions: ['update'] }],
                COMMIT: [
                  {
                    actions: ['commit']
                  }
                ]
              }
            }
          }
        },
        status: {
          initial: 'pending',
          states: {
            pending: {
              on: { COMPLETE: 'completed', DELETE: 'deleted' }
            },
            completed: {},
            deleted: {}
          }
        }
      }
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
          key={this.props.todo ? this.props.todo.id : -1}
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
  actions = {
    addTodo: assign({
      todos: (ctx, e) => [...ctx.todos, { ...e.todo, id: ctx.todos.length }]
    }),
    updateTodo: assign({
      todos: (ctx, e) =>
        ctx.todos.map(todo => (todo.id === e.todo.id ? e.todo : todo))
    })
  };
  machine = Machine(
    {
      key: 'todos',
      initial: 'all',
      states: {
        all: {}
      },
      on: {
        'TODO.COMMIT': [
          {
            actions: ['updateTodo'],
            cond: (_, e) => e.todo.id !== undefined
          },
          { actions: ['addTodo'] }
        ]
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
    const { appState } = this.state;
    const { context } = appState;

    return (
      <div>
        {JSON.stringify(appState.context)}
        {context.todos.map(todo => {
          return (
            <Todo
              key={todo.id}
              todo={todo}
              onChange={todo =>
                this.interpreter.send({ type: 'TODO.COMMIT', todo })
              }
            />
          );
        })}
        <Todo
          key={context.todos.length}
          onChange={todo =>
            this.interpreter.send({ type: 'TODO.COMMIT', todo })
          }
        />
        <StateViewer machine={this.machine} state={this.state.appState} />
      </div>
    );
  }
}
