import moment from 'moment';
import _ from 'lodash';
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
    address.postalCode = postalCode;
  }
  return (address);
}

// TODO: Some of these code lookups could share code

function yesNoToCode(text) {
  const lookup = {
    'Yes': 'Y',
    'No': 'N'
  }
  const code = lookup[text];
  if (code) {
    return { code, text };
  } else {
    return null;
  }
}

function yesNoToBoolean(text) {
  const lookup = {
    'Yes': 'true',
    'No': 'false'
  }
  return lookup[text];
}

function mannerOfDeathToCode(text) {
  const lookup = {
    'Natural': '38605008',
    'Accident': '7878000',
    'Suicide': '44301001',
    'Homicide': '27935005',
    'Pending Investigation': '185973002',
    'Could not be determined': '65037004'
  }
  const code = lookup[text];
  if (code) {
    return { code, text };
  } else {
    return null;
  }
}

function pregnancyToCode(text) {
  const lookup = {
    'Not pregnant within past year': 'PHC1260',
    'Pregnant at time of death': 'PHC1261',
    'Not pregnant, but pregnant within 42 days of death': 'PHC1262',
    'Not pregnant, but pregnant 43 days to 1 year before death': 'PHC1263',
    'Unknown if pregnant within the past year': 'PHC1264'
  }
  const code = lookup[text];
  if (code) {
    return { code, text };
  } else {
    return null;
  }
}

function transportationRoleToCode(text) {
  const lookup = {
    'Vehicle driver': '236320001',
    'Passenger': '257500003',
    'Pedestrian': '257518000',
    'Other': 'OTH'
  }
  const code = lookup[text];
  if (code) {
    return { code, text };
  } else {
    return null;
  }
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
      maritalStatus: _.get(patient, 'resource.maritalStatus.coding[0].code')
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

  if (model.pregnancy) {
    options.decedentPregnancy = pregnancyToCode(model.pregnancy);
  }

  if (model.tobacco) {
    // TODO: The IG doesn't have a value set for this, just support Y and N for now
    options.tobaccoUseContributedToDeath = yesNoToCode(model.tobacco);
  }

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

  if (model.mannerOfDeath) {
    options.mannerOfDeath = mannerOfDeathToCode(model.mannerOfDeath);
  }

  if (model.autopsyPerformed) {
    options.autopsyPerformed = yesNoToCode(model.autopsyPerformed);
    if (model.autopsyAvailable) {
      options.autopsyPerformed.autopsyAvailable = yesNoToCode(model.autopsyAvailable);
    }
  }

  if (model.placeOfDeathName) {
    options.deathLocation = {
      name: model.placeOfDeathName,
      // TODO: currently ignores placeOfDeathApt
      address: formatAddress(model.placeOfDeathStreet, model.placeOfDeathCity, model.placeOfDeathCounty,
                             model.placeOfDeathStat, model.placeOfDeathZip),
      // TODO: These will likely change in the standard, so we'll hard code for now
      // TODO: This ignores the "Place of Death Type" in the form
      type: {
        code: 'HOSP',
        text: 'Hospital'
      },
      physicalType: {
        code: 'wa',
        text: 'Ward'
      }
    }
  }

  if (model.actualDeathDate) {
    options.deathDate = {
      effectiveDate: model.actualDeathDate,
      effectiveTime: model.actualDeathTime,
      method: {
        code: '414135002',
        text: 'Estimated'
      },
    }
  }
  if (model.pronouncedDeathDate) {
    options.deathDate = options.deathDate || {};
    options.deathDate.pronouncedDate = model.pronouncedDeathDate;
    options.deathDate.pronouncedTime = model.pronouncedDeathTime;
  }

  // deathPronouncementPerformer: {
  //   name: 'Death Pronouncer',
  //   qualification: {
  //     identifier: '4041603882',
  //     code: 'MD',
  //     text: 'Doctor of Medicine'
  //   }
  // },

  if (model.transportationInjury) {
    options.decedentTransportationRole = transportationRoleToCode(model.transportationInjury);
  }

  if (model.dateOfInjury) {
    debugger
    options.injuryIncident = {
      // TODO: Form doesn't include the text
      // text: 'Example injury description text',
      effectiveDate: model.dateOfInjury,
      effectiveTime: model.timeOfInjury
    }
    if (model.placeOfInjury) {
      options.injuryIncident.placeOfInjury = model.placeOfInjury;
    }
    if (model.injuryAtWork) {
      options.workInjuryIndicator = yesNoToCode(model.injuryAtWork);
    }
    // We use the presence of specific transportation info to determine yes or no
    options.transportationEventIndicator = yesNoToCode(model.transportationInjury ? 'Yes' : 'No');
  }

  if (model.howInjuryOccurred) {
    options.injuryLocation = {
      // TODO: Form doesn't include name of location
      // name: 'restaurant',
      description: model.howInjuryOccurred
    }
  }

  // TODO: Better handling of partial addresses
  if (model.locationOfInjuryState) {
    options.injuryLocation = options.injuryLocation || {};
    // TODO: Currently ignores placeOfDeathApt
    options.injuryLocation.address = formatAddress(model.locationOfInjuryStreet, model.locationOfInjuryCity, model.locationOfInjuryCounty,
                                                   model.locationOfInjuryState, model.placeOfDeathZip);
    // TODO: Form doesn't support type or physical type
    //   type: {
    //     code: 'PTRES',
    //     text: 'Patient\'s Residence'
    //   },
    //   physicalType: {
    //     code: 'ro',
    //     text: 'Room'
    //   }
  }

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

  if (model.contributing) {
    options.conditionContributingToDeath = {
      text: model.contributing
    }
  }

  if (model.examinerContacted) {
    options.examinerContacted = {
      value: yesNoToBoolean(model.examinerContacted)
    }
  }

  return (new DeathCertificateDocument(options));
}

export { recordAndPatientToFHIR };
