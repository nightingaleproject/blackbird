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
    this.coding = [{ system, code, display }];
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

class DeathFromWorkInjury extends Observation {
  constructor(value, subjectEntry) {
    super();
    this.code = new CodableConcept('http://loinc.org', '69444-8', 'Did death result from injury at work');
    this.valueBoolean = value;
    this.subject = { reference: subjectEntry.fullUrl };
    this.setProfile('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-causeOfDeath-DeathFromWorkInjury');
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

// Top level class to represent the Death Record, which provides the basic interface for creating itself

class DeathRecord extends Bundle {
  constructor(options = {}) {
    // Figure out what options we'll handle locally and pass the rest up
    const local = ['decedent', 'certifier', 'causeOfDeath', 'autopsyPerformed', 'autopsyResultsAvailable', 'mannerOfDeath',
                   'deathFromWorkInjury'];
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
    this.addObservation(options.autopsyPerformed, AutopsyPerformed, deathRecordContents, decedentEntry);
    this.addObservation(options.autopsyResultsAvailable, AutopsyResultsAvailable, deathRecordContents, decedentEntry);
    this.addObservation(options.mannerOfDeath, MannerOfDeath,deathRecordContents, decedentEntry);
    this.addObservation(options.deathFromWorkInjury, DeathFromWorkInjury,deathRecordContents, decedentEntry);
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
  autopsyPerformed: true,
  autopsyResultsAvailable: false,
  mannerOfDeath: 'Natural',
  deathFromWorkInjury: false,
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
