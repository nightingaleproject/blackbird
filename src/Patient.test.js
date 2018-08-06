import React from 'react';
import Patient from './Patient';
import { mount } from 'enzyme';
import patientFixture from '../fixtures/patient';

it('instantiates with valid data', () => {
  const patient = new Patient(patientFixture);
  expect(patient.id).toBe('58b3663e3425def0f0f6960a');
  expect(patient.name).toBe('Nils374 Doyle303');
  expect(patient.age).toBe('47 years');
  expect(patient.ssn).toBe('999571381');
  expect(patient.race).toBe('White');
  expect(patient.ethnicity).toBe('Nonhispanic');
  expect(patient.birthPlace).toBe('BostonMA');
  expect(patient.mothersMaidenName).toBe('Destiney812 Conn2');
  expect(patient.gender).toBe('female');
  expect(patient.birthDate).toBe('1971-07-25');
  expect(patient.address).toBe('37700 Nannie Island Wareham MA 02571');
  expect(patient.maritalStatus).toBe('Never Married');
});

it('instantiates even with a blank resource and blank extension/identifier', () => {
  const patient = new Patient({ resource: { extension: [], identifier: [] } });
  expect(patient.id).toBe(null);
  expect(patient.name).toBe(null);
  expect(patient.age).toBe(null);
  expect(patient.ssn).toBe(null);
  expect(patient.race).toBe(null);
  expect(patient.ethnicity).toBe(null);
  expect(patient.birthPlace).toBe(null);
  expect(patient.mothersMaidenName).toBe(null);
  expect(patient.gender).toBe(null);
  expect(patient.birthDate).toBe(null);
  expect(patient.address).toBe(null);
  expect(patient.maritalStatus).toBe(null);
});

it('instantiates even with nothing', () => {
  const patient = new Patient();
  expect(patient.id).toBe(null);
  expect(patient.name).toBe(null);
  expect(patient.age).toBe(null);
  expect(patient.ssn).toBe(null);
  expect(patient.race).toBe(null);
  expect(patient.ethnicity).toBe(null);
  expect(patient.birthPlace).toBe(null);
  expect(patient.mothersMaidenName).toBe(null);
  expect(patient.gender).toBe(null);
  expect(patient.birthDate).toBe(null);
  expect(patient.address).toBe(null);
  expect(patient.maritalStatus).toBe(null);
});
