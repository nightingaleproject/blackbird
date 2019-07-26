import _ from 'lodash';
import moment from 'moment';
import uuid from 'uuid/v4';

// Infrastructure for creating FHIR death records based on the profile at
// http://hl7.org/fhir/us/vrdr/2019May/

// Begin with classes to represent the core FHIR resources and types that are used to build a death record

class Base {
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

class Practitioner extends Base {
  constructor() {
    super();
    this.resourceType = 'Practitioner';
  }
  addName(name) {
    this.name = this.name || [];
    this.name.push(new HumanName(name));
  }
}

class Patient extends Base {
  constructor() {
    super();
    this.resourceType = 'Patient';
  }
  addName(name) {
    this.name = this.name || [];
    this.name.push(new HumanName(name));
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

// Classes to represent specific components of the death record

class DeathCertificateDocument extends Bundle {
  constructor(options = {}) {

    super();

    this.type = 'Document';

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
  }
}

class DeathCertificate extends Composition {

  constructor(options = {}) {
    super();
    // PWK: adam's implementation has a 'value' subfield in here, doesn't seem correct
    this.identifier = options.identifier;
    const certification = new DeathCertification();
    this.event = { code: '103693007', detail: certification };
  }

  addDecedentReference(decedentEntry) {
    this.subject = { reference: decedentEntry.fullUrl };
  }

  addCertifierReference(certifierEntry) {
    this.attester = { mode: 'legal', party: { reference: certifierEntry.fullUrl } };
  }

  addCertificationReference(certificationReference) {
    this.event = { code: { coding: { code: '103693007' } }, detail: { reference: certificationReference.fullUrl } };
  }

}

class DeathCertification extends Procedure {
}

class Certifier extends Practitioner {
  constructor(options = {}) {
    super();
    if (options.name) {
      this.addName(options.name);
    }
  }
}

class Decedent extends Patient {
  constructor(options = {}) {
    super();
    if (options.name) {
      this.addName(options.name);
    }
  }
}

export { DeathCertificateDocument };
