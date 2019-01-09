import React, { Component } from 'react';
import { SMARTWrap } from './FHIRClientWrapper';
import PatientSearch from './PatientSearch';

class StandalonePatientSearch extends Component {

  constructor(props) {
    super(props);
    this.state = { fhirServer: '', decedentName: '' };
    this.handlePatientSelect = this.handlePatientSelect.bind(this);
  }

  componentWillMount() {
    SMARTWrap.ready().then((smart) => {
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
