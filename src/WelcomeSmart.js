import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, Button } from 'semantic-ui-react';
import { SMARTWrap } from './FHIRClientWrapper';
import Loading from './Loading';

const redirectURI = window.location.href + 'standalone'

class WelcomeSmart extends Component {

  constructor(props) {
    super(props);
    // See if we have state from previous use stored in local browser storage
    const defaultState = { fhirServer: '', clientId: '', secret: '' };
    const localState = localStorage['stateWelcomeSmart'];
    if (localState) {
      this.state = Object.assign({}, defaultState, JSON.parse(localState));
    } else {
      this.state = defaultState;
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({ [target.name]: target.value }, () => {
      // Store all state in local browser storage too to preserve between uses
      localStorage['stateWelcomeSmart'] = JSON.stringify(this.state);
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const server = this.state.fhirServer;
    const client = {
      scope: 'patient/*.read user/Patient.read launch openid profile online_access',
      client_id: this.state.clientId,
      redirect_uri: redirectURI
    }
    if (this.state.secret) {
      client['secret'] = this.state.secret;
    }
    SMARTWrap.authorize({ server: server, client: client });
    ReactDOM.render(<Loading />, document.getElementById('root'));
  }

  render() {
    return (
      <div>
        <h3>Specify information for the SMART on FHIR server to launch against</h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>FHIR server:</label>
            <input type="text" name="fhirServer" value={this.state.fhirServer} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Client ID:</label>
            <input type="text" name="clientId" value={this.state.clientId} onChange={this.handleChange} />
          </Form.Field>
          <Form.Field>
            <label>Secret (if needed):</label>
            <input type="text" name="secret" value={this.state.secret} onChange={this.handleChange} />
          </Form.Field>
          <p>Note: Specify <tt>{redirectURI}</tt> as the redirect URL on the SMART on FHIR server.</p>
          <p>Note: The information you enter above is stored in your local browser state to make it available across uses.</p>
          <Button primary type="submit">Connect</Button>
        </Form>
      </div>
    );
  }

}

export default WelcomeSmart;
