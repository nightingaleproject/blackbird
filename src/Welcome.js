import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';
import WelcomePlain from './WelcomePlain';
import WelcomeSmart from './WelcomeSmart';

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = { selectedMenuItem: 'plain' };
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  handleMenuClick(event, data) {
    this.setState({ selectedMenuItem: data.name });
  }

  render() {
    const { selectedMenuItem } = this.state;
    return (
      <div>
        <h2>Welcome</h2>
        <p>The purpose of this application is to demonstrate a technical approach for allowing medical certifiers to report and certify to jurisdiction electronic death registration systems (EDRS) from a hospital setting. Note that this is only intended as a technical demonstration; no testing has been performed to determine potential impact on data quality. Source code and documentation can be <a href="https://github.com/nightingaleproject/blackbird">found on GitHub</a>.</p>
        <Menu pointing>
          <Menu.Item name='plain'
                     active={selectedMenuItem === 'plain'}
                     onClick={this.handleMenuClick}>
            Connect to a plain FHIR server
          </Menu.Item>
          <Menu.Item name='smart'
                     active={selectedMenuItem === 'smart'}
                     onClick={this.handleMenuClick}>
            SMART on FHIR standalone launch
          </Menu.Item>
        </Menu>
        { selectedMenuItem === 'plain' ? <WelcomePlain {...this.props}/> : <WelcomeSmart {...this.props}/> }
      </div>
    );
  }

}

export default Welcome;
