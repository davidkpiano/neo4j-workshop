// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';

const TrafficLight = styled.div`
  background: var(--color);
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
  margin: 2vh 0;
  opacity: 0.3;
  border: 1vh solid black;

  &[data-active='true'] {
    opacity: 1;
  }
`;

const TrafficLights = styled.div`
  display: flex;
  flex-direction: column;
`;

export class FiniteStateMachine extends React.Component {
  machine = Machine({
    initial: 'green',
    states: {
      green: { on: { TIMER: 'yellow' } },
      yellow: { on: { TIMER: 'red' } },
      red: { on: { TIMER: 'green' } }
    }
  });
  state = {
    appState: this.machine.initialState
  };
  send(event) {
    this.setState({
      appState: this.machine.transition(this.state.appState, event)
    });
  }
  componentDidMount() {
    setInterval(() => {
      this.send('TIMER');
    }, 1000);
  }
  render() {
    return (
      <Exercise
        title="Finite State Machine"
        machine={this.machine}
        state={this.state.appState}
      >
        <TrafficLights>
          <TrafficLight
            data-active={this.state.appState.value === 'red'}
            style={{ '--color': 'red' }}
          />
          <TrafficLight
            data-active={this.state.appState.value === 'yellow'}
            style={{ '--color': 'yellow' }}
          />
          <TrafficLight
            data-active={this.state.appState.value === 'green'}
            style={{ '--color': 'green' }}
          />
        </TrafficLights>
      </Exercise>
    );
  }
}
