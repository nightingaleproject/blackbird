import React, { Component } from 'react';
import { Form, Button, Loader, Card } from 'semantic-ui-react';
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
    const patient = this.state.patients.find((patient) => patient.id === data.id);
    FHIRWrap.loadResources(this.state.fhirServer, patient.id).then(([conditions, medications, procedures, observations]) => {
      this.props.setResources(conditions, medications, procedures, observations);
    });
    this.props.setPatient(patient);
    this.props.gotoStep('Pronouncing');
  }

  render() {

    const patientLink = (patient) => {
      return <Card key={patient.id} onClick={this.handlePatientClick} id={patient.id} header={patient.name} />;
    };

    const patientLinks = (patients) => {
      if (!patients) {
        return null;
      } else if (patients.length === 0) {
        return <Loader active inline='centered' content='Loading' />;
      } else {
        return <Card.Group className='patients'>{patients.map(patientLink)}</Card.Group>;
      }
    };

    return (
      <div>
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
          <Button primary type="submit">Search</Button>
        </Form>
        {patientLinks(this.state.patients)}
      </div>
    );
  }

}

export default Welcome;
