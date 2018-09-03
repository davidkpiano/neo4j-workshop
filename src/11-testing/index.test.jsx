// @ts-check
import React from 'react';
import { TestingApp, machineConfig } from '.';
import { render, fireEvent, cleanup } from 'react-testing-library';
import * as graphUtils from 'xstate/lib/graph';
import { Machine } from 'xstate';
import * as utils from 'xstate/lib/utils';
import { assert } from 'chai';

const machine = Machine(machineConfig);

const simplePaths = graphUtils.getSimplePathsAsArray(machine, { input: '' });

for (const { state: finalState, paths: statePaths } of simplePaths) {
  describe(`'${
    utils.toStatePaths(finalState).map(p => p.join('.'))[0]
  }' state`, () => {
    statePaths.forEach((paths, i) => {
      afterEach(cleanup);

      test(`path ${i}: ${paths.map(path => path.event).join(' -> ')}`, () => {
        const { getByTestId, queryByTestId, debug } = render(<TestingApp />);

        const heuristics = {
          'open.question': () => getByTestId('question-screen'),
          'open.form': () => getByTestId('form-screen'),
          'open.thanks': () => getByTestId('thanks-screen'),
          closed: () => {
            return !queryByTestId('thanks-screen');
          }
        };

        const actions = {
          GOOD: () => fireEvent.click(getByTestId('good-button')),
          BAD: () => fireEvent.click(getByTestId('bad-button')),
          SUBMIT: () => fireEvent.click(getByTestId('submit-button')),
          CLOSE: () => fireEvent.click(getByTestId('close-button')),
          ESC: () =>
            fireEvent.keyUp(
              window,
              new KeyboardEvent('keyup', {
                key: 'Escape',
                bubbles: true
              })
            )
        };

        for (const { state, event } of paths.concat({ state: finalState })) {
          const stateString = utils
            .toStatePaths(state)
            .map(path => path.join('.'))[0];

          // assert we're in the right state
          assert.ok(heuristics[stateString](), `is not in '${stateString}'`);

          // execute the event
          assert.doesNotThrow(() => event && actions[event]());
        }
      });
    });
  });
}
