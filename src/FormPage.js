import React, { Component } from 'react';
import { Menu, Form, Radio } from 'semantic-ui-react';

class FormPage extends Component {

  constructor(props) {
    super(props);
    this.input = this.input.bind(this);
    this.radio = this.radio.bind(this);
  }

  menu(step) {
    return (
      <Menu tabular>
        <Menu.Item name='Pronouncing' active={step === 'Pronounce'} onClick={() => this.props.gotoStep('Pronounce')} />
        <Menu.Item name='Cause of Death' active={step === 'CauseOfDeath'} onClick={() => this.props.gotoStep('CauseOfDeath')} />
        <Menu.Item name='Additional Questions' active={step === 'AdditionalQuestions'} onClick={() => this.props.gotoStep('AdditionalQuestions')} />
      </Menu>
    );
  }

  input(type, name) {
    return <input type={type} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
  }

  radio(label, name, value) {
    const checked = (this.props.record[name] === value);
    // TODO: The Radio component sends handleRecordChange different arguments (an event with the wrong target
    // and a second argument containing the change)
    return (
        <Form.Field>
          <input type='radio' name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />
          {label}
        </Form.Field>
    );
  }
}

export default FormPage;
