import moment from 'moment';
import { DeathCertificateDocument } from './FHIRExport2';

it('generates valid FHIR bundle', () => {

  const options = {
    identifier: '123',
    deathCertificate: {
      identifier: '321'
    },
    deathCertification: {
      performedDate: '2019-01-01',
      performedTime: '11:15'
    },
    certifier: {
      name: 'Bob Certifier',
      address: {
        city: 'Bedford'
      }
    },
    decedent: {
      name: 'Joe Decedent',
      ssn: '123456789',
      birthSex: 'M',
      birthPlace: {
        city: 'Bedford'
      },
      gender: 'male',
      birthDate: '1920-01-01',
      maritalStatus: 'M',
      ethnicity: { text: 'Not Hispanic or Latino', code: '2186-5' },
      race: [
        { type: 'ombCategory', text: 'White', code: '2106-3' },
        { type: 'detailed', text: 'French', code: '2111-3' }
      ]
    },
    decedentFather: {
      name: 'Dad Decedent'
    },
    decedentMother: {
      name: 'Mom Decedent'
    },
    decedentSpouse: {
      name: 'Spouse Decedent'
    },
    mortician: {
      name: 'Jim Mortician'
    },
    funeralHome: {
      name: 'Funerals by Jim',
      address: {
        city: 'Bedford'
      }
    },
    interestedParty: {
      identifier: '12345',
      typeCode: 'prov',
      typeDisplay: 'Healthcare Provider',
      name: 'The Healthcare Company',
      address: {
        city: 'Bedford'
      }
    },
    causeOfDeathConditions: [
      { text: 'Example Cause Of Death 1', interval: '1 week' },
      { text: 'Example Cause Of Death 2', interval: '1 year' }
    ]
  };

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});
