import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';

// Infrastructure for creating FHIR death records based on the profile at
// http://hl7.org/fhir/us/vrdr/2019May/

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
    this.meta = { profile };
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
  constructor(options = {}) {
    super(options);
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
    const certificationEntry = this.addEntry(certification);
    certificate.addCertificationReference(certificationEntry);

    // TODO: This may belong at a lower level, wherever it eventually gets pointed to
    const mortician = new Mortician(options.mortician);
    this.addEntry(mortician);
  }
}

class DeathCertificate extends Composition {

  constructor(options = {}) {
    super();
    this.identifier = { value: options.identifier };
    const certification = new DeathCertification();
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
}

class Certifier extends Practitioner {
  constructor(options = {}) {
    super(options);
  }
}

class Mortician extends Practitioner {
  constructor(options = {}) {
    super(options);
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    super(options);
  }
}

export { DeathCertificateDocument };
