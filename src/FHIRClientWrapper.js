import Patient from './Patient';
import Practitioner from './Practitioner';
import Resource from './Resource';
import _ from 'lodash';
import moment from 'moment';

// Wrap our usage of fhirclient with some simple utilities

// fhirclient doesn't seem to play nice with create-react-app: it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient/dist'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

// Wrap the oauth ready functionality, providing the SMART context, both so that we don't need
// the fhirclient load hack in more than one place and so we can wrap it in a promise
const smartReady = () => {
  return new Promise((resolve) => {
    FHIR.oauth2.ready((smart) => {
      resolve(smart)
    });
  });
}

// Some common functions for both basic FHIR and within a SMART context

// Given a SMART context and a search string (which can be blank), returns a promise
// that provides a list of patients loaded from the server
const loadPatients = (smart, searchString) => {
  const searchParams = { type: 'Patient' };
  if (searchString.length > 0) {
    searchParams.query = { name: searchString };
  }
  return smart.api.search(searchParams).then((response) => {
    if (response.data && response.data.entry) {
      return response.data.entry.map((entry) => new Patient(entry.resource));
    } else {
      return [];
    }
  });
}

const loadResources = (smart, patientId) => {
  const getResources = (type) => {
    // We need to wrap the results of smart.api.search with a real promise, using the jQuery
    // promise directly results in unexpected behavior
    return new Promise((resolve) => {
      return smart.api.search({ type: type, query: { patient: patientId } }).then((response) => {
        if (response.data.entry) {
          const resources = response.data.entry.map((entry) => Resource.wrap(entry.resource));
          resolve(_.sortBy(resources, (resource) => moment(resource.startDate)).reverse());
        } else {
          resolve([]);
        }
      }, (error) => {
        resolve([]); // Eat errors for the moment
      });
    });
  };

  // MedicationRequests might have information on which medication in a separate resource
  const withMedications = (medicationRequests) => {
    return Promise.all(medicationRequests.map((medicationRequest) => medicationRequest.withMedication(smart)));
  };

  // TODO: Document or refactor
  const withPrescribers = (medicationOrders) => {
    return Promise.all(medicationOrders.map((medicationOrder) => medicationOrder.withEmbeddedResource('prescriber', smart)));
  }

  // Utility function: resolve an array of promises with the first promise that resolves with a non-empty
  // result; we use this to support either MedicationRequest or MedicationOrder
  const any = (promises) => {
    return new Promise((resolve) => {
      Promise.all(promises).then((results) => {
        for (const result of results) {
          if (result.length > 0) {
            resolve(result)
          }
        }
        resolve([]);
      });
    });
  }

  return Promise.all([getResources('Condition'),
                      any([getResources('MedicationRequest').then(withMedications),
                           getResources('MedicationOrder').then(withPrescribers)]),
                      getResources('Procedure'),
                      getResources('Observation')]);
}


const FHIRWrap = {

  // Given a FHIR server URL and a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(fhirServer, searchString) {
    const smart = FHIR.client({ serviceUrl: fhirServer });
    return loadPatients(smart, searchString);
  },

  // Given a FHIR server URL and a patient, returns a promise that provides the patient's
  // conditions, medications, procedures, and observations loaded from the server
  loadResources(fhirServer, patientId) {
    const smart = FHIR.client({ serviceUrl: fhirServer });
    return loadResources(smart, patientId);
  }
}

const SMARTWrap = {

  // Wrap the oauth ready functionality so that we don't need the fhirclient load hack in more than one place
  ready() {
    return smartReady();
  },

  // Wrap the oauth authorize functionality too
  authorize(settings) {
    FHIR.oauth2.authorize(settings);
  },

  // Given a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(searchString) {
    return smartReady().then((smart) => {
      return loadPatients(smart, searchString)
    });
  },

  // Given a patient, returns a promise that provides the patient's conditions,
  // medications, procedures, and observations loaded from the server
  loadResources(patientId) {
    return smartReady().then((smart) => {
      return loadResources(smart, patientId)
    });
  },

  // Return a promise that, if the app is loaded in a SMART context, provides the loaded
  // user, patient, conditions, medications, procedures, and observations
  load() {
    return smartReady().then((smart) => {
      const user = smart.user.read();
      const patient = smart.patient.read();
      const resources = FHIRWrap.loadResources(smart.server.serviceUrl, smart.patient.id);
      return Promise.all([user, patient, resources]).then(([user, patient, resources]) => {
        patient = new Patient(patient);
        user = new Practitioner(user);
        return [user, patient].concat(resources);
      });
    });
  }
}

export { SMARTWrap, FHIRWrap };
