import React from 'react';
import { Grid } from 'semantic-ui-react';
import FormPage from './FormPage';

class Validation extends FormPage {
  render() {
    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('Validation')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <pre>{JSON.stringify(this.props.record, null, 2)}</pre>
          </Grid.Column>
        </Grid.Row>

      </React.Fragment>
    );
  }
}

export default Validation;
