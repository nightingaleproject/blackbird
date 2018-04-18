import React, { Component } from 'react';
import { Menu, Form, Input, Radio, Icon } from 'semantic-ui-react';
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
          {isComplete ? <Icon name='check' /> : <Icon name='exclamation' />}
        </Menu.Item>
    );
  }

  menu(currentStep) {
    // Track what step this form page is for tracking fields for completion
    this.currentStep = currentStep;
    return (
      <Menu tabular>
        {this.menuItem('Pronouncing', currentStep)}
        {this.menuItem('CauseOfDeath', currentStep)}
        {this.menuItem('AdditionalQuestions', currentStep)}
      </Menu>
    );
  }

  input(type, name, options = { optional: false }) {
    // Register this field for the current step unless noted as optional
    if (!options['optional']) {
      Completion.register(name, this.currentStep);
    }
    return <Input type={type} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
  }

  radio(label, name, value, options = { optional: false }) {
    // Register this field for the current step unless noted as optional
    if (!options['optional']) {
      Completion.register(name, this.currentStep);
    }
    const checked = (this.props.record[name] === value);
    return (
        <Form.Field>
          <Radio label={label} name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />
        </Form.Field>
    );
  }
}

export default FormPage;
