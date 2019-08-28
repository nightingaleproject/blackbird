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
    decedentAge: {
      unit: 'a', // Years
      value: '97'
    },
    decedentPregnancy: {
      code: 'PHC1260',
      text: 'Not pregnant within past year'
    },
    decedentTransportationRole: {
      code: '236320001',
      text: 'Vehicle driver'
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
      militaryService: {
        code: 'Y',
        text: 'Yes'
      },
      usualIndustry: {
        code: '1320',
        text: 'Aerospace engineers'
      },
      usualOccupation: {
        code: '7280',
        text: 'Accounting, tax preparation, bookkeeping, and payroll services'
      }
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
    autopsyPerformed: {
      code: 'Y',
      text: 'Yes',
      autopsyAvailable: {
        code: 'Y',
        text: 'Yes'
      }
    },
    deathLocation: {
      name: 'Example Hospital',
      description: 'Example Hospital Wing B',
      address: {
        line: [
          '241 Jordy Neck'
        ],
        city: 'Oak Grove',
        district: 'Middlesex',
        state: 'Massachusetts',
        country: 'United States'
      },
      type: {
        code: 'HOSP',
        text: 'Hospital'
      },
      physicalType: {
        code: 'wa',
        text: 'Ward'
      }
    },
    deathDate: {
      effectiveDate: '2019-01-01',
      effectiveTime: '11:15',
      comment: 'Example comment text',
      method: {
        code: '414135002',
        text: 'Estimated'
      },
      pronouncedDate: '2019-01-01',
      pronouncedTime: '9:00'
    },
    injuryIncident: {
      text: 'Example injury description text',
      effectiveDate: '2019-01-01',
      effectiveTime: '11:15',
      placeOfInjury: 'Decedent\'s home',
      transportationEventIndicator: {
        code: 'Y',
        text: 'Yes'
      },
      workInjuryIndicator: {
        code: 'N',
        text: 'No'
      }
    },
    injuryLocation: {
      name: 'restaurant',
      description: 'Shot by another person using a handgun',
      address: {
        line: [
          '85 Anais Street'
        ],
        city: 'Mount Hope',
        district: 'Suffolk',
        state: 'Massachusetts',
        country: 'United States'
      },
      type: {
        code: 'PTRES',
        text: 'Patient\'s Residence'
      },
      physicalType: {
        code: 'ro',
        text: 'Room'
      }
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
    dispositionLocation: {
      name: 'Harber Cemetery',
      address: {
        city: 'Mount Bowdoin',
        district: 'Suffolk',
        state: 'Massachusetts',
        country: 'United States'
      }
    },
    decedentDispositionMethod: {
      code: '449971000124106',
      text: 'Burial'
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
    ],
    conditionContributingToDeath: {
      text: 'Example Contributing Condition'
    },
    examinerContacted: {
      value: false
    }
  };

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});

it('generates valid FHIR bundle to replace TRANSAX format', () => {

  const options = {
    identifier: '123',
    deathCertificate: {
      identifier: '321'
    },
    deathCertification: {
    },
    causeOfDeathConditions: [
      { code: 'I251' },
      { code: 'I259' },
      { code: 'I250' }
    ]
  }

  const document = new DeathCertificateDocument(options);

  console.warn(JSON.stringify(document, null, 2));

});
