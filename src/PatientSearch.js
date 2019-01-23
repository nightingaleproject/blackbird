import React, { Component } from 'react';
import _ from 'lodash';
import { Form, Button, Loader, Card } from 'semantic-ui-react';
import { FHIRWrap, SMARTWrap } from './FHIRClientWrapper';
import StateStorage from './StateStorage';

class PatientSearch extends Component {

  constructor(props) {
    super(props);
    // See if we have state from previous use stored in local browser storage
    const searchState = StateStorage.retrieveState('statePatientSearch', { name: '', given: '', family: '' });
    this.state = Object.assign({}, searchState, { searching: false });
    this.handleChange = this.handleChange.bind(this);
    this.handleFhirServerChange = this.handleFhirServerChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePatientClick = this.handlePatientClick.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value }, () => {
      // Store search state in local browser storage to preserve between uses
      StateStorage.storeState('statePatientSearch', _.pick(this.state, ['name', 'given', 'family']));
    });
  }

  handleFhirServerChange(event) {
    this.props.updateFhirServer(event.target.value);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ patients: [], searching: true });
    const searchQuery = {};
    if (this.state.name.length > 0) {
      searchQuery.name = this.state.name;
    }
    if (this.state.given.length > 0) {
      searchQuery.given = this.state.given;
    }
    if (this.state.family.length > 0) {
      searchQuery.family = this.state.family;
    }
    // The search we use depends on whether we're in a SMART on FHIR context
    if (this.props.smart) {
      SMARTWrap.loadPatients(searchQuery).then((patients) => {
        this.setState({ patients, searching: false });
      });
    } else {
      FHIRWrap.loadPatients(this.props.fhirServer, searchQuery).then((patients) => {
        this.setState({ patients, searching: false });
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
      if (this.state.searching) {
        return <Loader active inline='centered' content='Loading' />;
      } else {
        if (!patients) {
          return null;
        } else if (patients.length === 0) {
          return "No Results Found";
        } else {
          return <Card.Group className='patients'>{patients.map(patientLink)}</Card.Group>;
        }
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
            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Decedent given name:</label>
            <input type="text" name="given" value={this.state.given} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Decedent family name:</label>
            <input type="text" name="family" value={this.state.family} onChange={this.handleChange} />
          </Form.Field>
          <Button primary disabled={this.props.fhirServer === ''} type="submit">Search</Button>
        </Form>
        {patientLinks(this.state.patients)}
      </div>
    );
  }

}

export default PatientSearch;
