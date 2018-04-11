import React from 'react';
import ReactDOM from 'react-dom';
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
if (window.location.pathname === '/launch') {
  FHIR.oauth2.authorize({
    "client_id": "fhir_death",
    "scope":  "patient/*.read"
  });
  ReactDOM.render(<Loading />, document.getElementById('root'));
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
}
