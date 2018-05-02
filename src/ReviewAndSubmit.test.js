import React from 'react';
import ReviewAndSubmit from './ReviewAndSubmit';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<ReviewAndSubmit/>);
});
