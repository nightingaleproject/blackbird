import Patient from './Patient';
import Practitioner from './Practitioner';
import Resource from './Resource';
import _ from 'lodash';
import moment from 'moment';

// Wrap our usage of fhirclient with some simple utilities

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

const FHIRWrap = {

  // Given a serviceUrl, return the SMART client context
  client(fhirServer) {
    return FHIR.client({ serviceUrl: fhirServer });
  },

  // Given a SMART context and a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(smart, searchString) {
    const searchParams = { type: 'Patient' };
    if (searchString.length > 0) {
      searchParams.name = searchString;
    }
    return smart.api.search(searchParams).then((result) => {
      const entriesWithNames = result.data.entry.filter((entry) => entry.resource && entry.resource.name)
      return entriesWithNames.map((entry) => new Patient(entry.resource));
    });
  },

  // Given a SMART context and a patient, returns a promise that provides the patient's
  // conditions, medications, procedures, and observations loaded from the server
  loadResources(smart, patientId) {
    const getResources = (type) => {
      // We need to wrap the results of smart.api.search with a real promise, using the jQuery
      // promise directly results in unexpected behavior
      return new Promise((resolve) => {
        return smart.api.search({ type: type, query: { patient: patientId } }).then((response) => {
          // Handle several possible cases:
          //   1) FHIR server returns an entry array but a total of 0 (it's reporting an error)
          //   2) FHIR server returns an entry array and no total (this is probably valid)
          //   3) FHIR server returns an entry array and a total (this is probably valid)
          if (response.data.entry && (!response.data.hasOwnProperty('total') || response.data.total > 0)) {
            const resources = response.data.entry.map((entry) => Resource.wrap(entry.resource));
            resolve(_.sortBy(resources, (resource) => moment(resource.startDate)).reverse());
          } else {
            resolve([]);
          }
        }, () => {
          // TODO: Determine appropriate behavior for failed resource load
          console.log(`Request for resource ${type} failed`);
          resolve([]);
        });
      });
    };

    // MedicationRequests might have information on which medication in a separate resource
    const withMedications = (medicationRequests) => {
      return Promise.all(medicationRequests.map((medicationRequest) => medicationRequest.withMedication(smart)));
    }

    return Promise.all([getResources('Condition'),
                        getResources('MedicationRequest').then(withMedications),
                        getResources('Procedure'),
                        getResources('Observation')]);
  }
}

const SMARTWrap = {
  // Return a promise that, if the app is loaded in a SMART context, provides the loaded
  // user, patient, conditions, medications, procedures, and observations
  load() {
    return new Promise((resolve, reject) => {
      FHIR.oauth2.ready((smart) => {
        // fhirclient does not gracefully handle failure in reading a user if none provided by smart context
        let user = {};
        if (smart.userId) {
          user = smart.user.read();
        }
        const patient = smart.patient.read();
        const resources = FHIRWrap.loadResources(smart, smart.patient.id);
        Promise.all([user, patient, resources]).then(([user, patient, resources]) => {
          patient = new Patient(patient);
          user = new Practitioner(user);
          resolve([user, patient].concat(resources));
        }).catch((e) => reject(e));
      });
    });
  }
}

export { SMARTWrap, FHIRWrap };
