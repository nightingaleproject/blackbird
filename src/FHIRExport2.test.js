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
        line: [
          '998 Treutel River'
        ],
        city: 'Hyannis',
        district: 'Barnstable',
        state: 'Massachusetts',
        country: 'United States'
      }
    },
    decedent: {
      name: 'Joe Decedent',
      ssn: '123456789',
      birthSex: 'M',
      birthPlace: {
        city: 'Salem Neck',
        district: 'Essex',
        state: 'Massachusetts',
        country: 'United States'
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
    tobaccoUseContributedToDeath: {
      code: 'Y',
      text: 'Yes'
    },
    decedentEducationLevel: {
      code: 'GD',
      text: 'Graduate or professional Degree complete'
    },
    decedentEmploymentHistory: {
      militaryServiceCode: 'Y',
      militaryServiceText: 'Yes',
      usualIndustryCode: '1320',
      usualIndustryText: 'Aerospace engineers',
      usualOccupationCode: '7280',
      usualOccupationText: 'Accounting, tax preparation, bookkeeping, and payroll services'
    },
    birthRecordIdentifier: {
      certificateNumber: '54321',
      birthYear: '1915',
      birthState: 'MA'
    },
    mannerOfDeath: {
      code: '7878000',
      text: 'Accident'
    },
    mortician: {
      name: 'Jim Mortician',
      identifier: '98765'
    },
    funeralHome: {
      name: 'Funerals by Jim',
      address: {
        line: [
          '145 Hamill Mountains'
        ],
        city: 'Milford',
        district: 'Worcester',
        state: 'Massachusetts',
        country: 'United States'
      }
    },
    interestedParty: {
      identifier: '12345',
      typeCode: 'prov',
      typeDisplay: 'Healthcare Provider',
      name: 'The Healthcare Company',
      address: {
        line: [
          '839 Barrett Shoals'
        ],
        city: 'Norfolk Downs',
        district: 'Norfolk',
        state: 'Massachusetts',
        country: 'United States'
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
