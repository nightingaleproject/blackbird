import React from 'react';
import InjuryQuestionsForm from './InjuryQuestionsForm';
import { mount } from 'enzyme';
import record from '../fixtures/record';

it('renders without crashing', () => {
  mount(<InjuryQuestionsForm record={record} handleRecordChange={() => {}}/>);
});
