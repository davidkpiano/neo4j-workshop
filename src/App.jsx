import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { FiniteStateMachine } from './00-finite-state-machine';
import { PromiseApp } from './01-promise';
import { ExternalStateApp } from './02-external-state';
import { InterpreterApp } from './03-interpreter';
import { NestedApp } from './04-nested';
import { ParallelApp } from './05-parallel';
import { HistoryApp } from './06-history';
import { GuardsApp } from './07-guards';
import { TransientApp } from './08-transient';
import { InternalExternalApp } from './09-internal-external';
import { MultipleApp } from './10-multiple';
import styled from 'styled-components';

const examples = [
  FiniteStateMachine,
  PromiseApp,
  ExternalStateApp,
  InterpreterApp,
  NestedApp,
  ParallelApp,
  HistoryApp,
  GuardsApp,
  TransientApp,
  InternalExternalApp,
  MultipleApp
];

console.log(examples);

const StyledApp = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  height: 100%;
`;

const StyledNav = styled.nav`
  grid-column: 1 / 2;
`;

const StyledNavList = styled.ul`
  list-style-type: none;
  padding: 0;
  border-right: 1px solid #eee;
  margin: 0;
`;

const StyledNavItem = styled.li`
  padding: 1rem;
  font-size: 1rem;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

const StyledExample = styled.div`
  grid-column: 2 / -1;
  padding: 1rem;
`;

class App extends Component {
  state = {
    example: 0
  };
  render() {
    const Example = examples[this.state.example];
    return (
      <StyledApp>
        <StyledNav>
          <StyledNavList>
            {examples.map((example, i) => {
              return (
                <StyledNavItem
                  key={i}
                  onClick={_ => this.setState({ example: i })}
                >
                  {example.name}
                </StyledNavItem>
              );
            })}
          </StyledNavList>
        </StyledNav>
        <StyledExample>
          <Example />
        </StyledExample>
      </StyledApp>
    );
  }
}

export default App;
