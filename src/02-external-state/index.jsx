// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { assign } from 'xstate/lib/actions';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';

export class ExternalStateApp extends React.Component {
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
  send(event) {}
  render() {
    return (
      <Exercise
        title="External State"
        machine={this.machine}
        state={this.state.appState}
      >
        <div onClick={_ => this.send('FETCH')}>
          Use actions to update and store the data retrieved from a fetch
          request.
        </div>
      </Exercise>
    );
  }
}
