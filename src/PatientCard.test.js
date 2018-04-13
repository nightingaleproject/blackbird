import React from 'react';
import Patient from './Patient';
import PatientCard from './PatientCard';
import { mount } from 'enzyme';
import patient from '../fixtures/patient';

it('renders without crashing', () => {
  mount(<PatientCard patient={new Patient(patient)} />);
});
