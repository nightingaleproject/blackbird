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
  constructor(resource, medicationResource = null) {
    super(resource);
    this.medicationResource = medicationResource;
  }
  get description() {
    if (this.medicationResource) {
      return this.medicationResource.code.coding[0].display;
    } else {
      return this.resource.medicationCodeableConcept.coding[0].display;
    }
  }
  get date() {
    return this.resource.dateWritten;
  }
  // Some FHIR implementations don't include details on the medication in the MedicationRequest;
  // in those cases we may need to request the associated Medication resource; this returns a
  // promise wrapping a new MedicationRequest with the desired information (if available)
  withMedication(smart) {
    if (this.resource.medicationReference) {
      const medicationId = this.resource.medicationReference.reference.split('/')[1];
      return smart.api.read({ type: 'Medication', id: medicationId }).then((response) => {
        return new MedicationRequest(this.resource, response.data);
      });
    } else {
      return Promise.resolve(new MedicationRequest(this.resource));
    }
  }
}

export default Resource;
