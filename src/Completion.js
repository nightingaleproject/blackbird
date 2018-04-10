import _ from 'lodash';

const Completion = {

  // Register that a particular field is presented on a step
  register(field, step) {
    this.fields[step] = _.union(this.fields[step] || [], [field])
  },

  // Return result of whether a particular step is complete given the overall record
  isComplete(step, record) {
    const stepFields = this.fields[step];
    if (!stepFields) {
      // Step not yet visited, so nothing filled out
      return false;
    }
    const relevantRecordFields = _.pick(record, stepFields);
    const completedFieldCount = _.chain(relevantRecordFields).values().filter((value) => value).value().length;
    const totalFieldCount = stepFields.length;
    return completedFieldCount === totalFieldCount;
  },

  // Place to store the fields that appear on each step
  fields: {}
}

export default Completion;
