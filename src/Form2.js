import React, { Component } from 'react';

class Form2 extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleConditionClick(event) {
    event.preventDefault();
    const condition = this.props.patient.conditions.find(function(condition) { return condition.id === event.target.id; });
    const text = condition.code.coding[0].display;
    console.log(text);
  }

  render() {

    const conditionLink = function(condition) {
      const text = condition.code.coding[0].display;
      return <div key={condition.id}><button type="button" onClick={this.handleConditionClick} id={condition.id}>{text}</button></div>;
    }.bind(this);

    const conditionLinks = function(conditions) {
      if (!conditions || conditions.length === 0) {
        return <div>No conditions found</div>;
      } else {
        return <div>{conditions.map(conditionLink)}</div>;
      }
    };

    return (
      <div className="step">
        <h2 className="title">Death Certification</h2>
        <p>The patient has {this.props.patient.conditions.length} conditions:</p>
        {conditionLinks(this.props.patient.conditions)}
        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.props.previousStep}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.props.nextStep}/>
      </div>
    );
  }

}

export default Form2;
