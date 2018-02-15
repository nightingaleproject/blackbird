// Simple wrapper for FHIR Patient resource
class Patient {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    return this.resource.id;
  }
  get name() {
    const first = this.resource.name[0].given.join(' ');
    const last = this.resource.name[0].family;
    return `${first} ${last}`;
  }
}

export default Patient;
