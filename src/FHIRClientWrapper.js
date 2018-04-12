import Patient from './Patient';

// Wrap our usage of fhirclient with some simple utilities

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

const FHIRWrap = {

  // Given a FHIR server URL and a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients: (fhirServer, searchString) => {
    const smart = FHIR.client({ serviceUrl: fhirServer });
    const searchParams = { type: 'Patient' };
    if (searchString.length > 0) {
      searchParams.name = searchString;
    }
    return smart.api.search(searchParams).then((result) => {
      return result.data.entry.map((entry) => new Patient(entry.resource));
    });
  },

  // Given a FHIR server URL and a patient, returns a promise that provides the patient's
  // conditions, medications, procedures, and observations loaded from the server
  loadResources: (fhirServer, patient) => {
    const smart = FHIR.client({ serviceUrl: fhirServer });

    const getResources = (type) => {
      return smart.api.search({ type: type, query: { patient: patient.id } }).then((response) => {
        if (response.data.entry) {
          return response.data.entry.map((entry) => entry.resource);
        } else {
          return [];
        }
      });
    };

    return Promise.all([getResources('Condition'),
                        getResources('MedicationRequest'),
                        getResources('Procedure'),
                        getResources('Observation')]);
  }
}

const SMARTWrap = {
  // Return a promise that, if the app is loaded in a SMART context, provides the loaded
  // patient, conditions, medications, procedures, and observations
  load: () => {
    return new Promise((resolve, reject) => {
      FHIR.oauth2.ready((smart) => {
        smart.api.search({ type: 'Patient', query: { _id: smart.patient.id } }).then((result) => {
          const patient = new Patient(result.data.entry[0].resource);
          FHIRWrap.loadResources(smart.server.serviceUrl, patient).then(([conditions, medications, procedures, observations]) => {
            resolve([patient, conditions, medications, procedures, observations]);
          }).catch((e) => reject(e));
        });
      });
    });
  }
}

export { SMARTWrap, FHIRWrap };
