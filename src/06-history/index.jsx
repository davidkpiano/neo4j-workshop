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
      payment: {}
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
  }
  render() {
    return (
      <Exercise
        title="History states"
        machine={this.machine}
        state={this.state.appState}
      >
        Create a payment method app that starts in the <strong>payment</strong>{' '}
        state, goes to the <strong>payment method</strong> state where the user
        can choose between credit card, paypal, etc., and finally the{' '}
        <strong>review</strong> state. Going back from the review state should
        take the user to the payment method form they chose before.
      </Exercise>
    );
  }
}
