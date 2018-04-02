import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

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

  radio(name, value) {
    const checked = (this.props.record[name] === value);
    return <input type='radio' name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />;
  }
}

export default FormPage;