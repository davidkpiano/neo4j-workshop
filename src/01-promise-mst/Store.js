import { Machine } from 'xstate';
import { types } from 'mobx-state-tree'

export const Store = types.model(
  'Store',
  {
    machineDefinition: types.frozen(),
    appState: types.optional(types.frozen(), null),
    data: types.optional(types.frozen(), null)
  }
)
  .actions(self => {
    function send(event) {
      const currentState = self.appState.value;

      const nextState = self.machine.transition(currentState, event);

      nextState.actions.forEach(action => {
        action.exec && action.exec(self, event);
      });

      self.appState = nextState;
    }

    return {
      send
    }
  })
  .actions(self => {
    function fetchData() {
      console.log('testing');
      fetch('https://swapi.co/api/people/1')
        .then(data => data.json())
        .then(data => {
          self.send({
            type: 'FULFILL',
            data
          });
        })
        .catch(e => {
          self.send('REJECT');
        });
    }
    function updateData(context, event) {
      self.data = event.data;
    }

    return {
      fetchData,
      updateData
    }
  })
  .volatile(self => ({
    machine: Machine(self.machineDefinition, {
      actions: {
        fetchData: self.fetchData,
        updateData: self.updateData
      }
    })
  }))
  .actions(self => {
    function afterCreate() {
      self.appState = self.machine.initialState
    }

    return {
      afterCreate
    }
  })

