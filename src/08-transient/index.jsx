// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';

export class TransientApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      key: 'greeting',
      initial: 'pending',
      states: {
        pending: {
          on: {
            '': [
              { target: 'morning', cond: ctx => ctx.hour < 12 },
              { target: 'afternoon', cond: ctx => ctx.hour < 18 },
              { target: 'evening' }
            ]
          }
        },
        morning: {},
        afternoon: {},
        evening: {}
      }
    },
    { actions: this.actions },
    { hour: new Date().getHours() }
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

    return (
      <div>
        {JSON.stringify(appState.value)} | {JSON.stringify(appState.context)}
        <StateViewer machine={this.machine} state={this.state.appState} />
      </div>
    );
  }
}
