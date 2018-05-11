import React from 'react';
import ReviewAndSubmit from './ReviewAndSubmit';
import { mount } from 'enzyme';
import record from '../fixtures/record';

it('renders without crashing', () => {
  mount(<ReviewAndSubmit record={record}/>);
});
