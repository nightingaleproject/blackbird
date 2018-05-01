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

1. [Launch the App](https://launch.smarthealthit.org/ehr.html?app=https%3A%2F%2Fnightingaleproject.github.io%2Ffhir-death-refactor%2Flaunch%3Flaunch%3DeyJhIjoiMSIsImYiOiIxIn0%26iss%3Dhttps%253A%252F%252Flaunch.smarthealthit.org%252Fv%252Fr3%252Ffhir&user=)
2. Sign in using the pre-populated provider credentials on the login screen
3. Select a synthetic patient record from the options provided; the app itself will then launch
4. Fill out the death certificate form on each tab of the app; you can select conditions from the patient record to provide cause of death information

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

## Public Domain

This repository constitutes a work of the United States Government and is not
subject to domestic copyright protection under 17 USC § 105. This repository is in
the public domain within the United States, and copyright and related rights in
the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
All contributions to this repository will be released under the CC0 dedication. By
submitting a pull request you are agreeing to comply with this waiver of
copyright interest.

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

## Privacy
This repository contains only non-sensitive, publicly available data and
information. All material and community participation is covered by the
Surveillance Platform [Disclaimer](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md)
and [Code of Conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md).
For more information about CDC's privacy policy, please visit [http://www.cdc.gov/privacy.html](http://www.cdc.gov/privacy.html).

## Contributing
Anyone is encouraged to contribute to the repository by [forking](https://help.github.com/articles/fork-a-repo)
and submitting a pull request. (If you are new to GitHub, you might start with a
[basic tutorial](https://help.github.com/articles/set-up-git).) By contributing
to this project, you grant a world-wide, royalty-free, perpetual, irrevocable,
non-exclusive, transferable license to all users under the terms of the
[Apache Software License v2](http://www.apache.org/licenses/LICENSE-2.0.html) or
later.

All comments, messages, pull requests, and other submissions received through
CDC including this GitHub page are subject to the [Presidential Records Act](http://www.archives.gov/about/laws/presidential-records.html)
and may be archived. Learn more at [http://www.cdc.gov/other/privacy.html](http://www.cdc.gov/other/privacy.html).

## Records
This repository is not a source of government records, but is a copy to increase
collaboration and collaborative potential. All government records will be
published through the [CDC web site](http://www.cdc.gov).

## Notices
Please refer to [CDC's Template Repository](https://github.com/CDCgov/template)
for more information about [contributing to this repository](https://github.com/CDCgov/template/blob/master/CONTRIBUTING.md),
[public domain notices and disclaimers](https://github.com/CDCgov/template/blob/master/DISCLAIMER.md),
and [code of conduct](https://github.com/CDCgov/template/blob/master/code-of-conduct.md).

## Contact Information

For questions or comments, please send email to

    cdc-nvss-feedback-list@lists.mitre.org
