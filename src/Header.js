import React from 'react';
import { Menu } from 'semantic-ui-react';

function Header(props) {
  return (
    <Menu color='blue' inverted attached>
      <Menu.Item header><h2>Blackbird</h2></Menu.Item>
      <Menu.Item name='About' position='right' onClick={() => window.location = 'https://github.com/nightingaleproject/blackbird'} />
    </Menu>
  );
}

export default Header;
