import React, { Component } from 'react';
import { SMARTWrap } from './FHIRClientWrapper';
import PatientSearch from './PatientSearch';

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

class StandalonePatientSearch extends Component {

  constructor(props) {
    super(props);
    this.state = { fhirServer: '', decedentName: '' };
    this.handlePatientSelect = this.handlePatientSelect.bind(this);
  }

  componentWillMount() {
    FHIR.oauth2.ready((smart) => {
      this.setState({ fhirServer: smart.server.serviceUrl });
    });
  }

  handlePatientSelect(patient) {
    SMARTWrap.loadResources(patient.id).then(([conditions, medications, procedures, observations]) => {
      this.props.setResources(conditions, medications, procedures, observations);
    });
    this.props.setPatient(patient);
    this.props.gotoStep('Pronouncing');
  }

  render() {
    return <PatientSearch smart handlePatientSelect={this.handlePatientSelect} fhirServer={this.state.fhirServer} />;
  }

}

export default StandalonePatientSearch;
