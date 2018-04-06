import React from 'react';
import PronounceForm from './PronounceForm';
import { mount } from 'enzyme';
import record from '../fixtures/record';

it('renders without crashing', () => {
  mount(<PronounceForm record={record} handleRecordChange={() => {}}/>);
});
