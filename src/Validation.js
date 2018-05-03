import React from 'react';
import { Grid } from 'semantic-ui-react';
import FormPage from './FormPage';
import FHIRExport from './FHIRExport'

class Validation extends FormPage {
  render() {
    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('Validation')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <pre>{JSON.stringify(new FHIRExport({record: this.props.record, patient: this.props.patient}), null, 2)}</pre>
          </Grid.Column>
        </Grid.Row>

      </React.Fragment>
    );
  }
}

export default Validation;
