// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

export class GuardsApp extends React.Component {
  actions = {
    search: (ctx, e) => {
      setTimeout(() => {
        const data = Math.random() < 0.5 ? [] : ['foo', 'bar', 'baz'];
        this.interpreter.send({ type: 'FULFILL', data });
      }, 2000);
    },
    updateResults: assign({
      results: (_, e) => e.data
    })
  };
  machine = Machine(
    {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SEARCH: [{ target: 'searching', cond: ctx => ctx.query.length > 0 }]
          }
        },
        searching: {
          onEntry: 'search',
          on: {
            CHANGE: undefined,
            FULFILL: [
              { target: 'results.empty', cond: (_, e) => e.data.length === 0 },
              { target: 'results' }
            ]
          }
        },
        results: {
          initial: 'default',
          states: {
            default: {},
            empty: {}
          },
          onEntry: 'updateResults',
          on: {
            RETRY: [{ target: 'searching', cond: ctx => !ctx.results.length }]
          }
        }
      },
      on: {
        CHANGE: [
          {
            actions: [assign({ query: (_, e) => `${e.value}` })]
          }
        ]
      }
    },
    { actions: this.actions },
    { query: '', results: undefined }
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
    console.log(this.machine);
    return (
      <Exercise
        title="Guards (Conditional Transitions)"
        machine={this.machine}
        state={this.state.appState}
      >
        <div>
          <input
            type="text"
            onChange={e =>
              this.interpreter.send({
                type: 'CHANGE',
                value: e.target.value
              })
            }
          />
          <button onClick={_ => this.interpreter.send('SEARCH')}>Search</button>
          {appState.context.results &&
            appState.context.results.map(result => {
              return <div key={result}>{result}</div>;
            })}
          {appState.matches('results.empty') && (
            <button onClick={_ => this.interpreter.send('RETRY')}>Retry</button>
          )}
        </div>
      </Exercise>
    );
  }
}
