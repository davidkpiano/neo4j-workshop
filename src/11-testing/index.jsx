// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';

export class TestingApp extends React.Component {
  actions = {};
  machine = Machine({
    initial: 'question',
    states: {
      question: {
        on: {
          GOOD: 'thanks',
          BAD: 'form',
          ESC: 'closed'
        }
      },
      form: {
        on: {
          SUBMIT: 'thanks',
          ESC: 'closed'
        }
      },
      thanks: {
        on: {
          CLOSE: 'closed',
          ESC: 'closed'
        }
      },
      closed: {}
    }
  });
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
      </div>
    );
  }
}
