import _ from 'lodash';

// Simple wrapper for FHIR Practitioner resource
class Practitioner {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    return this.resource.id;
  }
  get name() {
    // TODO: Common code with Patient.js
    if (this.resource && this.resource.name) {
      // Handle name as an array (take the first) or a singleton
      let resourceName = _.isArray(this.resource.name) ? this.resource.name[0] : this.resource.name;
      let names = [];
      names = names.concat(resourceName.given);
      names = names.concat(resourceName.family);
      names = names.concat(resourceName.suffix);
      let name = names.join(' ').trim();
      if (name.length > 0) {
        return name;
      }
    }
    return null;
  }
  get street() {
    if (this.resource.address && this.resource.address[0] && this.resource.address[0].line[0]) {
      return this.resource.address[0].line[0];
    }
    return null;
  }
  get city() {
    if (this.resource.address && this.resource.address[0]) {
      return this.resource.address[0].city;
    }
    return null;
  }
  get county() {
    if (this.resource.address && this.resource.address[0]) {
      return this.resource.address[0].district;
    }
    return null;
  }
  get state() {
    if (this.resource.address && this.resource.address[0]) {
      return this.resource.address[0].state;
    }
    return null;
  }
  get zip() {
    if (this.resource.address && this.resource.address[0]) {
      return this.resource.address[0].postalCode;
    }
    return null;
  }
}

export default Practitioner;
