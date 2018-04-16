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
}

export default Practitioner;
