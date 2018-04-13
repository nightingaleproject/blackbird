import React from 'react';
import AdditionalQuestionsForm from './AdditionalQuestionsForm';
import { mount } from 'enzyme';
import record from '../fixtures/record';

it('renders without crashing', () => {
  mount(<AdditionalQuestionsForm record={record} handleRecordChange={() => {}}/>);
});
