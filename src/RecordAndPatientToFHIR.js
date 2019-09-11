import moment from 'moment';
import { DeathCertificateDocument } from './FHIRExport';

// Utility functions

function formatAddress(street, city, county, state, postalCode) {
  const address = {};
  if (street) {
    address.line = [street];
  }
  if (city) {
    address.city = city;
  }
  if (county) {
    address.county = county;
  }
  if (state) {
    address.state = state;
  }
  if (postalCode) {
    address.postelCode = postalCode;
  }
  return (address);
}

function appendCOD(array, text, interval) {
  if (text && interval) {
    array.push({ text, interval });
  } else if (text) {
    array.push({ text });
  }
}

// Given the data structure used to store document state (the "record" object defined in App.js) and a FHIR
// patient record, produce a FHIR VRDR mortality record for the decedent

function recordAndPatientToFHIR(model, patient) {

  // TODO: Consider using this "options" structure as the application's internal data structure, and adding
  // convenience methods for setting/getting (perhaps through redux)

  // TODO: I think we need this intermediary structure because of cross-referencing that needs to happen when
  // the FHIR structure is being built, but we should explore if the underlying FHIR structure can simply be
  // built with these convenience methods

  const options = {};

  options.deathCertificate = {};

  options.deathCertification = {
    performedDate: moment().format('YYYY-MM-DD'),
    performedTime: moment().format('HH:mm')
  };

  if (model.certifierName) {
    options.certifier = {
      name: model.certifierName,
      address: formatAddress(model.certifierStreet, model.certifierCity, model.certifierCounty,
                             model.certifierState, model.certifierZip)
    }
  }

  if (patient) {
    options.decedent = {
      name: patient.name,
      birthPlace: patient.resource.birthPlace,
      gender: patient.resource.gender,
      birthDate: patient.resource.birthDate,
      maritalStatus: patient.resource.maritalStatus,
      //ethnicity: { text: 'Not Hispanic or Latino', code: '2186-5' },
      //race: [
      //  { type: 'ombCategory', text: 'White', code: '2106-3' },
      //  { type: 'detailed', text: 'French', code: '2111-3' }
      //]
    }
  }

  // decedentAge: {
  //   unit: 'a', // Years
  //   value: '97'
  // },
  // decedentPregnancy: {
  //   code: 'PHC1260',
  //   text: 'Not pregnant within past year'
  // },
  // decedentTransportationRole: {
  //   code: '236320001',
  //   text: 'Vehicle driver'
  // },
  // tobaccoUseContributedToDeath: {
  //   code: 'Y',
  //   text: 'Yes'
  // },
  // decedentEducationLevel: {
  //   code: 'GD',
  //   text: 'Graduate or professional Degree complete'
  // },
  // decedentEmploymentHistory: {
  //   militaryService: {
  //     code: 'Y',
  //     text: 'Yes'
  //   },
  //   usualIndustry: {
  //     code: '1320',
  //     text: 'Aerospace engineers'
  //   },
  //   usualOccupation: {
  //     code: '7280',
  //     text: 'Accounting, tax preparation, bookkeeping, and payroll services'
  //   }
  // },
  // birthRecordIdentifier: {
  //   certificateNumber: '2208471975',
  //   birthYear: '1915',
  //   birthState: 'MA'
  // },
  // mannerOfDeath: {
  //   code: '7878000',
  //   text: 'Accident'
  // },
  // autopsyPerformed: {
  //   code: 'Y',
  //   text: 'Yes',
  //   autopsyAvailable: {
  //     code: 'Y',
  //     text: 'Yes'
  //   }
  // },
  // deathLocation: {
  //   name: 'Example Hospital',
  //   description: 'Example Hospital Wing B',
  //   address: {
  //     line: [
  //       '241 Jordy Neck'
  //     ],
  //     city: 'Oak Grove',
  //     district: 'Middlesex',
  //     state: 'Massachusetts',
  //     country: 'United States'
  //   },
  //   type: {
  //     code: 'HOSP',
  //     text: 'Hospital'
  //   },
  //   physicalType: {
  //     code: 'wa',
  //     text: 'Ward'
  //   }
  // },
  // deathDate: {
  //   effectiveDate: record.actualDeathDate,
  //   effectiveTime: actualDeathTime,
  //   // comment: 'Example comment text',
  //   //method: {
  //   //  code: '414135002',
  //   //  text: 'Estimated'
  //   //},
  //   pronouncedDate: record.pronouncedDeathDate,
  //   pronouncedTime: record.pronouncedDeathTime
  // },
  // deathPronouncementPerformer: {
  //   name: 'Death Pronouncer',
  //   qualification: {
  //     identifier: '4041603882',
  //     code: 'MD',
  //     text: 'Doctor of Medicine'
  //   }
  // },
  // injuryIncident: {
  //   text: 'Example injury description text',
  //   effectiveDate: '2019-01-01',
  //   effectiveTime: '11:15',
  //   placeOfInjury: 'Decedent\'s home',
  //   transportationEventIndicator: {
  //     code: 'Y',
  //     text: 'Yes'
  //   },
  //   workInjuryIndicator: {
  //     code: 'N',
  //     text: 'No'
  //   }
  // },
  // injuryLocation: {
  //   name: 'restaurant',
  //   description: 'Shot by another person using a handgun',
  //   address: {
  //     line: [
  //       '85 Anais Street'
  //     ],
  //     city: 'Mount Hope',
  //     district: 'Suffolk',
  //     state: 'Massachusetts',
  //     country: 'United States'
  //   },
  //   type: {
  //     code: 'PTRES',
  //     text: 'Patient\'s Residence'
  //   },
  //   physicalType: {
  //     code: 'ro',
  //     text: 'Room'
  //   }
  // },
  // mortician: {
  //   name: 'Jim Mortician',
  //   qualification: {
  //     identifier: '3522912928'
  //   }
  // },
  // funeralHome: {
  //   name: 'Funerals by Jim',
  //   address: {
  //     line: [
  //       '145 Hamill Mountains'
  //     ],
  //     city: 'Milford',
  //     district: 'Worcester',
  //     state: 'Massachusetts',
  //     country: 'United States'
  //   }
  // },
  // funeralHomeDirector: {
  // },
  // dispositionLocation: {
  //   name: 'Harber Cemetery',
  //   address: {
  //     city: 'Mount Bowdoin',
  //     district: 'Suffolk',
  //     state: 'Massachusetts',
  //     country: 'United States'
  //   }
  // },
  // decedentDispositionMethod: {
  //   code: '449971000124106',
  //   text: 'Burial'
  // },
  // interestedParty: {
  //   identifier: '8032275691',
  //   typeCode: 'prov',
  //   typeDisplay: 'Healthcare Provider',
  //   name: 'The Healthcare Company',
  //   address: {
  //     line: [
  //       '839 Barrett Shoals'
  //     ],
  //     city: 'Norfolk Downs',
  //     district: 'Norfolk',
  //     state: 'Massachusetts',
  //     country: 'United States'
  //   }
  // },
  
  const causeOfDeathConditions = [];
  appendCOD(causeOfDeathConditions, model.cod1Text, model.cod1Time);
  appendCOD(causeOfDeathConditions, model.cod2Text, model.cod2Time);
  appendCOD(causeOfDeathConditions, model.cod3Text, model.cod3Time);
  appendCOD(causeOfDeathConditions, model.cod4Text, model.cod4Time);
  if (causeOfDeathConditions.length > 0) {
    options.causeOfDeathConditions = causeOfDeathConditions;
  }

  // conditionContributingToDeath: {
  //   text: 'Example Contributing Condition'
  // },
  // examinerContacted: {
  //   value: record.examinerContacted
  // }

  return (new DeathCertificateDocument(options));
}

export { recordAndPatientToFHIR };
