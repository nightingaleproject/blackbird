import React from 'react';
import Validate from './Validate';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Validate/>);
});
