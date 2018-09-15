// @ts-check
import React from 'react';
import { Machine } from 'xstate';
import styled from 'styled-components';
import { assign } from 'xstate/lib/actions';
import { interpret } from 'xstate/lib/interpreter';
import { StateViewer } from '../StateViewer';
import { Exercise } from '../Exercise';
import { Store } from './Store'
import { Observer } from 'mobx-react'
import { onPatch } from "mobx-state-tree"

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

let store = window.store = Store.create({
  machineDefinition
})

onPatch(store, function(){
  console.log('patch: ', arguments)
})


export class MSTInterpreterApp extends React.Component {

  render() {
    
    return (
      <Observer>{()=>(
      <Exercise
        title="Using the MST-Interpreter"
        machine={store.machine}
        state={store.interpreter.state}
      >
        <div onClick={_ => store.interpreter.send('FETCH')}>
          {JSON.stringify(store.appState, null, 2)}
          {JSON.stringify(store.context, null, 2)}
        </div>
      </Exercise>  
        )}</Observer>
      
    );
  }
}
