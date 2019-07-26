import { DeathCertificateDocument } from './FHIRExport2';

it('generates valid FHIR bundle', () => {

  const options = {
    deathCertificate: {
      identifier: 'example-death-certificate'
    },
    deathCertification: {
    },
    certifier: {
      name: 'Bob Certifier'
    },
    decedent: {
      name: 'Joe Decedent'
    }
  };

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});
