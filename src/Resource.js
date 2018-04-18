// Simple wrapper for FHIR resources (conditions, medications, procedures, observations)
class Resource {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    return this.resource.id;
  }
  get description() {
    try {
      switch (this.resource.resourceType) {
      case 'Condition':
      case 'Procedure':
      case 'Observation':
      default:
        return this.resource.code.coding[0].display;
      case 'MedicationRequest':
        // TODO: THIS IS A HACK
        if (this.medication) {
          return this.medication.code.coding[0].display;
        } else {
          return this.resource.medicationCodeableConcept.coding[0].display;
        }
      }
    } catch(err) {
      return null;
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
