import React from 'react';
import Validation from './Validation';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Validation/>);
});
