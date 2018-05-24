import './IE.js';
import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import Loading from './Loading';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

// See if we're being launched from within a SMART on FHIR context
switch (_.last(window.location.pathname.split('/'))) {
case 'launch':
  const scope = 'patient/*.read user/Patient.read openid profile online_access';
  const clientId = '17eff9ba-9445-426f-a457-b49ee385464e';
  const launchUri = window.location.protocol + "//" + window.location.host + window.location.pathname;
  const redirectUri = launchUri.replace('launch', 'smart');
  FHIR.oauth2.authorize({ client_id: clientId, scope: scope, redirect_uri: redirectUri });
  ReactDOM.render(<Loading />, document.getElementById('root'));
  break;
case 'smart':
  ReactDOM.render(<App smart/>, document.getElementById('root'));
  break;
default:
  ReactDOM.render(<App />, document.getElementById('root'));
  break;
}
registerServiceWorker();
