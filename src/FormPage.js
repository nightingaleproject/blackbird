import React, { Component } from 'react';

class FormPage extends Component {

  constructor(props) {
    super(props);
    this.input = this.input.bind(this);
    this.radio = this.radio.bind(this);
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