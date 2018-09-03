// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import styled from 'styled-components';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';

export class HistoryApp extends React.Component {
  actions = {};
  machine = Machine({
    initial: 'payment',
    states: {
      payment: {
        on: {
          CONTINUE: 'method'
        }
      },
      method: {
        initial: 'card',
        states: {
          card: {},
          paypal: {},
          hist: { history: true }
        },
        on: {
          'METHOD.CARD': '.card',
          'METHOD.PAYPAL': '.paypal',
          CONTINUE: 'review'
        }
      },
      review: {
        on: {
          BACK: 'method.hist'
        }
      }
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
  renderScreen() {
    const { appState } = this.state;

    if (appState.matches('payment')) {
      return (
        <div>
          <h2>Payment</h2>
          <button onClick={_ => this.interpreter.send('CONTINUE')}>
            Continue
          </button>
        </div>
      );
    }

    if (appState.matches('method')) {
      return (
        <div>
          <h2>Method: {appState.value.method}</h2>
          <button onClick={_ => this.interpreter.send('METHOD.CARD')}>
            Card
          </button>
          <button onClick={_ => this.interpreter.send('METHOD.PAYPAL')}>
            PayPal
          </button>
          <button onClick={_ => this.interpreter.send('CONTINUE')}>
            Continue
          </button>
        </div>
      );
    }

    if (appState.matches('review')) {
      return (
        <div>
          <h2>Review</h2>
          <button onClick={_ => this.interpreter.send('BACK')}>Back</button>
        </div>
      );
    }
  }
  render() {
    return (
      <Exercise
        title="History states"
        machine={this.machine}
        state={this.state.appState}
      >
        <div>
          {this.renderScreen()}
          <StateViewer machine={this.machine} state={this.state.appState} />
        </div>
      </Exercise>
    );
  }
}
