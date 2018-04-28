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

## Trying it out

You can see how the app works by testing it in the SMART on FHIR Sandbox environment, using synthetic patient data. This simulates the experience of a provider running the app from within an EHR.

1. [Launch the App](https://launch.smarthealthit.org/ehr.html?app=https%3A%2F%2Fnightingaleproject.github.io%2Ffhir-death-refactor%2Flaunch%3Flaunch%3DeyJhIjoiMSIsImYiOiIxIn0%26iss%3Dhttps%253A%252F%252Flaunch.smarthealthit.org%252Fv%252Fr3%252Ffhir&user=)
2. Sign in using the pre-populated provider credentials on the login screen
3. Select a synthethic patient record from the options provided; the app itself will then launch
4. Fill out the death certificate form on each tab of the app; you can select conditions from the patient record to provide cause of death information

## Installation and Setup for Development or Testing

This is a React app bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). It requires node and yarn to be installed.

To install dependencies before running for the first time, run

`yarn`

To run the app locally for development or testing, run

`yarn start`

To run the test suite, run

`yarn test`
