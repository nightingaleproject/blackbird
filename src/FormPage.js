import React, { Component } from 'react';
import { Input, Menu, Form, Icon } from 'semantic-ui-react';
import Completion from './Completion';

class FormPage extends Component {

  constructor(props) {
    super(props);
    this.input = this.input.bind(this);
    this.radio = this.radio.bind(this);
  }

  menuItem(stepName, currentStep) {
    const isComplete = Completion.isComplete(stepName, this.props.record);
    return (
        <Menu.Item name={stepName} active={currentStep === stepName} onClick={() => this.props.gotoStep(stepName)}>
          {stepName}
          <Icon className='completion-icon' color='blue' size='large' name={isComplete ? 'check' : 'exclamation triangle'} />
        </Menu.Item>
    );
  }

  menu(currentStep) {
    // Track what step this form page is for tracking fields for completion
    this.currentStep = currentStep;
    return (
      <Menu pointing fluid>
        {this.menuItem('Pronouncing', currentStep)}
        {this.menuItem('CauseOfDeath', currentStep)}
        {this.menuItem('AdditionalQuestions', currentStep)}
        {this.menuItem('InjuryQuestions', currentStep)}
      </Menu>
    );
  }

  input(type, name, options = {}) {
    // Register this field for the current step for tracking form completion
    Completion.register(name, this.currentStep, options['optional']);
    return <Form.Input width={options['width']}>
             <Input type={type}
                    name={name}
                    value={this.props.record[name]}
                    label={options['label']}
                    labelPosition={options['label'] ? 'right' : null}
                    onChange={this.props.handleRecordChange} />
           </Form.Input>;
  }

  textarea(name, options = {}) {
    // Register this field for the current step for tracking form completion
    Completion.register(name, this.currentStep, options['optional']);
    return <Form.TextArea rows={5} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
  }

  radio(label, name, value, options = {}) {
    // Register this field for the current step for tracking form completion
    Completion.register(name, this.currentStep, options['optional']);
    const checked = (this.props.record[name] === value);
    return (
        <Form.Field>
          <Form.Radio label={label} name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />
        </Form.Field>
    );
  }

  componentDidMount() {
    // When we first render, the menu can't know if the form is complete because the form fields haven't been
    // registered yet; this call to componentDidMount happens after render, when the fields are registered; by
    // setting a state value (which isn't actually referenced anywhere) we force a re-render if needed to
    // update the completion based on the now registered form fields
    this.setState({ isComplete: Completion.isComplete(this.currentStep, this.props.record) });
  }
}

export default FormPage;
