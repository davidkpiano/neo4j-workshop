// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import { StateViewer } from '../StateViewer';

export class InterpreterApp extends React.Component {
  actions = {
    fetchData: () => {
      setTimeout(() => {
        const success = Math.random() < 0.5;

        if (success) {
          this.interpreter.send({
            type: 'FULFILL',
            data: ['foo', 'bar', 'baz']
          });
        } else {
          this.interpreter.send({ type: 'REJECT', message: 'No luck today' });
        }
      }, 2000);
    },
    showErrorMessage: assign({
      message: (_, event) => event.message
    }),
    updateData: assign({
      data: (_, event) => event.data,
      message: ''
    })
  };
  machine = Machine(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH: 'pending'
          }
        },
        pending: {
          onEntry: 'fetchData',
          on: {
            FULFILL: 'fulfilled',
            REJECT: 'rejected'
          }
        },
        rejected: {
          onEntry: 'showErrorMessage',
          on: {
            FETCH: 'pending'
          }
        },
        fulfilled: {
          onEntry: 'updateData'
        }
      }
    },
    { actions: this.actions },
    { data: [] }
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
      <div onClick={_ => this.interpreter.send('FETCH')}>
        {JSON.stringify(appState.value, null, 2)}
        {JSON.stringify(context, null, 2)}
        <StateViewer machine={this.machine} state={this.state.appState} />
      </div>
    );
  }
}
