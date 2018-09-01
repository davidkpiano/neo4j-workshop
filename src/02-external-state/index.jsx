// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { assign } from 'xstate/lib/actions';

export class ExternalStateApp extends React.Component {
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
    updateData: assign({
      data: (_, event) => event.data
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
  send(event) {
    const nextState = this.machine.transition(this.state.appState, event);
    const { actions } = nextState;

    this.setState(
      {
        appState: this.machine.transition(this.state.appState, event)
      },
      () => {
        actions.forEach(action => {
          if (action.exec) {
            action.exec(nextState.context, event);
          }
        });
      }
    );
  }
  render() {
    const { appState } = this.state;
    const { context } = appState;
    return (
      <div onClick={_ => this.send('FETCH')}>
        {JSON.stringify(appState.value, null, 2)}
        {JSON.stringify(context, null, 2)}
      </div>
    );
  }
}
