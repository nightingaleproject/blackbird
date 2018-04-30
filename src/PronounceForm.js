import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import FormPage from './FormPage';

class PronounceForm extends FormPage {

  render() {

    return (

      <React.Fragment>

        <Grid.Row>
          {this.menu('Pronouncing')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>

            <Form>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Date Pronounced Dead:</label>
                  {this.input('date', 'pronouncedDeathDate')}
                </Form.Field>
                <Form.Field>
                  <label>Actual or Presumed Date of Death:</label>
                  {this.input('date', 'actualDeathDate')}
                </Form.Field>
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Time Pronounced Dead:</label>
                  {this.input('time', 'pronouncedDeathTime')}
                </Form.Field>
                <Form.Field>
                  <label>Actual or Presumed Time of Death:</label>
                  {this.input('time', 'actualDeathTime')}
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>Was Medical Examiner or Coroner Contacted?:</label>
              </Form.Field>
              {this.radio('Yes', 'examinerContacted', 'yes')}
              {this.radio('No', 'examinerContacted', 'no')}

              <h2>Person Pronouncing Death</h2>

              <Form.Field>
                <label>Type your full name to electronically sign this document:</label>
                {this.input('text', 'certifierName')}
              </Form.Field>

              <Form.Field>
                <label>License Number:</label>
                {this.input('text', 'certifierNumber')}
              </Form.Field>
            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default PronounceForm;
