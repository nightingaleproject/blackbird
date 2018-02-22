import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import './App.css';
import Header from './Header';
import Welcome from './Welcome';
import Form1 from './Form1';
import Form2 from './Form2';
import Form3 from './Form3';

class App extends Component {

  constructor(props) {
    super(props);
    const record = {
      pronouncedDeathDate: '',
      pronouncedDeathTime: '',
      actualDeathDate: '',
      actualDeathTime: '',
      examinerContacted: null,
      autopsyPerformed: null,
      autopsyAvailable: null,
      certifierName: '',
      certifierNumber: '',
      cod1Text: '',
      cod1Time: '',
      cod2Text: '',
      cod2Time: '',
      cod3Text: '',
      cod3Time: '',
      cod4Text: '',
      cod4Time: '',
      tobacco: null,
      pregnancy: null,
      mannerOfDeath: null
    };
    // TODO: Add a FHIR.oauth2.ready that changes step to 2 when called with a valid patient
    this.state = { step: 1, record: record, conditions: [] };
    this.setPatient = this.setPatient.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.handleRecordChange = this.handleRecordChange.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
  }

  setPatient(patient) {
    this.setState({ patient });
  }

  nextStep(step) {
    this.setState((prevState) => ({ step: prevState.step + 1 }));
  }

  previousStep(step) {
    this.setState((prevState) => ({ step: prevState.step - 1 }));
  }

  updateRecord(field, value) {
    this.setState((prevState) => {
      const newRecord = Object.assign({}, prevState.record);
      newRecord[field] = value;
      return ({ record: newRecord });
    });
  }

  handleRecordChange(event) {
    const target = event.target;
    this.updateRecord(target.name, target.value);
  }

  // Add/remove a condition from the patient record to/from the death record
  // TODO: We'll want an interface that allows text to be edited, condition order to be changed, conditions to be added manually, etc
  handleConditionClick(event) {
    event.preventDefault();
    const clickedCondition = this.state.patient.conditions.find(function(condition) { return condition.id === event.target.id; });
    // First update our internal conditions state, adding or subtracting as needed and sorting by onset
    let newConditions = this.state.conditions.slice(); // Create a new copy of the array
    if (newConditions.some(function(condition) { return condition.id === clickedCondition.id })) {
      newConditions = newConditions.filter(function(condition) { return condition.id !== clickedCondition.id });
    } else {
      newConditions.push(clickedCondition);
      newConditions = _.sortBy(newConditions, function(condition) { return moment(condition.onsetDateTime); });
    }
    this.setState({ conditions: newConditions });
    // Then update the user display of the conditions
    for (let i = 0; i < 4; i++) {
      if (newConditions[i]) {
        const text = newConditions[i].code.coding[0].display;
        const onset = newConditions[i].onsetDateTime;
        this.updateRecord(`cod${i+1}Text`, text);
        this.updateRecord(`cod${i+1}Time`, onset);
      } else {
        this.updateRecord(`cod${i+1}Text`, '');
        this.updateRecord(`cod${i+1}Time`, '');
      }
    }
  }

  render() {

    const renderStep = function(step) {
      switch (step) {
      case 2:
        return <Form1 patient={this.state.patient} nextStep={this.nextStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 3:
        return <Form2 patient={this.state.patient} previousStep={this.previousStep} nextStep={this.nextStep} handleRecordChange={this.handleRecordChange} handleConditionClick={this.handleConditionClick} record={this.state.record} />;
      case 4:
        return <Form3 patient={this.state.patient} previousStep={this.previousStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 1:
      default:
        return <Welcome setPatient={this.setPatient} nextStep={this.nextStep} />;
      }
    }.bind(this);

    return (
      <div className="App">
        <h1><header>U.S. Standard Certificate of Death Form</header></h1>
        <Header patient={this.state.patient}/>
        {renderStep(this.state.step)}
      </div>
    );

  }

}

export default App;
