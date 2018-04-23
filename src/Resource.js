import moment from 'moment';
//import fhirpath from 'fhirpath.js';

import _ from 'lodash';
function fhirpathish(resource, path) {
  if (path.length === 0) {
    return [];
  }
  if (!path.includes('.')) {
    return resource[path];
  }
  const [fullpath, first, rest] = path.match(/([^.]+)\.(.+)/);
  const value = resource[first];
  if (_.isUndefined(value) || _.isString(value)) {
    return [];
  }
  if (_.isArray(value)) {
    return _.compact(_.flatten(value.map((v) => fhirpathish(v, rest))));
  }
  if (_.isObject(value)) {
    return _.flatten([fhirpathish(value, rest)]);
  }
  throw('Unexpected value found in resource');
}

const fhirpath = {
  evaluate: fhirpathish
}


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
    this.pathCache = {};
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

  // Given a FHIR path return the first resulting expression from this resource
  path(path) {
    if (this.pathCache.hasOwnProperty(path)) {
      return this.pathCache[path];
    }
    return this.pathCache[path] = fhirpath.evaluate(this.resource, path)[0];
  }

  get id() {
    return this.resource.id;
  }

  get description() {
    return this.path('code.text') || this.path('code.coding.display');
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
    return this.resource.performedDateTime || this.path('performedPeriod.start');
  }
  get endDate() {
    return this.path('performedPeriod.end');
  }
  get additionalText() {
    if (this.path('reasonReference.display')) {
      return `Reason: ${this.path('reasonReference.display')}`;
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
    if (this.path('valueQuantity.value')) {
      return `Result: ${this.path('valueQuantity.value')} ${this.path('valueQuantity.unit')}`;
    }
  }
}

class MedicationRequest extends Resource {
  constructor(resource, medicationResource = null) {
    super(resource);
    this.medicationResource = medicationResource;
  }
  // Given a FHIR path return the first resulting expression from the medication resource (if present)
  mrPath(path) {
    if (this.medicationResource) {
      return fhirpath.evaluate(this.medicationResource, path)[0];
    }
  }
  get description() {
    return this.mrPath('code.coding.display') || this.path('medicationCodeableConcept.coding.display');
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
      const medicationId = this.path('medicationReference.reference').split('/')[1];
      return smart.api.read({ type: 'Medication', id: medicationId }).then((response) => {
        return new MedicationRequest(this.resource, response.data);
      });
    } else {
      return Promise.resolve(new MedicationRequest(this.resource));
    }
  }
}

export default Resource;
