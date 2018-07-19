import React from 'react';
import moment from 'moment';
import Patient from './Patient';
import { recordToFHIR } from './FHIRExport';
import { mount } from 'enzyme';
import recordFixture from '../fixtures/record';
import patientFixture from '../fixtures/patient';

it('generates valid FHIR bundle', () => {
  const decedentRecord = new Patient(patientFixture);
  const deathRecord = recordToFHIR(recordFixture, decedentRecord);

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

  expect(composition.section[0].code.coding[0].system).toBe('http://loinc.org');
  expect(composition.section[0].code.coding[0].code).toBe('69453-9');
  expect(composition.section[0].code.coding[0].display).toBe('Cause of death');
  expect(composition.section[0].code.text).toBe('Cause of death');
  expect(composition.section[0].entry.length).toBe(8);

  //decedent
  const decedent = deathRecord.entry[1].resource
  expect(decedent.resourceType).toBe("Patient")

  expect(decedent.name[0].given[0]).toBe("Nils374");
  expect(decedent.name[0].family).toBe("Doyle303");
  expect(decedent.name[0].use).toBe("official");

  expect(decedent.birthDate).toBe('1971-07-25');

  expect(moment(decedent.deceasedDateTime).valueOf()).toBe(moment('2018-04-19T01:30:00-04:00').valueOf());

  expect(decedent.address[0].type).toBe('postal');
  expect(decedent.address[0].line[0]).toBe('37700 Nannie Island');
  expect(decedent.address[0].city).toBe('Wareham');
  expect(decedent.address[0].state).toBe('MA');
  expect(decedent.address[0].postalCode).toBe('02571');

  expect(decedent.gender).toBe('female');

  //certifier
  const certifier = deathRecord.entry[2].resource
  expect(certifier.resourceType).toBe("Practitioner");

  expect(certifier.name[0].given[0]).toBe("Example");
  expect(certifier.name[0].family).toBe("Pronouncer");
  expect(certifier.name[0].use).toBe("official");

  expect(certifier.extension[0].url).toBe('http://nightingaleproject.github.io/fhirDeathRecord/StructureDefinition/sdr-deathRecord-CertifierType-extension');
  expect(certifier.extension[0].valueCodeableConcept.coding[0].system).toBe('http://snomed.info/sct');
  expect(certifier.extension[0].valueCodeableConcept.coding[0].code).toBe('434651000124107');
  expect(certifier.extension[0].valueCodeableConcept.coding[0].display).toBe('Physician (Pronouncer and Certifier)');
  expect(certifier.extension[0].valueCodeableConcept.text).toBe('Physician (Pronouncer and Certifier)');

  expect(certifier.identifier[0].use).toBe('official');
  expect(certifier.identifier[0].value).toBe('12345');

  expect(certifier.qualification.code.coding[0].system).toBe('http://hl7.org/fhir/v2/0360/2.7');
  expect(certifier.qualification.code.coding[0].code).toBe('MD');
  expect(certifier.qualification.code.coding[0].display).toBe('Doctor of Medicine');
  expect(certifier.qualification.code.text).toBe('Doctor of Medicine');

  //cause of death
  const causeOfDeath = deathRecord.entry[3].resource
  expect(causeOfDeath.resourceType).toBe('Condition');
  expect(causeOfDeath.clinicalStatus).toBe('active');
  expect(causeOfDeath.text.status).toBe('additional');
  expect(causeOfDeath.text.div).toBe('<div xmlns=\'http://www.w3.org/1999/xhtml\'>Diabetes</div>');
  expect(moment(causeOfDeath.onsetString).valueOf()).toBe(moment('2006-03-05T05:08:45-05:00').valueOf());

  //actual or presumed date of death
  const actualOrPresumedDateOfDeath = deathRecord.entry[4].resource
  expect(actualOrPresumedDateOfDeath.resourceType).toBe('Observation');
  expect(actualOrPresumedDateOfDeath.status).toBe('final');
  expect(actualOrPresumedDateOfDeath.code.coding[0].system).toBe('http://loinc.org');
  expect(actualOrPresumedDateOfDeath.code.coding[0].code).toBe('81956-5');
  expect(actualOrPresumedDateOfDeath.code.coding[0].display).toBe('Date and time of death');
  expect(actualOrPresumedDateOfDeath.code.text).toBe('Date and time of death');
  expect(moment(actualOrPresumedDateOfDeath.valueDateTime).valueOf()).toBe(moment('2018-04-19T01:30:00-04:00').valueOf());
  expect(actualOrPresumedDateOfDeath.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //autopsy performed
  const autopsyPerformed = deathRecord.entry[5].resource
  expect(autopsyPerformed.resourceType).toBe('Observation');
  expect(autopsyPerformed.status).toBe('final');
  expect(autopsyPerformed.code.coding[0].system).toBe('http://loinc.org');
  expect(autopsyPerformed.code.coding[0].code).toBe('85699-7');
  expect(autopsyPerformed.code.coding[0].display).toBe('Autopsy was performed');
  expect(autopsyPerformed.code.text).toBe('Autopsy was performed');
  expect(autopsyPerformed.valueBoolean).toBe(false);
  expect(autopsyPerformed.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //autopsy results available
  const autopsyResultsAvailable = deathRecord.entry[6].resource
  expect(autopsyResultsAvailable.resourceType).toBe('Observation');
  expect(autopsyResultsAvailable.status).toBe('final');
  expect(autopsyResultsAvailable.code.coding[0].system).toBe('http://loinc.org');
  expect(autopsyResultsAvailable.code.coding[0].code).toBe('69436-4');
  expect(autopsyResultsAvailable.code.coding[0].display).toBe('Autopsy results available');
  expect(autopsyResultsAvailable.code.text).toBe('Autopsy results available');
  expect(autopsyResultsAvailable.valueBoolean).toBe(false);
  expect(autopsyResultsAvailable.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //date pronounced dead
  const datePronouncedDead = deathRecord.entry[7].resource
  expect(datePronouncedDead.resourceType).toBe('Observation');
  expect(datePronouncedDead.status).toBe('final');
  expect(datePronouncedDead.code.coding[0].system).toBe('http://loinc.org');
  expect(datePronouncedDead.code.coding[0].code).toBe('80616-6');
  expect(datePronouncedDead.code.coding[0].display).toBe('Date and time pronounced dead');
  expect(datePronouncedDead.code.text).toBe('Date and time pronounced dead');
  expect(moment(datePronouncedDead.valueDateTime).valueOf()).toBe(moment('2018-04-19T03:00:00-04:00').valueOf());
  expect(datePronouncedDead.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //manner of death
  const mannerOfDeath = deathRecord.entry[8].resource
  expect(mannerOfDeath.resourceType).toBe('Observation');
  expect(mannerOfDeath.status).toBe('final');
  expect(mannerOfDeath.code.coding[0].system).toBe('http://loinc.org');
  expect(mannerOfDeath.code.coding[0].code).toBe('69449-7');
  expect(mannerOfDeath.code.coding[0].display).toBe('Manner of death');
  expect(mannerOfDeath.code.text).toBe('Manner of death');
  expect(mannerOfDeath.valueCodeableConcept.coding[0].system).toBe('http://snomed.info/sct');
  expect(mannerOfDeath.valueCodeableConcept.coding[0].code).toBe('38605008');
  expect(mannerOfDeath.valueCodeableConcept.coding[0].display).toBe('Natural');
  expect(mannerOfDeath.valueCodeableConcept.text).toBe('Natural');
  expect(mannerOfDeath.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //medical examiner or coroner contacted
  const medicalExaminerOrCoronerContacted = deathRecord.entry[9].resource
  expect(medicalExaminerOrCoronerContacted.resourceType).toBe('Observation');
  expect(medicalExaminerOrCoronerContacted.status).toBe('final');
  expect(medicalExaminerOrCoronerContacted.code.coding[0].system).toBe('http://loinc.org');
  expect(medicalExaminerOrCoronerContacted.code.coding[0].code).toBe('74497-9');
  expect(medicalExaminerOrCoronerContacted.code.coding[0].display).toBe('Medical examiner or coroner was contacted');
  expect(medicalExaminerOrCoronerContacted.code.text).toBe('Medical examiner or coroner was contacted');
  expect(medicalExaminerOrCoronerContacted.valueBoolean).toBe(false);
  expect(medicalExaminerOrCoronerContacted.subject.reference.substring(0, 9)).toBe('urn:uuid:');

  //tobacco use contributed to death
  const tobaccoUseContributedToDeath = deathRecord.entry[10].resource
  expect(tobaccoUseContributedToDeath.resourceType).toBe('Observation');
  expect(tobaccoUseContributedToDeath.status).toBe('final');
  expect(tobaccoUseContributedToDeath.code.coding[0].system).toBe('http://loinc.org');
  expect(tobaccoUseContributedToDeath.code.coding[0].code).toBe('69443-0');
  expect(tobaccoUseContributedToDeath.code.coding[0].display).toBe('Did tobacco use contribute to death');
  expect(tobaccoUseContributedToDeath.code.text).toBe('Did tobacco use contribute to death');
  expect(tobaccoUseContributedToDeath.valueCodeableConcept.coding[0].system).toBe('http://snomed.info/sct');
  expect(tobaccoUseContributedToDeath.valueCodeableConcept.coding[0].code).toBe('373066001');
  expect(tobaccoUseContributedToDeath.valueCodeableConcept.coding[0].display).toBe('Yes');
  expect(tobaccoUseContributedToDeath.valueCodeableConcept.text).toBe('Yes');
  expect(tobaccoUseContributedToDeath.subject.reference.substring(0, 9)).toBe('urn:uuid:');


});
