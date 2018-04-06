import React from 'react';
import Timeline from './Timeline';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Timeline/>);
});
