import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Welcome from './Welcome';
import Form1 from './Form1';
import Form2 from './Form2';

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
      certifierNumber: ''
    };
    // TODO: Add a FHIR.oauth2.ready that changes step to 2 when called with a valid patient
    this.state = { step: 1, record: record };
    this.setPatient = this.setPatient.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this);
    this.handleRecordChange = this.handleRecordChange.bind(this);
  }

  setPatient(patient) {
    this.setState({ patient });
  }

  nextStep(step) {
    this.setState({ step: this.state.step + 1 });
  }

  previousStep(step) {
    this.setState({ step: this.state.step - 1 });
  }

  handleRecordChange(event) {
    const target = event.target;
    const newRecord = Object.assign({}, this.state.record);
    newRecord[target.name] = target.value;
    this.setState({ record: newRecord });
  }

  render() {

    const renderStep = function(step) {
      switch (step) {
      case 2:
        return <Form1 patient={this.state.patient} nextStep={this.nextStep} previousStep={this.previousStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 3:
        return <Form2 patient={this.state.patient} nextStep={this.nextStep} previousStep={this.previousStep} />;
      case 4:
        const Form3 = function(props) { return <div>FORM3</div>; }; // TODO: Placeholder
        return <Form3 patient={this.state.patient} previousStep={this.previousStep}/>;
      case 1:
      default:
        return <Welcome setPatient={this.setPatient} nextStep={this.nextStep}/>;
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
