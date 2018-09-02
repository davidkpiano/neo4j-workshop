// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';

export class InternalExternalApp extends React.Component {
  actions = {
    reset: assign({ count: 0 }),
    sum: assign({ total: ctx => ctx.total + ctx.count }),
    increment: assign({ count: ctx => ctx.count + 1 })
  };
  machine = Machine(
    {
      key: 'greeting',
      initial: 'count',
      states: {
        count: {
          onEntry: ['reset'],
          on: {
            INCREMENT: [
              // { actions: ['increment'] }
              { target: undefined, actions: ['increment'], internal: true }
            ],
            // 'count'
            SUM: [{ target: 'count', internal: false }]
          },
          onExit: ['sum']
        }
      }
    },
    { actions: this.actions },
    { count: 0, total: 0 }
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
        <button onClick={_ => this.interpreter.send('INCREMENT')}>+</button>
        <button onClick={_ => this.interpreter.send('SUM')}>
          Calculate sum
        </button>
        <StateViewer machine={this.machine} state={this.state.appState} />
      </div>
    );
  }
}
