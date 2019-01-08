import moment from 'moment';

// Helper function for formatting a date
function formatDate(date) {
  if (date) {
    return moment(date).format('MMMM Do YYYY');
  }
}

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
      case 'MedicationOrder': return new MedicationOrder(resource);
      default: return new Resource(resource);
    }
  }

  get id() {
    return this.resource.id;
  }

  get description() {
    return this.resource.code.coding[0].display;
  }

  get formattedStartDate() {
    return formatDate(this.startDate);
  }

  get formattedEndDate() {
    return formatDate(this.endDate);
  }

  get formattedDateRange() {
    if (this.formattedStartDate && this.formattedEndDate && this.formattedStartDate !== this.formattedEndDate) {
      return `${this.formattedStartDate} through ${this.formattedEndDate}`;
    } else if (this.startDate) {
      return this.formattedStartDate;
    }
  }
}

class Condition extends Resource {
  get startDate() {
    return this.resource.onsetDateTime;
  }
  get endDate() {
    return this.resource.abatementDateTime;
  }
}

class Procedure extends Resource {
  get startDate() {
    return this.resource.performedDateTime || this.resource.performedPeriod.start;
  }
  get endDate() {
    if (this.resource.performedPeriod) {
      return this.resource.performedPeriod.end;
    }
  }
  get additionalText() {
    if (this.resource.reasonReference && this.resource.reasonReference[0] && this.resource.reasonReference[0].display) {
      return `Reason: ${this.resource.reasonReference[0].display}`;
    }
  }
}

class Observation extends Resource {
  get startDate() {
    return this.resource.effectiveDateTime;
  }
  get endDate() {
    return this.resource.effectiveDateTime;
  }
  get additionalText() {
    if (this.resource.valueQuantity && this.resource.valueQuantity.value) {
      return `Value: ${this.resource.valueQuantity.value} ${this.resource.valueQuantity.unit}`;
    }
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
  get startDate() {
    return this.resource.dateWritten || this.resource.authoredOn;
  }
  get endDate() {
    return this.resource.dateWritten || this.resource.authoredOn;
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

class MedicationOrder extends Resource {
  get description() {
    return this.resource.medicationCodeableConcept.coding[0].display;
  }
  get startDate() {
    return this.resource.dateWritten || this.resource.authoredOn;
  }
  get endDate() {
    return this.resource.dateWritten || this.resource.authoredOn;
  }
}

export default Resource;
