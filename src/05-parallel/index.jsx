// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';

const FontStyle = styled.button`
  background: transparent;
  border: 1px solid blue;
  display: inline-block;
  padding: 1rem;
  color: blue;

  &[data-state='active'] {
    background: blue;
    color: white;
  }
`;

export class ParallelApp extends React.Component {
  actions = {};
  machine = Machine(
    {
      id: 'fontStyles',
      parallel: true,
      states: {
        bold: {
          initial: 'inactive',
          states: {
            inactive: {
              on: { 'TOGGLE.bold': 'active' }
            },
            active: { on: { 'TOGGLE.bold': 'inactive' } }
          }
        },
        italic: {
          initial: 'inactive',
          states: {
            inactive: {
              on: { 'TOGGLE.italic': 'active' }
            },
            active: { on: { 'TOGGLE.italic': 'inactive' } }
          }
        },
        underline: {
          initial: 'inactive',
          states: {
            inactive: {
              on: { 'TOGGLE.underline': 'active' }
            },
            active: { on: { 'TOGGLE.underline': 'inactive' } }
          }
        }
      },
      on: {
        RESET: '#fontStyles'
      }
    },
    { actions: this.actions }
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
        {Object.keys(appState.value).map(key => {
          return (
            <FontStyle
              key={key}
              onClick={_ => this.interpreter.send(`TOGGLE.${key}`)}
              data-state={appState.value[key]}
            >
              {key}
            </FontStyle>
          );
        })}
        <button onClick={_ => this.interpreter.send('RESET')}>Reset</button>
        <StateViewer machine={this.machine} state={this.state.appState} />
      </div>
    );
  }
}
