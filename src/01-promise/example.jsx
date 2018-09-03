// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class PromiseApp extends React.Component {
  actions = {
    fetchData: () => {
      console.log('testing');
      fetch('https://swapi.co/api/people/1')
        .then(data => data.json())
        .then(data => {
          this.send({
            type: 'FULFILL',
            data
          });
        });
    },
    updateData: (context, event) => {
      this.setState({
        data: event.data
      });
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
          onEntry: ['fetchData'],
          on: {
            FULFILL: 'fulfilled'
          }
        },
        fulfilled: {
          onEntry: ['updateData']
        },
        rejected: {}
      }
    },
    { actions: this.actions }
  );
  state = {
    appState: this.machine.initialState,
    data: []
  };
  send(event) {
    const { appState } = this.state;

    const nextState = this.machine.transition(appState, event);

    nextState.actions.forEach(action => {
      action.exec && action.exec(this.state, event);
    });

    this.setState({ appState: nextState });
  }
  render() {
    const { data } = this.state;

    return (
      <Exercise
        title="Promise"
        machine={this.machine}
        state={this.state.appState}
      >
        {this.state.appState.value === 'pending' && 'Fetching data...'}
        {this.state.appState.value === 'fulfilled' && (
          <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
        )}
        <button onClick={_ => this.send('FETCH')}>Fetch data</button>
      </Exercise>
    );
  }
}
