import React from 'react';

export class Feedback extends React.Component {
  state = {
    view: 'question'
  };

  componentDidMount() {
    window.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.handleClose();
      }
    });
  }
  handleGood = () => {
    this.setState({
      view: 'thanks'
    });
  };
  handleBad = () => {
    this.setState({
      view: 'form'
    });
  };
  handleSubmit = e => {
    e.preventDefault();

    this.setState({
      view: 'thanks'
    });
  };
  handleClose = () => {
    this.setState({
      view: 'closed'
    });
  };
  renderScreen() {
    switch (this.state.view) {
      case 'question':
        return (
          <div>
            <p>How was your experience?</p>
            <button onClick={this.handleGood}>Good</button>
            <button onClick={this.handleBad}>Bad</button>
          </div>
        );

      case 'form':
        return (
          <form onSubmit={this.handleSubmit}>
            <p>Why?</p>
            <input type="text" />
            <button>Submit</button>
          </form>
        );

      case 'thanks':
        return (
          <div>
            <p>Thanks for your feedback!</p>
            <button onClick={this.handleClose}>Close</button>
          </div>
        );

      case 'closed':
        return null;
    }
  }
  render() {
    return <div>{this.renderScreen()}</div>;
  }
}
