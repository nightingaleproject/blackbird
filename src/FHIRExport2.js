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
  constructor(options = {}) {
    super();
    this.resourceType = 'Condition';
    if (options.text) {
      this.code = new CodeableConcept(null, null, options.text);
    }
  }
  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }
  addCertifierReference(certifierEntry) {
    this.asserter = { reference: certifierEntry.fullUrl };
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
    if (options.identifier) {
      this.qualification = [{
        identifier: [{
          value: options.identifier
        }]
      }];
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
      this.name = options.name;
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
  addCertifierReference(certifierEntry) {
    this.performer = [{ reference: certifierEntry.fullUrl }];
  }
  addLocationReference(locationEntry) {
    const valueReference = { reference: locationEntry.fullUrl };
    this.addExtension({ url: 'http://hl7.org/fhir/us/vrdr/StructureDefinition/Patient-Location', valueReference });
  }
  addComponent(typeOptions, valueOptions) {
    this.component = this.component || [];
    const content = { code: new CodeableConcept(typeOptions.code, typeOptions.system, typeOptions.display) };
    if (valueOptions.code) {
      content['valueCodeableConcept'] = new CodeableConcept(valueOptions.code, valueOptions.system, valueOptions.display);
    } else if (valueOptions.date) {
      content['valueDateTime'] = formatDateAndTime(valueOptions.date, valueOptions.time);
    } else if (valueOptions.text) {
      content['valueString'] = valueOptions.text;
    }
    this.component.push(content);
  }
}

class Location extends Resource {
  constructor(options = {}) {
    super();
    this.resourceType = 'Location';
    if (options.name) {
      this.name = options.name;
    }
    if (options.description) {
      this.description = options.description;
    }
    if (options.address) {
      this.address = new Address(options.address);
    }
    if (options.type) {
      this.type = new CodeableConcept(options.type.code,
                                      'http://hl7.org/fhir/ValueSet/v3-ServiceDeliveryLocationRoleType',
                                      options.type.text);
    }
    if (options.physicalType) {
      this.physicalType = new CodeableConcept(options.physicalType.code,
                                              'http://hl7.org/fhir/ValueSet/location-physical-type',
                                              options.physicalType.text);
    }
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

    const certificate = this.createAndAddEntry(null, DeathCertificate, options.deathCertificate);

    const decedent = new Decedent(options.decedent);
    const decedentEntry = this.addEntry(decedent);
    certificate.addDecedentReference(decedentEntry);

    this.createAndAddEntry(certificate, DecedentFather, options.decedentFather, decedentEntry);
    this.createAndAddEntry(certificate, DecedentMother, options.decedentMother, decedentEntry);
    this.createAndAddEntry(certificate, DecedentSpouse, options.decedentSpouse, decedentEntry);
    this.createAndAddEntry(certificate, DecedentAge, options.decedentAge, decedentEntry);
    this.createAndAddEntry(certificate, DecedentPregnancy, options.decedentPregnancy, decedentEntry);
    this.createAndAddEntry(certificate, DecedentTransportationRole, options.decedentTransportationRole, decedentEntry);
    this.createAndAddEntry(certificate, TobaccoUseContributedToDeath, options.tobaccoUseContributedToDeath, decedentEntry);
    this.createAndAddEntry(certificate, DecedentEducationLevel, options.decedentEducationLevel, decedentEntry);
    this.createAndAddEntry(certificate, DecedentEmploymentHistory, options.decedentEmploymentHistory, decedentEntry);
    this.createAndAddEntry(certificate, BirthRecordIdentifier, options.birthRecordIdentifier, decedentEntry);

    const certifier = new Certifier(options.certifier);
    const certifierEntry = this.addEntry(certifier);
    certificate.addCertifierReference(certifierEntry);

    const certification = new DeathCertification(options.deathCertification);
    certification.addCertifierReference(certifierEntry);
    const certificationEntry = this.addEntry(certification);
    certificate.addCertificationReference(certificationEntry);

    this.createAndAddEntry(certificate, MannerOfDeath, options.mannerOfDeath, decedentEntry, certifierEntry);
    this.createAndAddEntry(certificate, AutopsyPerformedIndicator, options.autopsyPerformed, decedentEntry);
    this.createAndAddEntry(certificate, ExaminerContacted, options.examinerContacted, decedentEntry);

    this.createAndAddEntry(certificate, FuneralHome, options.funeralHome);
    this.createAndAddEntry(certificate, Mortician, options.mortician);
    this.createAndAddEntry(certificate, InterestedParty, options.interestedParty);

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
    this.addEntry(causeOfDeathPathway);

    this.createAndAddEntry(certificate, ConditionContributingToDeath,
                           options.conditionContributingToDeath,
                           decedentEntry, certifierEntry);

    const deathLocation = new DeathLocation(options.deathLocation);
    const deathLocationEntry = this.addEntry(deathLocation);

    const deathDate = this.createAndAddEntry(certificate, DeathDate, options.deathDate, decedentEntry, certifierEntry);
    deathDate.addLocationReference(deathLocationEntry);

    const injuryIncident = this.createAndAddEntry(certificate, InjuryIncident, options.injuryIncident, decedentEntry);
    injuryIncident.addLocationReference(deathLocationEntry);

    this.createAndAddEntry(certificate, InjuryLocation, options.injuryLocation);

    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certificate-Document')
  }

  // Many entries follow the same structure: instantiate a class with passed-in options, point the
  // instance to the decedent and/or certifier, and add an entry for that instance
  createAndAddEntry(certificate, klass, options, decedentEntry, certifierEntry) {
    if (options) {
      const instance = new klass(options);
      if (decedentEntry) {
        instance.addDecedentReference(decedentEntry);
      }
      if (certifierEntry) {
        instance.addCertifierReference(certifierEntry);
      }
      const entry = this.addEntry(instance);
      if (certificate) {
        certificate.addSectionEntry(entry);
      }
      return(instance);
    }
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
  addSectionEntry(entry) {
    this.section = this.section || [{ entry: [] }];
    this.section[0].entry.push({ reference: entry.fullUrl });
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

class DecedentAge extends Observation {
  constructor(options = {}) {
    super({ code: '30525-0', system: 'http://loinc.org', display: 'Age' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Decedent-Age');
    this.valueQuantity = {
      unit: options.unit,
      value: options.value
    };
    // TODO: This also has an effectiveDateTime, which is the date of death; this is duplicative information
  }
}

class DecedentPregnancy extends Observation {
  constructor(options = {}) {
    super({ code: '69442-2', system: 'http://loinc.org', display: 'Timing of recent pregnancy in relation to death' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Decedent-Pregnancy');
    this.valueCodeableConcept = new CodeableConcept(options.code, 'http://hl7.org/fhir/stu3/valueset-PregnancyStatusVS', options.text);
  }
}

class DecedentTransportationRole extends Observation {
  constructor(options = {}) {
    super({ code: '69451-3', system: 'http://loinc.org', display: 'Transportation role of decedent' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Decedent-Transportation-Role');
    this.valueCodeableConcept = new CodeableConcept(options.code,
                                                    'http://hl7.org/fhir/ValueSet/TransportationRelationships',
                                                    options.text);
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
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Cause-of-Death-Pathway');
    if (options.interval) {
      this.onsetString = options.interval;
    }
  }
}

class ConditionContributingToDeath extends Condition {
  constructor(options) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Condition-Contributing-To-Death');
  }
}

class ExaminerContacted extends Observation {
  constructor(options = {}) {
    super({ code: '74497-9', system: 'http://loinc.org', display: 'Medical examiner or coroner was contacted' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Examiner-Contacted');
    this.valueBoolean = options.value;
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

class DecedentEmploymentHistory extends Observation {
  constructor(options = {}) {
    super({ code: '74165-2', system: 'http://loinc.org', display: 'History of employment status' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Decedent-Employment-History');
    if (options.militaryService) {
      this.addComponent({ code: '55280-2', system: 'http://loinc.org', display: 'Military service Narrative' },
                        { code: options.militaryService.code, system: 'http://hl7.org/fhir/ValueSet/v2-0532',
                          display: options.militaryService.text });
    }
    if (options.usualIndustry) {
      this.addComponent({ code: '21844-6', system: 'http://loinc.org', display: 'History of Usual industry' },
                        { code: options.usualIndustry.code, system: 'http://hl7.org/fhir/ValueSet/industry-cdc-census-2010',
                          display: options.usualIndustry.text });
    }
    if (options.usualOccupation) {
      this.addComponent({ code: '21847-9', system: 'http://loinc.org', display: 'Usual occupation Narrative' },
                        { code: options.usualOccupation.code, system: 'http://hl7.org/fhir/ValueSet/Usual-occupation',
                          display: options.usualOccupation.text });
    }
  }
}

class BirthRecordIdentifier extends Observation {
  constructor(options = {}) {
    super({ code: 'BR', system: 'urn:oid:2.16.840.1.113883.6.290', display: 'Birth Record' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Birth-Record-Identifier');
    this.valueString = options.certificateNumber;
    if (options.birthYear) {
      this.addComponent({ code: '21112-8', system: 'http://loinc.org', display: 'Birth date' },
                        { date: options.birthYear });
    }
    if (options.birthState) {
      this.addComponent({ code: '21842-0', system: 'http://loinc.org', display: 'Birthplace' },
                        { code: options.birthState, system: 'ISO 3166-2' });
    }
  }
}

class MannerOfDeath extends Observation {
  constructor(options = {}) {
    super({ code: '69449-7', system: 'http://loinc.org', display: 'Manner of death' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Manner-of-Death');
    this.valueCodeableConcept = new CodeableConcept(options.code, 'http://hl7.org/fhir/stu3/valueset-MannerTypeVS', options.text);
  }
}

class InjuryIncident extends Observation {
  constructor(options = {}) {
    super({ code: '11374-6', system: 'http://loinc.org', display: 'Injury incident description' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Injury-Incident');
    this.valueString = options.text;
    if (options.effectiveDate) {
      this.effectiveDateTime = formatDateAndTime(options.effectiveDate, options.effectiveTime);
    }
    if (options.placeOfInjury) {
      this.addComponent({ code: '69450-5', system: 'http://loinc.org', display: 'Place of injury' },
                        { text: options.placeOfInjury });
    }
    if (options.transportationEventIndicator) {
      this.addComponent({ code: '69448-9', system: 'http://loinc.org',
                          display: 'Injury leading to death associated with transportation event' },
                        { code: options.transportationEventIndicator.code, system: 'http://hl7.org/fhir/ValueSet/v2-0532',
                          display: options.transportationEventIndicator.text });
    }
    if (options.workInjuryIndicator) {
      this.addComponent({ code: '69444-8', system: 'http://loinc.org', display: 'Injury at work?' },
                        { code: options.workInjuryIndicator.code, system: 'http://hl7.org/fhir/ValueSet/v2-0532',
                          display: options.workInjuryIndicator.text });
    }
  }
}

class InjuryLocation extends Location {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Injury-Location');
  }
}

class AutopsyPerformedIndicator extends Observation {
  constructor(options = {}) {
    super({ code: '85699-7', system: 'http://loinc.org', display: 'Autopsy was performed' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Autopsy-Performed-Indicator');
    this.valueCodeableConcept = new CodeableConcept(options.code, 'http://hl7.org/fhir/ValueSet/v2-0532', options.text);
    if (options.autopsyAvailable) {
      this.addComponent({ code: '69436-4', system: 'http://loinc.org', display: 'Autopsy results available' },
                        { code: options.autopsyAvailable.code, system: 'http://hl7.org/fhir/ValueSet/v2-0532',
                          display: options.autopsyAvailable.text });
    }
  }
}

class DeathLocation extends Location {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Death-Location');
  }
}

class DeathDate extends Observation {
  constructor(options = {}) {
    super({ code: '81956-5', system: 'http://loinc.org', display: 'Date and time of death' });
    this.setProfile('http://hl7.org/fhir/us/vrdr/VRDR-Death-Date');
    if (options.effectiveDate) {
      this.effectiveDateTime = formatDateAndTime(options.effectiveDate, options.effectiveTime);
    }
    if (options.comment) {
      this.comment = options.comment;
    }
    if (options.method) {
      this.method = new CodeableConcept(options.method.code, 'http://snomed.info/sct', options.method.text)
    }
    if (options.pronouncedDate) {
      this.addComponent({ code: '80616-6', system: 'http://loinc.org', display: 'Date and time pronounced dead' },
                        { date: options.pronouncedDate, time: options.pronouncedTime });
    }
  }
}

export { DeathCertificateDocument };
