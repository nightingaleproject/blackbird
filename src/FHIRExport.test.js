import React from 'react';
import Patient from './Patient';
import { recordToFHIR } from './FHIRExport';
import { mount } from 'enzyme';
import recordFixture from '../fixtures/record';
import patientFixture from '../fixtures/patient';

it('generates valid FHIR bundle', () => {
  const decedent = new Patient(patientFixture);
  const deathRecord = recordToFHIR(recordFixture, decedent);

  const util = require('util')

  //header
  expect(deathRecord.resourceType).toBe("Bundle");
  expect(deathRecord.type).toBe("document");

  //composition
  const composition = deathRecord.entry[0].resource
  expect(composition.resourceType).toBe("Composition");
  expect(composition.type.coding[0].system).toBe('http://loinc.org');
  expect(composition.type.coding[0].code).toBe('64297-5');
  expect(composition.type.coding[0].display).toBe('Death certificate');
  expect(composition.type.text).toBe('Death certificate');
  expect(composition.meta.profile).toBe('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-DeathRecordContents');
});
