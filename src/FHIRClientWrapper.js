import Patient from './Patient';
import Practitioner from './Practitioner';
import Resource from './Resource';

// Wrap our usage of fhirclient with some simple utilities

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

const FHIRWrap = {

  // Given a FHIR server URL and a search string (which can be blank), returns a promise
  // that provides a list of patients loaded from the server
  loadPatients(fhirServer, searchString) {
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
  loadResources(fhirServer, patientId) {
    const smart = FHIR.client({ serviceUrl: fhirServer });

    const getResources = (type) => {
      return smart.api.search({ type: type, query: { patient: patientId } }).then((response) => {
        if (response.data.entry) {
          return response.data.entry.map((entry) => new Resource(entry.resource));
        } else {
          return [];
        }
      });
    };

    // TODO: SUPER CRAZY HACK, REFACTOR INTO THE RIGHT WAY...
    // MedicationRequests might have information on which medication in a separate resource
    const getMedicationRequests = () => {

      return getResources('MedicationRequest').then((medicationRequests) => {

        const medicationRequestPromises = medicationRequests.map((medicationRequest) => {

          if (medicationRequest.resource.medicationReference) {
            const medicationId = medicationRequest.resource.medicationReference.reference.split('/')[1];
            return smart.api.read({ type: 'Medication', id: medicationId }).then((response) => {
              medicationRequest.medication = response.data;
              return medicationRequest;
            });
          } else {
            return Promise.resolve(medicationRequest);
          }

        });

        return Promise.all(medicationRequestPromises);
      });

    };

    const medicationRequests2 = new Promise((resolve) => {
      getMedicationRequests().then((mrs) => {
        mrs.then((mrs2) => {
          resolve(mrs2)
        });
      });
    });

    return Promise.all([getResources('Condition'),
                        medicationRequests2,
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
        const user = smart.user.read();
        const patient = smart.patient.read();
        const resources = FHIRWrap.loadResources(smart.server.serviceUrl, smart.patient.id);
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
