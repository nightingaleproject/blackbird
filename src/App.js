import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Welcome from './Welcome';
import Form1 from './Form1';
import Form2 from './Form2';


// page 1: welcome and patient search (test for SMART context)
//    input: nothing
//   output: selected patient
// page 2: form page 1
//    input: selected patient
//   output: some fields
// page 3: form page 2 with timeline
//    input: selected patient
//   output: some fields
// page 4: form page 3 with submit
//    input: selected patient
//   output: some fields


class App extends Component {

  constructor(props) {
    super(props);
    this.state = { step: 'welcome' };
    this.setPatient = this.setPatient.bind(this)
    this.setStep = this.setStep.bind(this)
  }

  setPatient(patient) {
    this.setState({ patient });
  }

  setStep(step) {
    this.setState({ step });
  }

  render() {

    const renderStep = function(stepName) {
      switch (stepName) {
      case 'form1':
        return <Form1 patient={this.state.patient} setStep={this.setStep}/>;
      case 'form2':
        return <Form2 patient={this.state.patient} setStep={this.setStep}/>;
      case 'welcome':
      default:
        return <Welcome setPatient={this.setPatient} setStep={this.setStep}/>;
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
