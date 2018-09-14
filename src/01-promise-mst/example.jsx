// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { Exercise } from '../Exercise';
import { Store } from './Store';
import {Observer} from 'mobx-react'
import {onPatch} from "mobx-state-tree"


const machineDefinition =  {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending'
      }
    },
    pending: {
      onEntry: ['fetchData'],
      on: {
        FULFILL: 'fulfilled',
        REJECT: 'rejected'
      }
    },
    fulfilled: {
      onEntry: ['updateData'],
      on: {
        FETCH: 'pending'
      }
    },
    rejected: {
      on: {
        FETCH: 'pending'
      }
    }
  }
}

let store = Store.create({
  machineDefinition
})

onPatch(store, function(){
  console.log('patch: ', arguments)
})



export class MSTPromiseApp extends React.Component {
  render() {
    const { data } = store;

    return (
      <Observer>{() => (
      <Exercise
        title="Promise"
        machine={store.machine}
        state={store.appState}
      >
        {store.appState.value === 'pending' && 'Fetching data...'}
        {store.appState.value === 'fulfilled' && (
          <pre>{JSON.stringify(store.data, null, 2)}</pre>
        )}
        <button onClick={_ => store.send('FETCH')}>Fetch data</button>
      </Exercise>
      )}
      </Observer>
    );
  }
}
