import moment from 'moment';

// Simple wrapper for FHIR Patient resource
class Patient {
  constructor(resource) {
    this.resource = resource;
  }
  get id() {
    if (this.resource) {
      return this.resource.id || null;
    } else {
      return null;
    }
  }
  get name() {
    if (this.resource && this.resource.name && this.resource.name[0]) {
      const first = this.resource.name[0].given.join(' ') || '';
      const last = this.resource.name[0].family || '';
      let name = `${first} ${last}`;
      name = name.trim();
      if (name.length > 0) {
        return name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get age() {
    if (this.resource) {
      // Calculate either to date of death or to today
      const startDate = this.resource.birthDate;
      const endDate = this.resource.deceasedDateTime || new Date().toISOString();
      if (startDate) {
        return moment(endDate).diff(moment(startDate), 'years') + ' years';
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get deceasedDate() {
    if (this.resource && this.resource.deceasedDateTime) {
      return moment(this.resource.deceasedDateTime).format('YYYY-MM-DD');
    } else {
      return null;
    }
  }
  get deceasedTime() {
    if (this.resource && this.resource.deceasedDateTime) {
      return moment(this.resource.deceasedDateTime).format('HH:mm');
    } else {
      return null;
    }
  }
  get ssn() {
    if (this.resource && this.resource.identifier && this.resource.identifier.length > 0) {
      const ssn = this.resource.identifier.find(
        iden => iden.system === 'http://hl7.org/fhir/sid/us-ssn'
      );
      if (ssn) {
        return ssn.value;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get race() {
    if (this.resource && this.resource.extension && this.resource.extension.length > 0) {
      const race = this.resource.extension.find(
        ext => ext.url === 'http://hl7.org/fhir/StructureDefinition/us-core-race' || ext.url === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race'
      );
      if (
        race &&
        race.valueCodeableConcept &&
        race.valueCodeableConcept.coding['0'] &&
        race.valueCodeableConcept.coding['0'].display
      ) {
        return race.valueCodeableConcept.coding['0'].display;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get ethnicity() {
    if (this.resource && this.resource.extension && this.resource.extension.length > 0) {
      const ethnicity = this.resource.extension.find(
        ext => ext.url === 'http://hl7.org/fhir/StructureDefinition/us-core-ethnicity' || ext.url === 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity'
      );
      if (
        ethnicity &&
        ethnicity.valueCodeableConcept &&
        ethnicity.valueCodeableConcept.coding['0'] &&
        ethnicity.valueCodeableConcept.coding['0'].display
      ) {
        return ethnicity.valueCodeableConcept.coding['0'].display;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get birthPlace() {
    if (this.resource && this.resource.extension && this.resource.extension.length > 0) {
      const birthPlace = this.resource.extension.find(
        ext => ext.url === 'http://standardhealthrecord.org/fhir/extensions/placeOfBirth' || ext.url === 'http://hl7.org/fhir/StructureDefinition/birthPlace'
      );
      if (birthPlace && birthPlace.valueAddress) {
        let birthPlaceCombined = `${birthPlace.valueAddress.city || ''} ${birthPlace.valueAddress.state || ''}`;
        birthPlaceCombined = birthPlaceCombined.replace(/\s/g, '');
        if (birthPlaceCombined.length > 0) {
          return birthPlaceCombined;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get mothersMaidenName() {
    if (this.resource && this.resource.extension && this.resource.extension.length > 0) {
      const mothersMaidenName = this.resource.extension.find(
        ext => ext.url === 'http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName'
      );
      if (mothersMaidenName) {
        return mothersMaidenName.valueString;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get gender() {
    if (this.resource) {
      return this.resource.gender || null;
    } else {
      return null;
    }
  }
  get birthDate() {
    if (this.resource) {
      return this.resource.birthDate || null;
    } else {
      return null;
    }
  }
  get deathDateTime() {
    if (this.resource) {
      const deathDateTime = this.resource.deceasedDateTime || new Date().toISOString();
      return moment(deathDateTime).format('YYYY-MM-DD hh:mm');
    } else {
      return null;
    }
  }
  get address() {
    if (this.resource && this.resource.address) {
      const addr = this.resource.address['0'];
      if (addr) {
        return `${addr.line[0]} ${addr.city} ${addr.state} ${addr.postalCode}`;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  get maritalStatus() {
    if (this.resource) {
      const status = this.resource.maritalStatus;
      if (status && status.coding['0'] && status.coding['0'].code) {
        switch (status.coding['0'].code) {
          case 'A':
            return 'Annulled';
          case 'D':
            return 'Divorced';
          case 'I':
            return 'Interlocutory';
          case 'L':
            return 'Legally';
          case 'M':
            return 'Married';
          case 'P':
            return 'Polygamous';
          case 'S':
            return 'Never Married';
          case 'T':
            return 'Domestic partner';
          case 'U':
            return 'Unmarried';
          case 'W':
            return 'Widowed';
          default:
            return 'Unknown';
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

export default Patient;
