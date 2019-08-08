import moment from 'moment';
import { DeathCertificateDocument } from './FHIRExport2';

it('generates valid FHIR bundle', () => {

  const options = {
    deathCertificate: {
      identifier: '1'
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
      birthsex: 'M',
      birthplace: {
        city: 'Bedford'
      }
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
    }
  };

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});
