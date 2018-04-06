import React from 'react';
import Welcome from './Welcome';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Welcome/>);
});
