import React, { Component } from 'react';
import { Machine } from 'xstate';
import { interpret } from 'xstate/lib/interpreter';
import { Exercise } from '../Exercise';
import { assign } from 'xstate/lib/actions';

export const machineConfig = {
  key: 'feedback',
  initial: 'open',
  states: {
    open: {
      initial: 'question',
      states: {
        question: {
          on: {
            GOOD: 'thanks',
            BAD: 'form'
          }
        },
        form: {
          on: {
            SUBMIT: {
              thanks: {
                actions: ['postForm'],
                cond: fullState => {
                  return fullState.input.length > 0;
                }
              }
            },
            CHANGE: {
              form: { actions: ['updateInput'] }
            }
          },
          onEntry: ['focusInput'],
          onExit: ['clearForm']
        },
        thanks: {
          onEntry: ['acknowledge']
        }
      },
      on: {
        ESC: 'closed',
        CLOSE: [{ target: 'closed', in: 'thanks' }]
      }
    },
    closed: {}
  }
};

export class TestingApp extends Component {
  actions = {
    focusInput: () => this.focusInput(),
    postForm: (_, event) => console.log('POST:', event.value),
    clearForm: () =>
      assign({
        input: ''
      }),
    acknowledge: () => console.log('Submitted feedback!'),
    updateInput: assign({
      input: (_, e) => e.value
    })
  };

  machine = Machine(machineConfig, { actions: this.actions }, { input: '' });

  state = {
    appState: this.machine.initialState
  };

  interpreter = interpret(this.machine, appState => {
    this.setState({ appState });
  });

  inputRef = React.createRef();

  componentDidMount() {
    this.interpreter.init();
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.interpreter.send('ESC');
      }
    });
  }

  focusInput() {
    setTimeout(() => {
      this.inputRef.current.focus();
    });
  }

  renderScreen() {
    const { appState } = this.state;

    if (appState.matches('closed')) {
      return null;
    }

    switch (appState.value.open) {
      case 'question': {
        return (
          <div className="ui-screen" data-testid="question-screen">
            <p>How was your experience?</p>
            <button
              className="ui-button"
              onClick={_ => this.interpreter.send('GOOD')}
              data-testid="good-button"
            >
              Good
            </button>
            <button
              className="ui-button"
              onClick={_ => this.interpreter.send('BAD')}
              data-testid="bad-button"
            >
              Bad
            </button>
          </div>
        );
      }
      case 'form': {
        return (
          <form
            className="ui-screen"
            data-testid="form-screen"
            onSubmit={e => {
              e.preventDefault();
              this.interpreter.send({
                type: 'SUBMIT',
                value: this.state.input
              });
            }}
          >
            <p>Why?</p>
            <input
              type="text"
              className="ui-input"
              ref={this.inputRef}
              onChange={e =>
                this.interpreter.send({ type: 'CHANGE', value: e.target.value })
              }
            />
            <button className="ui-button" data-testid="submit-button">
              Submit
            </button>
          </form>
        );
      }
      case 'thanks': {
        return (
          <div className="ui-screen" data-testid="thanks-screen">
            <p>Thank you for your feedback.</p>
            <button
              className="ui-button"
              onClick={_ => this.interpreter.send('CLOSE')}
              data-testid="close-button"
            >
              Close
            </button>
          </div>
        );
      }
      case 'closed':
      default:
        return null;
    }
  }

  render() {
    return process.env.NODE_ENV === 'test' ? (
      this.renderScreen()
    ) : (
      <Exercise
        title="Testing Statecharts"
        machine={this.machine}
        state={this.state.appState}
      >
        {this.renderScreen()}
      </Exercise>
    );
  }
}
