import React, { Component } from 'react';
import { FHIRWrap } from './FHIRClientWrapper';
import PatientSearch from './PatientSearch';
import StateStorage from './StateStorage';

const defaultFhirServer = 'https://syntheticmass.mitre.org/fhir';

class Welcome extends Component {

  constructor(props) {
    super(props);
    // See if we have state from previous use stored in local browser storage
    this.state = StateStorage.retrieveState('stateWelcomePlain', { fhirServer: defaultFhirServer });
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
    // Store state in local browser storage to preserve between uses
    this.setState({ fhirServer }, () => StateStorage.storeState('stateWelcomePlain', this.state));
  }

  render() {
    return <PatientSearch handlePatientSelect={this.handlePatientSelect}
                          updateFhirServer={this.updateFhirServer}
                          fhirServer={this.state.fhirServer} />;
  }

}

export default Welcome;
