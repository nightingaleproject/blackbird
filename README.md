# Blackbird: FHIR For Death Reporting

This proof-of-concept application demonstrates a technical approach
for allowing medical certifiers to report and certify to jurisdiction
electronic death registration systems (EDRS) from a hospital
setting. Note that this is only intended as a technical demonstration;
no testing has been performed to determine potential impact on data
quality. It uses
[SMART on FHIR](https://smarthealthit.org/)
to pull decedent information from hospital electronic health record
(EHR) systems and
[FHIR profiles for mortality data](http://hl7.org/fhir/us/vrdr/2019May/)
to submit information to EDRS. Note that the version of the VRDR IG
currently supported by Blackbird is not the most recent version of
that standard.

## Background

Mortality data is collected, analyzed, and shared by jurisdictions
across the United States to provide insight into important trends in
health, including the impact of chronic conditions, progress on
reducing deaths due to motor vehicle accidents, and the evolving
challenge of substance abuse. Medical certifiers, who determine and
certify cause of death, have access to electronic systems that contain
information about the decedent, including demographic data and medical
information relevant to determining the cause of death. By connecting
these systems that have existing data with systems used to collect
death records, and providing certifiers with easier access to the
information they need while certifying, we can reduce the burden on
certifiers, improve data quality, and improve timeliness of data
collection and reporting. This app demonstrates the use of FHIR to
both read decedent data from an EHR and submit mortality data to an
EDRS.

## Try It Out

You can see how the app works by testing it in the SMART on FHIR
Sandbox environment, using synthetic patient data. This simulates the
experience of a certifier running the app from within an EHR.

1. [Launch the App](https://launch.smarthealthit.org/ehr.html?app=https%3A%2F%2Fnightingaleproject.github.io%2Fblackbird%2Flaunch%3Flaunch%3DeyJhIjoiMSIsImYiOiIxIn0%26iss%3Dhttps%253A%252F%252Flaunch.smarthealthit.org%252Fv%252Fr3%252Ffhir&user=)
2. Sign in using the pre-populated provider credentials on the login screen
3. Select a synthetic patient record from the options provided; the app itself will then launch
4. Fill out the death certificate form on each tab of the app; you can select conditions from the patient record to provide cause of death information

You can also try the app against a FHIR server or via standalone SMART on FHIR launch by using [this version](https://nightingaleproject.github.io/blackbird/).

## Installation and Setup for Development or Testing

This is a React app bootstrapped with
[Create React App](https://github.com/facebookincubator/create-react-app).
It requires node and yarn to be installed.

To install dependencies before running for the first time, run

`yarn`

To run the app locally for development or testing, run

`yarn start`

To run the test suite, run

`yarn test`

## License

The repository utilizes code licensed under the terms of the Apache Software
License and therefore is licensed under ASL v2 or later.

This source code in this repository is free: you can redistribute it and/or modify it under
the terms of the Apache Software License version 2, or (at your option) any
later version.

This source code in this repository is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the Apache Software License for more details.

You should have received a copy of the Apache Software License along with this
program. If not, see http://www.apache.org/licenses/LICENSE-2.0.html

The source code forked from other open source projects will inherit its license.

## Contact Information

For questions or comments, please send email to

    cdc-nvss-feedback-list@lists.mitre.org
