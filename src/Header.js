import React from 'react';
import { Menu } from 'semantic-ui-react';
import PatientCard from './PatientCard';

function Header(props) {
  return (
    <div>
      <Menu>
        <Menu.Item header>U.S. Standard Certificate of Death</Menu.Item>
        <Menu.Item name='about' position='right' />
      </Menu>
      <PatientCard patient={props.patient} />
    </div>
  );
}

export default Header;
