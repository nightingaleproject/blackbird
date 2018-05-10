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

class CodableConcept {
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
    const match = name.match(/(\S+)\s+(.+)/);
    const first = match[1];
    const last = match[2].split(/\s+/);
    this.use = 'official';
    this.first = first;
    this.family = last;
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
    this.type = new CodableConcept('http://loinc.org', '64297-5', 'Death certificate');
    this.status = 'final';
    this.date = moment().format('YYYY-MM-DD');
    this.title = 'Record of Death';
    this.section = {
      code: new CodableConcept('http://loinc.org', '69453-9', 'Cause of death')
    };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-DeathRecordContents');
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
  addCertifierReference(certifierEntry) {
    this.author = { reference: certifierEntry.fullUrl };
  }
  addReference(entry) {
    this.section.entry = this.section.entry || [];
    this.section.entry.push({ reference: entry.fullUrl });
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    const local = ['name', 'servedInArmedForces', 'birthSex'];
    super(_.omit(options, local));
    if (options.name) {
      this.addName(options.name);
    }
    if (!_.isNil(options.servedInArmedForces)) {
      this.addExtension({
        url: 'http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-decedent-ServedInArmedForces-extension',
        valueBoolean: options.servedInArmedForces
      });
    }
    if (!_.isNil(options.birthSex)) {
      this.addExtension({
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCode: options.birthSex
      });
    }
  }
}

class Certifier extends Practitioner {
  constructor(options = {}) {
    const local = ['name'];
    super(_.omit(options, local));
    if (options.name) {
      this.addName(options.name);
    }
  }
}

class CauseOfDeath extends Condition {
  constructor(literalText, onsetString, subjectEntry) {
    super();
    this.clinicalStatus = 'active';
    this.text = {
      status: 'additional',
      div: literalText
    };
    this.onsetString = onsetString;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-CauseOfDeathCondition');
  }
}

class ActualOrPresumedDateOfDeath extends Observation {
   constructor(value, subjectEntry) {
     super();
     this.code = new CodableConcept('http://loinc.org', '81956-5', 'Date and time of death');
     this.valueDateTime = value;
     this.subject = { reference: subjectEntry.fullUrl };
     this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-ActualOrPresumedDateOfDeath');
   }
}

class AutopsyPerformed extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '85699-7', 'Autopsy was performed');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-AutopsyPerformed');
  }
}

class AutopsyResultsAvailable extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69436-4', 'Autopsy results available');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-AutopsyResultsAvailable');
  }
}

class DatePronouncedDead extends Observation {
   constructor(value, subjectEntry) {
     super();
     this.code = new CodableConcept('http://loinc.org', '80616-6', 'Date and time pronounced dead');
     this.valueDateTime = value;
     this.subject = { reference: subjectEntry.fullUrl };
     this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DatePronouncedDead');
   }
}

class DeathFromWorkInjury extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69444-8', 'Did death result from injury at work');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DeathFromWorkInjury');
  }
}

class InjuryAssociatedWithTransport extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69448-9', 'Injury leading to death associated with transportation event');
    switch (value) {
    case 'Vehicle driver':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '236320001', value);
      break;
    case 'Passenger':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '257500003', value);
      break;
    case 'Pedestrian':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '257518000', value);
      break;
    case 'Other':
      this.valueCodableConcept = new CodableConcept('http://hl7.org/fhir/v3/NullFlavor', 'OTH', value);
      break;
    default:
      throw `InjuryAssociatedWithTransport ${value} not in value set`;
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DeathFromTransportInjury');
  }
}

class DetailsOfInjury extends Observation {
  constructor(details, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '11374-6', 'Injury incident description');
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
        valueAddress: new Address(details.placeOfInjury)
      });
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DetailsOfInjury');
  }
}

class MannerOfDeath extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69449-7', 'Manner of Death');
    switch (value) {
    case 'Natural':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '38605008', value);
      break;
    case 'Accident':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '7878000', value);
      break;
    case 'Suicide':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '44301001', value);
      break;
    case 'Homicide':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '27935005', value);
      break;
    case 'Pending Investigation':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '185973002', value);
      break;
    case 'Could not be determined':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '65037004', value);
      break;
    default:
      throw `MannerOfDeath ${value} not in value set`;
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-MannerOfDeath');
  }
}

class MedicalExaminerOrCoronerContacted extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '74497-9', 'Medical examiner or coroner was contacted');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-MedicalExaminerContacted');
  }
}

class TimingOfPregnancy extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69442-2', 'Timing of recent pregnancy in relation to death');
    switch (value) {
    case 'Not pregnant within past year':
      this.valueCodableConcept = new CodableConcept(null, 'PHC1260', value);
      break;
    case 'Pregnant at time of death':
      this.valueCodableConcept = new CodableConcept(null, 'PHC1261', value);
      break;
    case 'Not pregnant, but pregnant within 42 days of death':
      this.valueCodableConcept = new CodableConcept(null, 'PHC1262', value);
      break;
    case 'Not pregnant, but pregnant 43 days to 1 year before death':
      this.valueCodableConcept = new CodableConcept(null, 'PHC1263', value);
      break;
    case 'Unknown if pregnant within the past year':
      this.valueCodableConcept = new CodableConcept(null, 'PHC1264', value);
      break;
    default:
      throw `TimingOfPregnancy ${value} not in value set`;
    }
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-TimingOfRecentPregnancyInRelationToDeath');
  }
}

class TobaccoUseContributedToDeath extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69443-0', 'Did tobacco use contribute to death');
    switch (value) {
    case 'Yes':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '373066001', value);
      break;
    case 'No':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '373067005', value);
      break;
    case 'Probably':
      this.valueCodableConcept = new CodableConcept('http://snomed.info/sct', '2931005', value);
      break;
    case 'Unknown':
      this.valueCodableConcept = new CodableConcept('http://hl7.org/fhir/v3/NullFlavor', 'UNK', value);
      break;
    default:
      throw `TobaccoUseContributedToDeath ${value} not in value set`;
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
    this.type = 'Document';

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

// TODO: Just for local testing during development
const x = new DeathRecord({
  id: 1,
  actualOrPresumedDateOfDeath: moment().format(),
  autopsyPerformed: true,
  autopsyResultsAvailable: false,
  datePronouncedDead: moment().format(),
  deathFromWorkInjury: false,
  injuryAssociatedWithTransport: 'Passenger',
  detailsOfInjury: {
    value: 'Example details of injury',
    effectiveDateTime: moment().format(),
    placeOfInjury: 'Example place of injury',
    address: {
      line: [
        "7 Example Street",
        "Bedford Massachusetts 01730"
      ],
      city: "Bedford",
      state: "Massachusetts",
      postalCode: "01730",
      country: "United States"
    },
  },
  mannerOfDeath: 'Natural',
  medicalExaminerOrCoronerContacted: false,
  timingOfPregnancy: 'Unknown if pregnant within the past year',
  tobaccoUseContributedToDeath: 'Probably',
  causeOfDeath: [
    { literalText: 'Example COD 1', onsetString: 'Hours' },
    { literalText: 'Example COD 2', onsetString: 'Days' }
  ],
  decedent: {
    name: 'Example Decedent',
    servedInArmedForces: true,
    birthSex: 'M'
  },
  certifier: {
    name: 'Example Certifier'
  }
});


debugger

export { DeathRecord };
