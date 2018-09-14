import { Machine } from 'xstate';
import { types } from 'mobx-state-tree'
import { interpret } from 'xstate/lib/interpreter';

export const Store = types.model(
  'Store',
  {
    machineDefinition: types.frozen(),
    appState: types.optional(types.string, ''),
    data: types.optional(types.frozen(), null),
    message: types.optional(types.string, '')
  }
)
  .actions(self => {
    function fetchData() {
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
    }

    function updateData(context, event) {
      console.log('update', arguments)
      self.message = event.message || ''
      self.data = event.data
    }

    function showErrorMessage(context, event){
      self.message = event.message
    }

    return {
      fetchData,
      showErrorMessage,
      updateData
    }
  })
  .views(self => ({
    get context(){
      return {
        data: self.data,
        message: self.message
      }
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
   }))
   .volatile(self => ({
    interpreter: interpret(self.machine, appState => {
      self.setAppState(appState.value) ;
    })
   }))
  .actions(self => {
    function setAppState(appState){
      self.appState = appState
    }
    function afterCreate() {
      self.appState = self.machine.initialState.value
      self.interpreter.init()
      console.log('store', self)
    }

    return {
      afterCreate,
      setAppState
    }
  })

