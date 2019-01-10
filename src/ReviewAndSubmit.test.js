import React from 'react';
import ReviewAndSubmit from './ReviewAndSubmit';
import { mount } from 'enzyme';
import Patient from './Patient';
import record from '../fixtures/record';
import patientRecord from '../fixtures/patient';

const patient = new Patient(patientRecord);

it('renders without crashing', () => {
  mount(<ReviewAndSubmit record={record} patient={patient}/>);
});
