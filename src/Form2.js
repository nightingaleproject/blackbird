import React, { Component } from 'react';

class Form2 extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  render() {
    return (
      <div className="step">
        <h2 className="title">Death Certification</h2>
        The patient has {this.props.patient.conditions.length} conditions<br/>
        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.props.previousStep}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.props.nextStep}/>
      </div>
    );
  }

}

export default Form2;
