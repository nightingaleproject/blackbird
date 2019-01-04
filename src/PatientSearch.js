import React, { Component } from 'react';
import { Form, Button, Loader, Card } from 'semantic-ui-react';
import { FHIRWrap, SMARTWrap } from './FHIRClientWrapper';

class PatientSearch extends Component {

  constructor(props) {
    super(props);
    this.state = { decedentName: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleFhirServerChange = this.handleFhirServerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePatientClick = this.handlePatientClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleFhirServerChange(event) {
    this.props.updateFhirServer(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ patients: [] });
    // The search we use depends on whether we're in a SMART on FHIR context
    if (this.props.smart) {
      SMARTWrap.loadPatients(this.state.decedentName).then((patients) => {
        this.setState({ patients });
      });
    } else {
      FHIRWrap.loadPatients(this.props.fhirServer, this.state.decedentName).then((patients) => {
        this.setState({ patients });
      });
    }
  }

  handlePatientClick(event, data) {
    event.preventDefault();
    const patient = this.state.patients.find((patient) => patient.id === data.id);
    this.props.handlePatientSelect(patient);
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

    // Allow the user to select the FHIR server, displayed only if we're not in SMART on FHIR mode
    const fhirServerFormField = (
      <Form.Field>
        <label>FHIR server:</label>
        <input type="text" name="fhirServer" value={this.props.fhirServer} onChange={this.handleFhirServerChange} />
      </Form.Field>
    );

    return (
      <div>
        <h3>Specify { this.props.smart ? '' : 'FHIR server and' } patient name to search for</h3>
        <Form onSubmit={this.handleSubmit}>
          { this.props.smart ? null : fhirServerFormField }
          <Form.Field>
            <label>Decedent name:</label>
            <input type="text" name="decedentName" value={this.state.decedentName} onChange={this.handleChange} />
          </Form.Field>
          <Button primary disabled={this.props.fhirServer === ''} type="submit">Search</Button>
        </Form>
        {patientLinks(this.state.patients)}
      </div>
    );
  }

}

export default PatientSearch;
