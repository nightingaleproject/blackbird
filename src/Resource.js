// Simple wrapper for FHIR resources (conditions, medications, procedures, observations)
class Resource {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    return this.resource.id;
  }
  get description() {
    switch (this.resource.resourceType) {
    case 'Condition':
    case 'Procedure':
    case 'Observation':
    default:
      return this.resource.code.coding[0].display;
    case 'MedicationRequest':
      return this.resource.medicationCodeableConcept.coding[0].display;
    }
  }
  get date() {
    switch (this.resource.resourceType) {
    case 'Condition':
      return this.resource.onsetDateTime;
    case 'Procedure':
      return this.resource.performedDateTime;
    case 'MedicationRequest':
      return this.resource.dateWritten;
    case 'Observation':
    default:
      return this.resource.effectiveDateTime;
    }
  }
}

export default Resource;
