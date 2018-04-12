import React, { Component } from 'react';
import { Form, Button, Card } from 'semantic-ui-react';
import { FHIRWrap } from './FHIRClientWrapper';

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = { fhirServer: 'https://syntheticmass.mitre.org/fhir', decedentName: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePatientClick = this.handlePatientClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ patients: [] });
    FHIRWrap.loadPatients(this.state.fhirServer, this.state.decedentName).then((patients) => {
      this.setState({ patients });
    });
  }

  handlePatientClick(event, data) {
    event.preventDefault();
    const patient = this.state.patients.find(function(patient) { return patient.id === data.id; });
    FHIRWrap.loadResources(this.state.fhirServer, patient).then(([conditions, medications, procedures, observations]) => {
      this.props.setResources(conditions, medications, procedures, observations);
    });
    this.props.setPatient(patient);
    this.props.gotoStep('Pronounce');
  }

  render() {

    const patientLink = function(patient) {
      return <Card key={patient.id} onClick={this.handlePatientClick} id={patient.id} header={patient.name} />;
    }.bind(this);

    const patientLinks = function(patients) {
      if (!patients) {
        return <div/>;
      } else if (patients.length === 0) {
        return <div>Searching...</div>;
      } else {
        return <div>{patients.map(patientLink)}</div>;
      }
    };

    return (
      <div>
        <h2>Welcome</h2>
        <p>This prototype application was developed as a collaboration between the <a href="http://miblab.bme.gatech.edu">Wang Lab</a> at Georgia Tech's Wallace H. Coulter Department of Biomedical Engineering and the Centers for Disease Control.</p>
        <p>The purpose of this application is to provide visualization, context, and decision support at the point of a patient's death, with the aim of improving the timeliness, accuracy, and completeness of mortality reporting.</p>
        <h2>Search for Decedent Record</h2>
        <h3>Specify FHIR server and patient name to search for</h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>FHIR server:</label>
            <input type="text" name="fhirServer" value={this.state.fhirServer} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Decedent name:</label>
            <input type="text" name="decedentName" value={this.state.decedentName} onChange={this.handleChange} />
          </Form.Field>
          <Button type="submit">Search</Button>
        </Form>
        {patientLinks(this.state.patients)}
      </div>
    );
  }

}

export default Welcome;
