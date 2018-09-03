// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class PromiseApp extends React.Component {
  actions = {
    fetchData: () => {
      setTimeout(() => {
        const success = Math.random() < 0.5;

        if (success) {
          this.send({
            type: 'FULFILL',
            data: ['foo', 'bar', 'baz']
          });
        } else {
          this.send({ type: 'REJECT', message: 'No luck today' });
        }
      }, 2000);
    },
    updateData: (_, event) => {
      this.setState({ data: event.data });
    }
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
          on: {
            FETCH: 'pending'
          }
        },
        fulfilled: {
          onEntry: ['updateData']
        }
      }
    },
    { actions: this.actions }
  );
  state = {
    appState: this.machine.initialState,
    data: []
  };
  send(event) {
    const nextState = this.machine.transition(this.state.appState, event);
    const { actions } = nextState;

    this.setState(
      {
        appState: nextState
      },
      () => {
        actions.forEach(action => {
          // Look up the action
          const exec = this.actions[action.type];

          if (exec) {
            exec(this.state, event);
          }
        });
      }
    );
  }
  render() {
    return (
      <Exercise
        title="Promise"
        machine={this.machine}
        state={this.state.appState}
      >
        <div onClick={_ => this.send('FETCH')}>
          {JSON.stringify(this.state.appState.value, null, 2)}
          {this.state.data && JSON.stringify(this.state.data, null, 2)}
        </div>
      </Exercise>
    );
  }
}
