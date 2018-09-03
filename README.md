# Neo4j Statecharts Workshop

## Getting Started

1. `npm install`
2. `npm start`

## Exercises

There are a series of exercises, which you will see on the left panel. Clicking on an exercise gives you a description on what to do. Your goal is to build each mini-app using `xstate` and learn important statechart concepts while going through each exercise.

These exercises will be using the newest (not yet released) version of `xstate v4`, which can be installed via `npm install xstate@next`. Most of the API is the same, and the documentation is here: http://davidkpiano.github.io/xstate/docs. For things not in the API, the hints section below will help.

## Hints and API

**Exercise 01**

Actions can (and should) be specified as strings. They are referenced in the second argument to `Machine(...)`:

```js
actions = {
  updateData: (ctx, event) => { ... }
};

machine = Machine({
  // config
}, { actions: this.actions });
```

Actions always have the function signature of `(context, event)` where `context` is the extended state (3rd argument of `Machine()`) and `event` is an event object of the shape `{ type: string, ... }`.

**Exercise 02**

External state (a.k.a. context) is specified as the 3rd argument of `Machine()`, and holds all non-finite state relevant to the app.

The `assign` action from `xstate` (which follows SCXML's `<assign>` semantics) can update the external state on a per-property basis:

```js
import { assign } from 'xstate/lib/assign';

// ...

actions = {
  updateData: assign({
    data: (ctx, event) => event.data
  })
};
```

The result `State` object will have the updated context in `state.context`.

**Exercise 03**

An interpreter interprets a statechart - that is, it does everything you were doing before to update the next state, execute actions, etc. To use, you create a new `Interpreter` from the `interpret` factory function:

```js
import { interpret } from 'xstate/lib/interpreter';

// ...

// Create the interpreter
const interpreter = interpret(machine, (state) => {
  // do something with the state
});

// You can also use `.onTransition()` to listen:
interpreter.onTransition(state => ...);

// Remember to initialize the interpreter.
// You'll likely want to do this on componentDidMount.
interpreter.init();
```

**Exercise 04**

Docs: http://davidkpiano.github.io/xstate/docs/#/guides/hierarchical

**Exercise 05**

Docs: http://davidkpiano.github.io/xstate/docs/#/guides/parallel

In xstate v4, you can "reset" a machine to its initial state by adding an external transition (more on that later) to itself:

```js
const machine = Machine({
  id: 'fontStyles',
  parallel: true,
  states: { /* ... */ },
  on: {
    RESET: '#fontStyles' // reset to initial state
  }
});
```

**Exercise 06**

Docs: http://davidkpiano.github.io/xstate/docs/#/guides/history

You'll only need to use shallow history for this.

**Exercise 07**

Docs: http://davidkpiano.github.io/xstate/docs/#/guides/guards

Conditions always have the function signature `(context, event) => boolean` where `event` is an event object with `{ type: ... }`.

**Exercise 08**

Transient states are just states with _eventless transitions_ - that is, transitions that happen immediately upon entering the state because they're not triggered by any event. You can use this to create "choice states". An eventless transition looks like:

```js
const machine = Machine({
  initial: 'start',
  states: {
    start: {
      on: { '': 'finish' }
    },
    finish: {}
  }
});
```

The above machine will always go directly to the `finish` state.

Combine eventless transitions with conditional transitions to create "choice states".

**Exercise 09**

Docs: http://davidkpiano.github.io/xstate/docs/#/guides/internal

New in 4.0: transitions can be _targetless_, which just means they transition to themselves.

**Exercise 10**

You can have multiple statecharts in an application, especially with dynamic entities (such as multiple todos) or communicating with external services. Statechart-to-statechart communication is nothing mysterious -- it works in much the same way as e.g., component-to-parent communication works in React.

With the Todo example, a `<Todo>` component can communicate with its parent statechart via an `onChange` method that you will implement. The `onChange` method is called from a statechart action.

I highly recommend reading more on the [Actor model](https://en.wikipedia.org/wiki/Actor_model), as it works well with statechart communication. Passing "messages" via "props", as is commonly done in React, is a loose semi-abstraction of the Actor model.
