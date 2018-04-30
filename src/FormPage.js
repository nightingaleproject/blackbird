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
      </Menu>
    );
  }

  input(type, name, options = {}) {
    // Register this field for the current step unless noted as optional; default if not provided is that the field is required
    if (!options['optional']) {
      Completion.register(name, this.currentStep);
    }
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
    // Register this field for the current step unless noted as optional
    if (!options['optional']) {
      Completion.register(name, this.currentStep);
    }
    return <Form.TextArea rows={5} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
  }

  radio(label, name, value, options = { optional: false }) {
    // Register this field for the current step unless noted as optional
    if (!options['optional']) {
      Completion.register(name, this.currentStep);
    }
    const checked = (this.props.record[name] === value);
    return (
        <Form.Field>
          <Form.Radio label={label} name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />
        </Form.Field>
    );
  }
}

export default FormPage;
