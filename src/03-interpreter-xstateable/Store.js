import { Machine } from 'xstate';
import { types } from 'mobx-state-tree'
import { interpret } from 'xstate/lib/interpreter';

export const XStateable = types.model(
  'XStateable',
  {
    machineDefinition: types.frozen(),
    appState: types.optional(types.string, '')
  }
)
  .volatile(self => ({
    interpreter: interpret(self.machine, appState => {
      self.setAppState(appState.value);
    })
  }))
  .actions(self => ({
    setAppState(appState) {
      self.appState = appState
    },
    afterCreate() {
      self.appState = self.machine.initialState.value
      self.interpreter.init()
    }
  }))

export const Store = types.compose(
  types.model(
    'Store',
    {
      data: types.optional(types.frozen(), null),
      message: types.optional(types.string, '')
    })
    .views(self => ({
      get result() {
        return {
          data: self.data,
          message: self.message
        }
      }
    }))
    .actions(self => ({
      fetchData() {
        setTimeout(() => {
          const success = Math.random() < 0.5;

          if (success) {
            self.interpreter.send({
              type: 'FULFILL',
              data: ['foo', 'bar', 'baz']
            });
          } else {
            self.interpreter.send({ type: 'REJECT', message: 'No luck today' });
          }
        }, 2000);
      },

      updateData(context, event) {
        self.message = event.message || ''
        self.data = event.data
      },

      showErrorMessage(context, event) {
        self.message = event.message
      }
    }))
    .volatile(self => ({
      machine: Machine(self.machineDefinition, {
        actions: {
          fetchData: self.fetchData,
          updateData: self.updateData,
          showErrorMessage: self.showErrorMessage
        }
      })
    })),
    XStateable
)
