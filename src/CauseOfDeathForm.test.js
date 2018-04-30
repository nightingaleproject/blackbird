import React from 'react';
import CauseOfDeathForm from './CauseOfDeathForm';
import { mount } from 'enzyme';
import record from '../fixtures/record';

it('renders without crashing', () => {
  mount(<CauseOfDeathForm record={record} conditions={[]} selectedConditions={[]} medications={[]} procedures={[]} observations={[]} handleRecordChange={() => {}}/>);
});
