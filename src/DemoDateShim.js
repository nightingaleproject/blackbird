import moment from 'moment';

// For demo purposes: if we get a deceased patient from the EHR, adjust dates to make today the date of death
// and all other dates adjusted relatively, with a time of death of 2 hours previous to the demo

const DemoDateShim = {
  // Given a patient, get the death date and calculate the needed adjustment
  setup(patient) {
    if (patient.resource.deceasedDateTime) {
      const deathDate = moment(patient.resource.deceasedDateTime);
      if (deathDate < moment()) {
        this.adjustment = moment.duration(moment().diff(deathDate));
        this.adjustment.subtract(2, 'h');
      }
    }
  },
  // Given a moment date, adjust it
  adjust(date) {
    if (this.adjustment) {
      return date.add(this.adjustment);
    } else {
      return date;
    }
  }
}

export default DemoDateShim;
