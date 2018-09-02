// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';

export class NestedApp extends React.Component {
  actions = {
    fetchPhotos: () => {
      setTimeout(() => {
        const success = Math.random() < 0.5;

        if (success) {
          this.interpreter.send({
            type: 'FULFILL.PHOTOS',
            data: ['foo', 'bar', 'baz']
          });
        } else {
          this.interpreter.send({
            type: 'REJECT',
            message: 'Unable to load photos'
          });
        }
      }, 2000);
    },
    fetchPhoto: (_, e) => {
      setTimeout(() => {
        const success = Math.random() < 0.5;

        if (success) {
          this.interpreter.send({
            type: 'FULFILL.PHOTO',
            data: e.data
          });
        } else {
          this.interpreter.send({
            type: 'REJECT',
            message: 'Unable to load photo'
          });
        }
      }, 2000);
    },
    showErrorMessage: assign({
      message: (_, event) => event.message
    }),
    updatePhotos: assign({
      photos: (_, event) => event.data,
      message: ''
    }),
    updatePhoto: assign({
      photo: (_, event) => event.data,
      message: ''
    })
  };
  machine = Machine(
    {
      initial: 'gallery',
      states: {
        gallery: {
          initial: 'loading',
          states: {
            loading: {
              onEntry: 'fetchPhotos',
              on: {
                'FULFILL.PHOTOS': 'loaded',
                REJECT: 'error'
              }
            },
            error: {
              on: { RETRY: 'loading' }
            },
            loaded: {
              onEntry: 'updatePhotos'
            }
          },
          on: {
            'CLICK.PHOTO': 'photo'
          }
        },
        photo: {
          initial: 'loading',
          states: {
            loading: {
              onEntry: 'fetchPhoto',
              on: {
                'FULFILL.PHOTO': 'loaded',
                REJECT: 'error'
              }
            },
            error: {
              on: { RETRY: 'loading' }
            },
            loaded: {
              onEntry: 'updatePhoto'
            }
          }
        }
      }
    },
    { actions: this.actions },
    { photos: [] }
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
    const { context } = appState;

    return (
      <div onClick={() => this.interpreter.send('RETRY')}>
        {JSON.stringify(appState.value, null, 2)}
        {JSON.stringify(context, null, 2)}
        {context.photos &&
          context.photos.map((value, i) => {
            return (
              <div
                key={i}
                onClick={() =>
                  this.interpreter.send({ type: 'CLICK.PHOTO', data: value })
                }
              >
                {value}
              </div>
            );
          })}
      </div>
    );
  }
}
