import React from 'react';
import FormPage from './FormPage';

class Form2 extends FormPage {

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

    const conditionLink = function(condition) {
      const text = condition.code.coding[0].display;
      return <div key={condition.id}><button type="button" onClick={this.props.handleConditionClick} id={condition.id}>{text}</button></div>;
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

        {this.input('text', 'cod1Text')}
        {this.input('text', 'cod1Time')}<br/>

        {this.input('text', 'cod2Text')}
        {this.input('text', 'cod2Time')}<br/>

        {this.input('text', 'cod3Text')}
        {this.input('text', 'cod3Time')}<br/>

        {this.input('text', 'cod4Text')}
        {this.input('text', 'cod4Time')}<br/>

        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.props.previousStep}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.props.nextStep}/>
      </div>
    );
  }

}

export default Form2;
