import React, { Component } from 'react';
import { Menu, Form, Input, Radio, Icon } from 'semantic-ui-react';
import _ from 'lodash';

class FormPage extends Component {

  constructor(props) {
    super(props);
    this.state = { registeredFields: [] };
    this.fields = [];
    this.input = this.input.bind(this);
    this.radio = this.radio.bind(this);
  }

  // Keep track of the fields displayed on each page in order to track completion
  register(fieldName) {
    this.fields = _.union(this.fields, [fieldName]);
  }

  // Once we render put the names of the fields into the state so we can track completion
  // Note: we can't update state directly while rendering, so we do this two step process
  componentDidMount() {
    // We only want to do this once, not on every render, so compare to what's already in the state
    if (!_.isEqual(this.state.registeredFields, this.fields)) {
      console.log(this.fields);
      this.setState({ registeredFields: this.fields });
    }
  }

  menuItem(stepName, currentStep) {
    // Figure out what proportion of the fields on this page are filled out
    // FIXME: THIS IS BROKEN IN TWO WAYS
    // 1. Each page shows the same %, because the whole menu is rendered by each page, not the individual tabs
    // 2. Simple % complete makes no sense for the COD page if we assume 4 fields some of which may be blank
    const relevantRecord = _.pick(this.props.record, this.state.registeredFields);
    const totalFields = this.state.registeredFields.length;
    const completedFields = _.chain(relevantRecord).values().filter((value) => value).value().length;
    const proportion = completedFields / totalFields;
    return (
        <Menu.Item name={stepName} active={currentStep === stepName} onClick={() => this.props.gotoStep(stepName)}>
          {stepName}
          {proportion === 1.0 ? <Icon name='check' /> : `${Math.round(proportion * 100)}%`}
        </Menu.Item>
    );
  }

  menu(currentStep) {
    return (
      <Menu tabular>
        {this.menuItem('Pronouncing', currentStep)}
        {this.menuItem('CauseOfDeath', currentStep)}
        {this.menuItem('AdditionalQuestions', currentStep)}
      </Menu>
    );
  }

  input(type, name) {
    this.register(name);
    return <Input type={type} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
  }

  radio(label, name, value) {
    this.register(name);
    const checked = (this.props.record[name] === value);
    return (
        <Form.Field>
          <Radio label={label} name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />
        </Form.Field>
    );
  }
}

export default FormPage;
