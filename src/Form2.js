import React, { Component } from 'react';

class Form2 extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  next(event) {
    event.preventDefault();
    this.props.setStep('form3')
  }

  previous(event) {
    event.preventDefault();
    this.props.setStep('form1')
  }

  render() {
    return (
      <div className="step">
        <h2 className="title">Death Certification</h2>
        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.previous}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.next}/>
      </div>
    );
  }

}

export default Form2;
