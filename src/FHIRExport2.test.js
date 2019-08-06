import { DeathCertificateDocument } from './FHIRExport2';

it('generates valid FHIR bundle', () => {

  const options = {
    deathCertificate: {
      identifier: '1'
    },
    deathCertification: {
    },
    certifier: {
      name: 'Bob Certifier',
      address: {
      }
    },
    decedent: {
      name: 'Joe Decedent'
    },
    mortician: {
      name: 'Jim Mortician'
    }
  };

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});
