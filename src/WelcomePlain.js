import React, { Component } from 'react';
import { FHIRWrap } from './FHIRClientWrapper';
import PatientSearch from './PatientSearch';

const defaultFhirServer = 'https://syntheticmass.mitre.org/fhir';

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = { fhirServer: defaultFhirServer, decedentName: '' };
    this.handlePatientSelect = this.handlePatientSelect.bind(this);
    this.updateFhirServer = this.updateFhirServer.bind(this);
  }

  handlePatientSelect(patient) {
    FHIRWrap.loadResources(this.state.fhirServer, patient.id).then(([conditions, medications, procedures, observations]) => {
      this.props.setResources(conditions, medications, procedures, observations);
    });
    this.props.setPatient(patient);
    this.props.gotoStep('Pronouncing');
  }

  updateFhirServer(fhirServer) {
    this.setState({ fhirServer });
  }

  render() {
    return <PatientSearch handlePatientSelect={this.handlePatientSelect}
                          updateFhirServer={this.updateFhirServer}
                          fhirServer={this.state.fhirServer} />;
  }

}

export default Welcome;
