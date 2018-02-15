import React, { Component } from 'react';
import './App.css';
import Welcome from './Welcome';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1><header>U.S. Standard Certificate of Death Form</header></h1>
        <div className="infohead">
          Patient Name: <span className="data" id="patient_name"></span><br/>
          Patient ID: <span className="data" id="patient_id"></span><br/>
          Patient Age: <span className="data" id="patient_age"></span><br/>
        </div>
        <Welcome/>
      </div>
    );
  }
}

export default App;
