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

class Base {
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

class Bundle extends Base {
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

class Composition extends Base {
  constructor() {
    super();
    this.resourceType = 'Composition';
  }
}

class Procedure extends Base {
  constructor() {
    super();
    this.resourceType = 'Procedure';
  }
}

class Person extends Base {
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

class Organization extends Base {
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

class CodeableConcept {
  constructor(code, system, display) {
    if (system && display) {
      this.coding = [{ system, code, display }];
    } else if (system) {
      this.coding = [{ system, code }];
    } else if (display) {
      this.coding = [{ code, display }];
    } else {
      this.coding = [{ code }];
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

    const certificate = new DeathCertificate(options.deathCertificate)
    this.addEntry(certificate);

    const decedent = new Decedent(options.decedent);
    const decedentEntry = this.addEntry(decedent);
    certificate.addDecedentReference(decedentEntry);

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

    // TODO: This may belong at a lower level, wherever it eventually gets pointed to
    const mortician = new Mortician(options.mortician);
    this.addEntry(mortician);

    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certificate-Document')
  }
}

class DeathCertificate extends Composition {
  constructor(options = {}) {
    super();
    // TODO: do we want to check for missing required options?
    if (options.identifier) {
      this.identifier = { value: options.identifier };
    }
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certificate');
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
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Death-Certification');
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
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Certifier');
  }
}

class Mortician extends Practitioner {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Mortician');
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    super(options);
    if (options.birthsex) {
      this.addExtension({
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCodeableConcept: new CodeableConcept(options.birthsex, 'http://hl7.org/fhir/us/core/ValueSet/us-core-birthsex')
      });
    }
    if (options.birthplace) {
      this.addExtension({
        url: 'http://www.hl7.org/fhir/StructureDefinition/birthPlace',
        valueAddress: options.birthplace
      });
    }
  }
}

class FuneralHome extends Organization {
  constructor(options = {}) {
    super();
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Funeral-Home');
    this.type = [new CodeableConcept('bus', null, 'Non-Healthcare Business or Corporation')];
  }
}

class InterestedParty extends Organization {
  constructor(options = {}) {
    super(options);
    this.setProfile('http://www.hl7.org/fhir/us/vrdr/StructureDefinition/VRDR-Interested-Party');
    if (options.identifier) {
      this.identifier = [{ value: options.identifier }];
    }
    this.active = 'true'; // TODO: should this be settable?
    if (options.typeCode) {
      this.type = [new CodeableConcept(options.typeCode, 'http://hl7.org/fhir/ValueSet/organization-type', options.typeDisplay)];
    }
  }
}


export { DeathCertificateDocument };
