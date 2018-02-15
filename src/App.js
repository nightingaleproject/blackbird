import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Welcome from './Welcome';
import Form1 from './Form1';
import Form2 from './Form2';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { step: 1 };
    this.setPatient = this.setPatient.bind(this)
    this.nextStep = this.nextStep.bind(this)
    this.previousStep = this.previousStep.bind(this)
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

  render() {

    const renderStep = function(step) {
      switch (step) {
      case 2:
        return <Form1 patient={this.state.patient} nextStep={this.nextStep} previousStep={this.previousStep} />;
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
