import React from 'react';
import { Menu } from 'semantic-ui-react';

function Header(props) {
  return (
    <Menu>
      <Menu.Item header>U.S. Standard Certificate of Death</Menu.Item>
      <Menu.Item name='about' position='right' />
    </Menu>
  );
}

export default Header;
