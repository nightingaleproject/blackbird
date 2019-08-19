import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';

// Infrastructure for creating FHIR death records based on the profile at
// http://hl7.org/fhir/us/vrdr/2019May/

// Utility functions
// In the code below we rely on "" evaluating to false

const formatDateAndTime = (date, time) => {
  if (date && time) {
    return moment.utc(`${date} ${time}`, 'YYYY-MM-DD HH:mm').format();
  } else if (date) {
    return moment.utc(date, 'YYYY-MM-DD').format();
  }
}

// Begin with classes to represent the core FHIR resources and types that are used to build a death record

class Resource {
  constructor() {
    this.id = uuid();
  }
  addExtension(extension) {
    this.extension = this.extension || [];
    this.extension.push(extension);
  }
  setProfile(profile) {
    this.meta = { profile: [profile] };
  }
}

class Bundle extends Resource {
  constructor() {
    super();
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

class Composition extends Resource {
  constructor() {
    super();
    this.resourceType = 'Composition';
  }
}

class Procedure extends Resource {
  constructor() {
    super();
    this.resourceType = 'Procedure';
  }
}

class Condition extends Resource {
  constructor() {
    super();
    this.resourceType = 'Condition';
  }
}

class Person extends Resource {
  constructor(options = {}) {
    super();
    if (options.name) {
      this.name = this.name || [];
      this.name.push(new HumanName(options.name));
    }
    if (options.address) {
      this.address = [new Address(options.address)];
    }
  }
}

class Practitioner extends Person {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Practitioner';
  }
}

class Patient extends Person {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'Patient';
  }
}

class Organization extends Resource {
  constructor(options = {}) {
    super();
    this.resourceType = 'Organization';
    if (options.name) {
      this.name = options.name
    }
    if (options.address) {
      this.address = [new Address(options.address)];
    }
  }
}

class List extends Resource {
  constructor(options = {}) {
    super();
    this.resourceType = 'List';
  }
}

class RelatedPerson extends Person {
  constructor(options = {}) {
    super(options);
    this.resourceType = 'RelatedPerson';
  }
  addDecedentReference(decedentEntry) {
    this.patient = { reference: decedentEntry.fullUrl };
  }
}


class Observation extends Resource {
  constructor(options = {}) {
    super();
    this.resourceType = 'Observation';
    this.status = 'final';
    this.code = new CodeableConcept(options.code, options.system, options.display);
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
}

// Helper classes for other FHIR concepts

class CodeableConcept {
  constructor(code, system, display) {
    if (code) {
      if (system && display) {
        this.coding = [{ system, code, display }];
      } else if (system) {
        this.coding = [{ system, code }];
      } else if (display) {
        this.coding = [{ code, display }];
      } else {
        this.coding = [{ code }];
      }
    }
    if (display) {
      this.text = display;
    }
  }
}

class HumanName {
  constructor(name, use) {
    // Just does a simple decomposition for now
    // TODO: This won't hold up to more complex examples with prefixes and suffixes
    let match = name.match(/(.+)\s+(\S+)/);
    if (match) {
      this.given = match[1].split(/\s+/);
      this.family = match[2];
    } else {
      match = name.match(/\S+/);
      if (match) {
        this.given = [match[0]];
      }
    }
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

class DeathCertificateDocument extends Bundle {
  constructor(options = {}) {

    super();

    this.type = 'document';

    if (options.identifier) {
      this.identifier = { value: options.identifier };
    }

    const certificate = new DeathCertificate(options.deathCertificate)
    this.addEntry(certificate);

    const decedent = new Decedent(options.decedent);
    const decedentEntry = this.addEntry(decedent);
    certificate.addDecedentReference(decedentEntry);

    this.addBasicEntry(decedentEntry, DecedentFather, options.decedentFather);
    this.addBasicEntry(decedentEntry, DecedentMother, options.decedentMother);
    this.addBasicEntry(decedentEntry, DecedentSpouse, options.decedentSpouse);
    this.addBasicEntry(decedentEntry, TobaccoUseContributedToDeath, options.tobaccoUseContributedToDeath);
    this.addBasicEntry(decedentEntry, DecedentEducationLevel, options.decedentEducationLevel);

    const certifier = new Certifier(options.certifier);
    const certifierEntry = this.addEntry(certifier);
    certificate.addCertifierReference(certifierEntry);

    const certification = new DeathCertification(options.deathCertification);
    certification.addCertifierReference(certifierEntry);
    const certificationEntry = this.addEntry(certification);
    certificate.addCertificationReference(certificationEntry);

    const funeralHome = new FuneralHome(options.funeralHome);
    const funeralHomeEntry = this.addEntry(funeralHome);

    const interestedParty = new InterestedParty(options.interestedParty);
    const interestedPartyEntry = this.addEntry(interestedParty);

    const causeOfDeathPathway = new CauseOfDeathPathway();
    causeOfDeathPathway.addCertifierReference(certifierEntry);
    if (options.causeOfDeathConditions) {
      for (let causeOptions of options.causeOfDeathConditions) {
        const causeOfDeathCondition = new CauseOfDeathCondition(causeOptions);
        causeOfDeathCondition.addDecedentReference(decedentEntry);
        causeOfDeathCondition.addCertifierReference(certifierEntry);
        const causeOfDeathConditionEntry = this.addEntry(causeOfDeathCondition)
        causeOfDeathPathway.addCauseOfDeathReference(causeOfDeathConditionEntry);
      }
    }
    const causeOfDeathPathwayEntry = this.addEntry(causeOfDeathPathway);

    // TODO: This may belong at a lower level, wherever it eventually gets pointed to
    const mortician = new Mortician(options.mortician);
    this.addEntry(mortician);

    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certificate-Document')
  }

  // Many entries follow the same structure: the instantiate a class with passed-in options, point the
  // instance to the decedent, and add an entry for that instance
  addBasicEntry(decedentEntry, klass, options) {
    const instance = new klass(options);
    instance.addDecedentReference(decedentEntry);
    this.addEntry(instance);
  }
}

class DeathCertificate extends Composition {
  constructor(options = {}) {
    super();
    // TODO: do we want to check for missing required options?
    if (options.identifier) {
      this.identifier = { value: options.identifier };
    }
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certificate');
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
  addCertifierReference(certifierEntry) {
    this.attester = [{ mode: ['legal'], party: { reference: certifierEntry.fullUrl } }];
  }
  addCertificationReference(certificationReference) {
    const code = new CodeableConcept('103693007', 'http://snomed.info/sct', 'Diagnostic procedure');
    this.event = [{ code: [code], detail: [{ reference: certificationReference.fullUrl }] }];
  }
}

class DeathCertification extends Procedure {
  constructor(options = {}) {
    super();
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certification');
    this.status = 'completed';
    this.category = new CodeableConcept('103693007', 'http://snomed.info/sct', 'Diagnostic procedure');
    this.code = new CodeableConcept('308646001', 'http://snomed.info/sct', 'Death certification');
    this.performedDateTime = formatDateAndTime(options.performedDate, options.performedTime);
  }
  addCertifierReference(certifierEntry) {
    this.performer = [{
      role: new CodeableConcept('309343006', 'http://snomed.info/sct', 'Physician'),
      actor: { reference: certifierEntry.fullUrl }
    }];
  }
}

class Certifier extends Practitioner {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Certifier');
  }
}

class Mortician extends Practitioner {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Mortician');
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    super(options);
    // Race
    if (options.race) {
      const extension = [];
      // Race can handle either a single value or an array
      const raceEntries = _.castArray(options.race);
      // Only a single text extension is allowed, so concatenate the text from all the entries
      const raceText = raceEntries.filter((e) => e.text).map((e) => e.text).join(' ')
      if (raceText.length > 0) {
        extension.push({ url: 'text', valueString: raceText });
      }
      for (let raceEntry of raceEntries.filter((e) => e.code)) {
        const valueCoding = { system: 'urn:oid:2.16.840.1.113883.6.238', code: raceEntry.code, display: raceEntry.text };
        extension.push({ url: raceEntry.type, valueCoding });
      }
      this.addExtension({ url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race', extension });
    }
    // Ethnicity
    if (options.ethnicity) {
      const extension = [];
      if (options.ethnicity.text) {
        extension.push({ url: 'text', valueString: options.ethnicity.text });
      }
      if (options.ethnicity.code) {
        const valueCoding = { system: 'urn:oid:2.16.840.1.113883.6.238', code: options.ethnicity.code };
        if (options.ethnicity.text) {
          valueCoding['display'] = options.ethnicity.text;
        }
        extension.push({ url: 'ombCategory', valueCoding });
      }
      this.addExtension({ url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity', extension });
    }
    // BirthSex
    if (options.birthSex) {
      this.addExtension({
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCodeableConcept: new CodeableConcept(options.birthSex, 'http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex')
      });
    }
    // BirthPlace
    if (options.birthPlace) {
      this.addExtension({
        url: 'http://hl7.org/fhir/StructureDefinition/birthPlace',
        valueAddress: options.birthPlace
      });
    }
    // SSN
    if (options.ssn) {
      this.identifier = [{
        type: new CodeableConcept('BR', null, 'Social Beneficiary Identifier'),
        system: 'http://hl7.org/fhir/sid/us-ssn',
        value: options.ssn
      }];
    }
    // Gender
    if (options.gender) {
      this.gender = options.gender;
    }
    // BirthDate
    if (options.birthDate) {
      this.birthDate = formatDateAndTime(options.birthDate, null);
    }
    // MaritalStatus
    if (options.maritalStatus) {
      this.maritalStatus = new CodeableConcept(options.maritalStatus, 'http://hl7.org/fhir/vs/marital-status');
    }
  }
}

class DecedentFather extends RelatedPerson {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Decedent-Father');
    this.relationship = new CodeableConcept('FTH');
  }
}

class DecedentMother extends RelatedPerson {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Decedent-Mother');
    this.relationship = new CodeableConcept('MTH');
  }
}

class DecedentSpouse extends RelatedPerson {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Decedent-Spouse');
    this.relationship = new CodeableConcept('SPS');
  }
}

class FuneralHome extends Organization {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Funeral-Home');
    this.type = [new CodeableConcept('bus', null, 'Non-Healthcare Business or Corporation')];
  }
}

class InterestedParty extends Organization {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Interested-Party');
    if (options.identifier) {
      this.identifier = [{ value: options.identifier }];
    }
    this.active = 'true'; // TODO: should this be settable?
    if (options.typeCode) {
      this.type = [new CodeableConcept(options.typeCode, 'http://hl7.org/fhir/ValueSet/organization-type', options.typeDisplay)];
    }
  }
}

class CauseOfDeathPathway extends List {
  constructor() {
    super();
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Cause-of-Death-Pathway');
    this.status = 'current';
    this.mode = 'snapshot';
    this.orderedBy = new CodeableConcept('priority');
  }
  addCertifierReference(certifierEntry) {
    this.source = { reference: certifierEntry.fullUrl };
  }
  addCauseOfDeathReference(causeOfDeathEntry) {
    this.entry = this.entry || [];
    this.entry.push({ item: { reference: causeOfDeathEntry.fullUrl } });
  }
}

class CauseOfDeathCondition extends Condition {
  constructor(options) {
    super();
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Cause-of-Death-Pathway');
    if (options.text) {
      this.code = new CodeableConcept(null, null, options.text);
    }
    if (options.interval) {
      this.onsetString = options.interval;
    }
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
  addCertifierReference(certifierEntry) {
    this.asserter = { reference: certifierEntry.fullUrl };
  }
}

class TobaccoUseContributedToDeath extends Observation {
  constructor(options = {}) {
    super({ code: '69443-0', system: 'http://loinc.org', display: 'Did tobacco use contribute to death' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Tobacco-Use-Contributed-To-Death');
    this.valueCodeableConcept = new CodeableConcept(options.code, 'http://hl7.org/fhir/ValueSet/v2-0532', options.text);
  }
}

class DecedentEducationLevel extends Observation {
  constructor(options = {}) {
    super({ code: '80913-7', system: 'http://loinc.org', display: 'Highest level of education' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Decedent-Education-Level');
    this.valueCodeableConcept = new CodeableConcept(options.code, 'http://www.hl7.org/fhir/ValueSet/v3-EducationLevel', options.text);
  }
}

export { DeathCertificateDocument };
