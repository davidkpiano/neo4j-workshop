// @ts-check
import React from 'react';
import { Exercise } from '../Exercise';
import { Store } from './Store'
import { Observer } from 'mobx-react'
import { onSnapshot, onPatch } from "mobx-state-tree"

const machineDefinition =  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH: 'pending'
        }
      },
      pending: {
        onEntry: 'fetchData',
        on: {
          FULFILL: 'fulfilled',
          REJECT: 'rejected'
        }
      },
      rejected: {
        onEntry: 'showErrorMessage',
        on: {
          FETCH: 'pending'
        }
      },
      fulfilled: {
        onEntry: 'updateData'
      }
    }
  }

let store = Store.create({
  machineDefinition
})

onSnapshot(store, function(){
  console.log('onSnapshot: ', arguments)
})

onPatch(store, function(){
  console.log('onPatch: ', arguments)
})

export class XStateableInterpreterApp extends React.Component {

  render() {
    
    return (
      <Observer>{()=>(
      <Exercise
        title="Using the XStateable-Interpreter"
        machine={store.machine}
        state={store.interpreter.state}
      >
        <div onClick={_ => store.interpreter.send('FETCH')}>
          {JSON.stringify(store.appState, null, 2)}
          {JSON.stringify(store.result, null, 2)}
        </div>
      </Exercise>  
        )}</Observer>
      
    );
  }
}
