// TODO: don't use switch statements, use subclasses and a generator
// function that takes the resource and returns the correct wrapper

// Simple wrapper for FHIR resources (conditions, medications, procedures, observations)
class Resource {

  constructor(resource) {
    this.resource = resource;
  }

  static wrap(resource) {
    switch (resource.resourceType) {
      case 'Condition': return new Condition(resource);
      case 'Procedure': return new Procedure(resource);
      case 'Observation': return new Observation(resource);
      case 'MedicationRequest': return new MedicationRequest(resource);
      default: return new Resource(resource);
    }
  }

  get id() {
    return this.resource.id;
  }

  get description() {
    return this.resource.code.coding[0].display;
  }
}

class Condition extends Resource {
  get date() {
    return this.resource.onsetDateTime;
  }
}

class Procedure extends Resource {
  get date() {
    return this.resource.performedDateTime;
  }
}

class Observation extends Resource {
  get date() {
    return this.resource.effectiveDateTime;
  }
}

class MedicationRequest extends Resource {
  get description() {
    // TODO: THIS IS A HACK
    try {
      if (this.medication) {
        return this.medication.code.coding[0].display;
      } else {
        return this.resource.medicationCodeableConcept.coding[0].display;
      }
    } catch(err) {
      return null;
    }
  }
  get date() {
    return this.resource.dateWritten;
  }
}

export default Resource;
