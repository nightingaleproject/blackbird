import React from 'react';
import Patient from './Patient';
import { mount } from 'enzyme';

it('instantiates', () => {
  const patient = new Patient({ id: 123 });
  expect(patient.id).toBe(123);
});
