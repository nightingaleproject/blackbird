import React from 'react';
import { Menu } from 'semantic-ui-react';

function Header(props) {
  return (
    <Menu color='blue' inverted attached>
      <Menu.Item header><h2>U.S. Standard Certificate of Death</h2></Menu.Item>
      <Menu.Item name='about' position='right' />
    </Menu>
  );
}

export default Header;
