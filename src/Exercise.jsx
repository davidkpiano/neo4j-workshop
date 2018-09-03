import React from 'react';
import styled from 'styled-components';
import { StateViewer } from './StateViewer';

const StyledExercise = styled.section`
  padding: 2rem;
  height: 100%;
  width: 100%;
  overflow-y: auto;
`;

const StyledDescription = styled.div`
  display: block;
`;

const StyledContent = styled.div`
  border: 1px solid gray;
  padding: 1rem;
`;

export class Exercise extends React.Component {
  renderViewer() {
    const { machine, state } = this.props;

    if (machine && state) {
      return <StateViewer machine={machine} state={state} />;
    }
  }
  render() {
    return (
      <StyledExercise>
        <StyledDescription>
          <h1>{this.props.title}</h1>
          {this.props.content}
        </StyledDescription>
        <StyledContent>{this.props.children}</StyledContent>
        {this.renderViewer()}
      </StyledExercise>
    );
  }
}
