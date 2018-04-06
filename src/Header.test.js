import React from 'react';
import Header from './Header';
import { mount } from 'enzyme';

it('renders without crashing', () => {
  mount(<Header/>);
});
