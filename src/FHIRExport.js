import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';

// Infrastructure for creating FHIR death records based on the profile at
// https://nightingaleproject.github.io/fhir-death-record/guide/index.html

// Begin with classes to represent the core FHIR resources and types that are used to build a death record

class Base {
  constructor(options = {}) {
    Object.assign(this, options);
  }
  addExtension(extension) {
    this.extension = this.extension || [];
    this.extension.push(extension);
  }
  setProfile(profile) {
    this.meta = { profile };
  }
}

class Bundle extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Bundle';
  }
  addEntry(resource) {
    this.entry = this.entry || [];
    const entry = {
      fullUrl: `urn:uuid:${uuid()}`,
      resource: resource
    }
    this.entry.push(entry);
    return entry;
  }
}

class Composition extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Composition';
  }
}

class Condition extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Condition';
  }
}

class Observation extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Observation';
    this.status = 'final';
  }
}

class Practitioner extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Practitioner';
  }
  addName(name) {
    this.name = this.name || [];
    this.name.push(new HumanName(name));
  }
}

class Patient extends Base {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Patient';
  }
  addName(name) {
    this.name = this.name || [];
    this.name.push(new HumanName(name));
  }
}

class CodeableConcept {
  constructor(system, code, display) {
    if (system) {
      this.coding = [{ system, code, display }];
    } else {
      this.coding = [{ code, display }];
    }
    this.text = display;
  }
}

class HumanName {
  constructor(name, use) {
    // Start with a simple decomposition
    // TODO: This won't hold up to more complex examples with prefixes and suffixes
    const match = name.match(/(.+)\s+(\S+)/);
    this.given = match[1].split(/\s+/);
    this.family = match[2];
    this.use = 'official';
  }
}

class Address {
  constructor(address) {
    this.type = 'postal';
    Object.assign(this, address);
  }
}

// Classes to represent specific components of the death record

class DeathRecordContents extends Composition {
  constructor(options = {}) {
    super(options);
    this.type = new CodeableConcept('http://loinc.org', '64297-5', 'Death certificate');
    this.status = 'final';
    this.date = moment().format('YYYY-MM-DD');
    this.title = 'Record of Death';
    this.section = [{
      code: new CodeableConcept('http://loinc.org', '69453-9', 'Cause of death')
    }];
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-DeathRecordContents');
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
  addCertifierReference(certifierEntry) {
    this.author = [{ reference: certifierEntry.fullUrl }];
  }
  addReference(entry) {
    this.section[0].entry = this.section[0].entry || [];
    this.section[0].entry.push({ reference: entry.fullUrl });
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    const local = ['name', 'birthDate', 'deceasedDateTime', 'address', 'gender', 'ssn', 'servedInArmedForces', 'birthSex'];

    // TODO: Missing fields (we only need to implement the ones where we have data from our test patients):
    // race, ethnicity, ageAtDeath (derive), placeOfBirth, maritalStatus, placeOfDeath, disposition,
    // education, occupation, motherMaidenName

    // We can get: race, ethnicity, birthPlace, mothersMaidenName, birthSex, ssn, gender, birthDate,
    // deceasedDateTime (user supplied, not from record!), address, maritalStatus

    // TODO: Where is support for father's name in profile?

    super(_.omit(options, local));
    if (options.name) {
      this.addName(options.name);
    }
    if (options.birthDate) {
      this.birthDate = options.birthDate;
    }
    if (options.deceasedDateTime) {
      this.deceasedDateTime = options.deceasedDateTime;
    }
    if (options.address) {
      this.address = [new Address(options.address)];
    }
    if (options.gender) {
      this.gender = options.gender;
    }
    if (options.ssn) {
      this.identifier = [{
        system: 'http://hl7.org/fhir/sid/us-ssn',
        value: options.ssn
      }];
    }
    if (!_.isNil(options.servedInArmedForces)) {
      this.addExtension({
        url: 'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-decedent-ServedInArmedForces-extension',
        valueBoolean: options.servedInArmedForces
      });
    }
    if (options.birthSex) {
      this.addExtension({
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCode: options.birthSex
      });
    }
    this.setProfile([
      'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-decedent-Decedent',
      'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'
    ]);
  }
}

class Certifier extends Practitioner {
  constructor(options = {}) {
    const local = ['name', 'certifierType', 'identifier', 'address'];
    super(_.omit(options, local));
    if (options.name) {
      this.addName(options.name);
    }
    const certifierCodeLookup = {
      'Physician (Certifier)': '434641000124105',
      'Physician (Pronouncer and Certifier)': '434651000124107',
      'Coroner': '310193003',
      'Medical Examiner': '440051000124108'
    };
    const certifierCode = certifierCodeLookup[options.certifierType];
    if (certifierCode) {
      this.addExtension({
        url: 'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-CertifierType-extension',
        valueCodeableConcept: new CodeableConcept('http://snomed.info/sct', certifierCode, options.certifierType)
      });
    }
    if (options.identifier) {
      this.identifier = [{
        use: 'official',
        value: options.identifier
      }];
    }
    if (options.address) {
      this.address = [new Address(options.address)];
    }
    // Assuming MD by default, TODO: Investigate how to better capture this
    this.qualification = {
      code: new CodeableConcept('http://hl7.org/fhir/v2/0360/2.7', 'MD', 'Doctor of Medicine')
    }
    this.setProfile([
      'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-Certifier',
      'http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner'
    ]);
  }
}

class CauseOfDeath extends Condition {
  constructor(literalText, onsetString, subjectEntry) {
    super();
    this.clinicalStatus = 'active';
    this.text = {
      status: 'additional',
      div: `<div xmlns='http://www.w3.org/1999/xhtml'>${literalText}</div>`
    };
    this.onsetString = onsetString;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-CauseOfDeathCondition');
  }
}

class ActualOrPresumedDateOfDeath extends Observation {
   constructor(value, subjectEntry) {
     super();
     this.code = new CodeableConcept('http://loinc.org', '81956-5', 'Date and time of death');
     this.valueDateTime = value;
     this.subject = { reference: subjectEntry.fullUrl };
     this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-ActualOrPresumedDateOfDeath');
   }
}

class AutopsyPerformed extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '85699-7', 'Autopsy was performed');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-AutopsyPerformed');
  }
}

class AutopsyResultsAvailable extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69436-4', 'Autopsy results available');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-AutopsyResultsAvailable');
  }
}

class DatePronouncedDead extends Observation {
   constructor(value, subjectEntry) {
     super();
     this.code = new CodeableConcept('http://loinc.org', '80616-6', 'Date and time pronounced dead');
     this.valueDateTime = value;
     this.subject = { reference: subjectEntry.fullUrl };
     this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DatePronouncedDead');
   }
}

class DeathFromWorkInjury extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69444-8', 'Did death result from injury at work');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DeathFromWorkInjury');
  }
}

class InjuryAssociatedWithTransport extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69448-9', 'Injury leading to death associated with transportation event');
    switch (value) {
    case 'Vehicle driver':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '236320001', value);
      break;
    case 'Passenger':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '257500003', value);
      break;
    case 'Pedestrian':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '257518000', value);
      break;
    case 'Other':
      this.valueCodeableConcept = new CodeableConcept('http://hl7.org/fhir/v3/NullFlavor', 'OTH', value);
      break;
    default:
      throw new Error(`InjuryAssociatedWithTransport ${value} not in value set`);
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DeathFromTransportInjury');
  }
}

class DetailsOfInjury extends Observation {
  constructor(details, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '11374-6', 'Injury incident description');
    this.valueString = details.value;
    // TODO: need to sensibly handle null values
    this.effectiveDateTime = details.effectiveDateTime;
    if (details.placeOfInjury) {
      this.extension = this.extension || [];
      this.extension.push({
        url: 'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-PlaceOfInjury-extension',
        valueString: details.placeOfInjury
      });
    }
    if (details.address) {
      this.extension = this.extension || [];
      this.extension.push({
        url: 'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/shr-core-PostalAddress-extension',
        valueAddress: new Address(details.address)
      });
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DetailsOfInjury');
  }
}

class MannerOfDeath extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69449-7', 'Manner of death');
    switch (value) {
    case 'Natural':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '38605008', value);
      break;
    case 'Accident':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '7878000', value);
      break;
    case 'Suicide':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '44301001', value);
      break;
    case 'Homicide':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '27935005', value);
      break;
    case 'Pending Investigation':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '185973002', value);
      break;
    case 'Could not be determined':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '65037004', value);
      break;
    default:
      throw new Error(`MannerOfDeath ${value} not in value set`);
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-MannerOfDeath');
  }
}

class MedicalExaminerOrCoronerContacted extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '74497-9', 'Medical examiner or coroner was contacted');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-MedicalExaminerContacted');
  }
}

class TimingOfPregnancy extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69442-2', 'Timing of recent pregnancy in relation to death');
    switch (value) {
    case 'Not pregnant within past year':
      this.valueCodeableConcept = new CodeableConcept(null, 'PHC1260', value);
      break;
    case 'Pregnant at time of death':
      this.valueCodeableConcept = new CodeableConcept(null, 'PHC1261', value);
      break;
    case 'Not pregnant, but pregnant within 42 days of death':
      this.valueCodeableConcept = new CodeableConcept(null, 'PHC1262', value);
      break;
    case 'Not pregnant, but pregnant 43 days to 1 year before death':
      this.valueCodeableConcept = new CodeableConcept(null, 'PHC1263', value);
      break;
    case 'Unknown if pregnant within the past year':
      this.valueCodeableConcept = new CodeableConcept(null, 'PHC1264', value);
      break;
    default:
      throw new Error(`TimingOfPregnancy ${value} not in value set`);
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-TimingOfRecentPregnancyInRelationToDeath');
  }
}

class TobaccoUseContributedToDeath extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodeableConcept('http://loinc.org', '69443-0', 'Did tobacco use contribute to death');
    switch (value) {
    case 'Yes':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '373066001', value);
      break;
    case 'No':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '373067005', value);
      break;
    case 'Probably':
      this.valueCodeableConcept = new CodeableConcept('http://snomed.info/sct', '2931005', value);
      break;
    case 'Unknown':
      this.valueCodeableConcept = new CodeableConcept('http://hl7.org/fhir/v3/NullFlavor', 'UNK', value);
      break;
    default:
      throw new Error(`TobaccoUseContributedToDeath ${value} not in value set`);
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-TobaccoUseContributedToDeath');
  }
}

// Top level class to represent the Death Record, which provides the basic interface for creating itself

class DeathRecord extends Bundle {
  constructor(options = {}) {
    // Figure out what options we'll handle locally and pass the rest up
    const local = ['decedent', 'certifier', 'causeOfDeath', 'actualOrPresumedDateOfDeath', 'autopsyPerformed',
                   'autopsyResultsAvailable', 'datePronouncedDead', 'deathFromWorkInjury', 'injuryAssociatedWithTransport',
                   'detailsOfInjury', 'mannerOfDeath', 'medicalExaminerOrCoronerContacted', 'timingOfPregnancy',
                   'tobaccoUseContributedToDeath'];
    super(_.omit(options, local));

    // Indicate that this Bundle is a document
    this.type = 'document';

    // Create the Composition that tracks all the entries
    const deathRecordContents = new DeathRecordContents();
    this.addEntry(deathRecordContents);

    // Add the decedent and certifier information
    const decedentEntry = this.addDecedent(options.decedent, deathRecordContents);
    this.addCertifier(options.certifier, deathRecordContents);

    // Add the cause of death information
    options.causeOfDeath = options.causeOfDeath || [];
    options.causeOfDeath.forEach((cod) => this.addCauseOfDeath(cod.literalText, cod.onsetString, deathRecordContents, decedentEntry));

    // Add all the observations
    this.addObservation(options.actualOrPresumedDateOfDeath, ActualOrPresumedDateOfDeath, deathRecordContents, decedentEntry);
    this.addObservation(options.autopsyPerformed, AutopsyPerformed, deathRecordContents, decedentEntry);
    this.addObservation(options.autopsyResultsAvailable, AutopsyResultsAvailable, deathRecordContents, decedentEntry);
    this.addObservation(options.datePronouncedDead, DatePronouncedDead, deathRecordContents, decedentEntry);
    this.addObservation(options.deathFromWorkInjury, DeathFromWorkInjury, deathRecordContents, decedentEntry);
    this.addObservation(options.injuryAssociatedWithTransport, InjuryAssociatedWithTransport, deathRecordContents, decedentEntry);
    this.addObservation(options.detailsOfInjury, DetailsOfInjury, deathRecordContents, decedentEntry);
    this.addObservation(options.mannerOfDeath, MannerOfDeath, deathRecordContents, decedentEntry);
    this.addObservation(options.medicalExaminerOrCoronerContacted, MedicalExaminerOrCoronerContacted, deathRecordContents, decedentEntry);
    this.addObservation(options.timingOfPregnancy, TimingOfPregnancy, deathRecordContents, decedentEntry);
    this.addObservation(options.tobaccoUseContributedToDeath, TobaccoUseContributedToDeath, deathRecordContents, decedentEntry);
  }
  addDecedent(decedent, deathRecordContents) {
    if (!_.isNil(decedent)) {
      const decedentResource = new Decedent(decedent);
      const decedentEntry = this.addEntry(decedentResource);
      deathRecordContents.addDecedentReference(decedentEntry);
      return decedentEntry;
    }
  }
  addCertifier(certifier, deathRecordContents) {
    if (!_.isNil(certifier)) {
      const certifierResource = new Certifier(certifier);
      const certifierEntry = this.addEntry(certifierResource);
      deathRecordContents.addCertifierReference(certifierEntry);
    }
  }
  addCauseOfDeath(literalText, onsetString, deathRecordContents, decedentEntry) {
    if (!_.isNil(literalText) && !_.isNil(onsetString)) {
      const causeOfDeathResource = new CauseOfDeath(literalText, onsetString, decedentEntry);
      const causeOfDeathEntry = this.addEntry(causeOfDeathResource);
      deathRecordContents.addReference(causeOfDeathEntry);
    }
  }
  addObservation(observation, observationClass, deathRecordContents, decedentEntry) {
    if (!_.isNil(observation)) {
      const observationResource = new observationClass(observation, decedentEntry);
      const observationEntry = this.addEntry(observationResource);
      deathRecordContents.addReference(observationEntry);
    }
  }
}

// An example, which can be used for testing if uncommented

// const example = new DeathRecord({
//   id: '1',
//   actualOrPresumedDateOfDeath: moment().format(),
//   autopsyPerformed: false,
//   autopsyResultsAvailable: false,
//   datePronouncedDead: moment().format(),
//   deathFromWorkInjury: false,
//   injuryAssociatedWithTransport: 'Other',
//   detailsOfInjury: {
//     value: 'Example details of injury',
//     effectiveDateTime: moment().format(),
//     placeOfInjury: 'Example place of injury',
//     address: {
//       line: [
//         "7 Example Street"
//       ],
//       city: "Bedford",
//       state: "Massachusetts",
//       postalCode: "01730",
//       country: "United States"
//     },
//   },
//   mannerOfDeath: 'Accident',
//   medicalExaminerOrCoronerContacted: false,
//   timingOfPregnancy: 'Not pregnant within past year',
//   tobaccoUseContributedToDeath: 'No',
//   causeOfDeath: [
//     { literalText: 'Example Immediate COD', onsetString: 'minutes' },
//     { literalText: 'Example Underlying COD 1', onsetString: '2 hours' },
//     { literalText: 'Example Underlying COD 2', onsetString: '6 months' },
//     { literalText: 'Example Underlying COD 3', onsetString: '15 years' }
//   ],
//   decedent: {
//     name: 'Example Middle Person',
//     birthDate: '1970-04-24',
//     deceasedDateTime: '2018-04-24T00:00:00+00:00',
//     address:  {
//       line: [
//         "1 Example Street"
//       ],
//       city: "Boston",
//       state: "Massachusetts",
//       postalCode: "02101",
//       country: "United States"
//     },
//     gender: 'male',
//     ssn: '111223333',
//     servedInArmedForces: false,
//     birthSex: 'M'
//   },
//   certifier: {
//     name: 'Example Middle Doctor',
//     certifierType: 'Physician (Pronouncer and Certifier)',
//     identifier: '1',
//     address:  {
//       line: [
//         "100 Example St."
//       ],
//       city: "Bedford",
//       state: "Massachusetts",
//       postalCode: "01730",
//       country: "United States"
//     },
//   }
// });


// In the code below we rely on "" evaluating to false

const formatDateAndTime = (date, time) => {
  if (date && time) {
    return moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format();
  } else if (date) {
    return moment(date, 'YYYY-MM-DD').format();
  }
}

const formatAddress = (street, city, state, zip) => {
  let address = null;
  if (street || city || state || zip) {
    address = {};
    if (street) {
      address.line = [street];
    }
    if (city) {
      address.city = city;
    }
    if (state) {
      address.state = state;
    }
    if (zip) {
      address.postalCode = zip;
    }
  }
  return address;
}

const recordToFHIR = (record, decedent) => {

  // TODO Consider changing switches above to lookup table approach
  // TODO Consider using lookup table approach for 'Yes' and 'No' answers so we can just pass through
  // TODO Consider routing all the decedent information through the record

  // Build the input for translation to FHIR
  const fhirInput = {};

  fhirInput.actualOrPresumedDateOfDeath = formatDateAndTime(record.actualDeathDate, record.actualDeathTime);

  fhirInput.datePronouncedDead = formatDateAndTime(record.pronouncedDeathDate, record.pronouncedDeathTime);

  if (!_.isNil(record.autopsyPerformed)) {
    fhirInput.autopsyPerformed = record.autopsyPerformed === 'Yes';
  }

  if (!_.isNil(record.autopsyAvailable)) {
    fhirInput.autopsyResultsAvailable = record.autopsyAvailable === 'Yes';
  }

  if (!_.isNil(record.injuryAtWork)) {
    fhirInput.deathFromWorkInjury = record.injuryAtWork === 'Yes';
  }

  fhirInput.injuryAssociatedWithTransport = record.transportationInjury;

  const locationOfInjury = formatAddress(record.locationOfInjuryStreet, record.locationOfInjuryCity,
                                         record.locationOfInjuryState, record.locationOfInjuryZip);
  if (record.howInjuryOccurred || locationOfInjury || record.placeOfInjury || record.dateOfInjury) {
    fhirInput.detailsOfInjury = {};
    // TODO: Need a field to collect field 43 "describe how injury occurred"
    if (record.howInjuryOccurred) {
      fhirInput.detailsOfInjury.value = record.howInjuryOccurred;
    }
    if (locationOfInjury) {
      fhirInput.detailsOfInjury.address = locationOfInjury;
    }
    if (record.placeOfInjury) {
      fhirInput.detailsOfInjury.placeOfInjury = record.placeOfInjury;
    }
    if (record.dateOfInjury) {
      fhirInput.detailsOfInjury.effectiveDateTime = formatDateAndTime(record.dateOfInjury, record.timeOfInjury);
    }
  }

  fhirInput.mannerOfDeath = record.mannerOfDeath;

  if (!_.isNil(record.examinerContacted)) {
    fhirInput.medicalExaminerOrCoronerContacted = record.examinerContacted === 'Yes';
  }

  fhirInput.timingOfPregnancy = record.pregnancy;

  fhirInput.tobaccoUseContributedToDeath = record.tobacco;

  for (let i = 1; i <= 4; i += 1) {
    if (record[`cod${i}Text`]) {
      fhirInput.causeOfDeath = fhirInput.causeOfDeath || [];
      fhirInput.causeOfDeath.push({ literalText: record.cod1Text, onsetString: record.cod1Time });
    }
  }

  fhirInput.decedent = {
    name: decedent.name,
    birthDate: decedent.birthDate,
    deceasedDateTime: formatDateAndTime(record.actualDeathDate, record.actualDeathTime),
    address: decedent.resource.address[0],
    gender: decedent.gender
    //ssn: '111223333'
    //servedInArmedForces: false,
    //birthSex: 'M'
  };

  fhirInput.certifier = {
    name: record.certifierName,
    certifierType: 'Physician (Pronouncer and Certifier)',
    identifier: record.certifierNumber,
    address: formatAddress(record.certifierStreet, record.certifierCity, record.certifierState, record.certifierZip)
  }

  return new DeathRecord(fhirInput);
}

export { recordToFHIR  };
