# FHIR For Death Reporting

This prototype app gives medical certifiers the ability to report and
certify to jurisdiction electronic death registration systems (EDRS)
from a hospital setting. It uses [SMART on FHIR](https://smarthealthit.org/)
to pull decedent information from hospital electronic health record
(EHR) systems and
[FHIR profiles for mortality data](https://nightingaleproject.github.io/fhir-death-record/guide/index.html)
to submit information to EDRS.

This app is based on [software](https://github.com/BioMIBLab/fhir-death)
originally created as part of a collaboration between Georgia Tech and the CDC.

## Installation and Setup for Development or Testing

This is a React app bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). It requires node and yarn to be installed.

To install dependencies before running for the first time, run

`yarn`

To run the app locally for development or testing, run

`yarn start`

To run the test suite, run

`yarn test`
