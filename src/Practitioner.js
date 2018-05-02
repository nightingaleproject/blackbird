// Simple wrapper for FHIR Practitioner resource
class Practitioner {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    return this.resource.id;
  }
  get name() {
    const first = this.resource.name[0].given.join(' ');
    const last = this.resource.name[0].family;
    const suffix = this.resource.name[0].suffix.join(' ');
    return `${first} ${last} ${suffix}`;
  }
  get street() {
    if (this.resource.address[0] && this.resource.address[0].line[0]) {
      return this.resource.address[0].line[0];
    }
  }
  get city() {
    if (this.resource.address[0]) {
      return this.resource.address[0].city;
    }
  }
  get state() {
    if (this.resource.address[0]) {
      return this.resource.address[0].state;
    }
  }
  get zip() {
    if (this.resource.address[0]) {
      return this.resource.address[0].postalCode;
    }
  }
}

export default Practitioner;
