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

              <Form.Group widths='equal'>
                <Form.Field>
                  <Form.Group grouped>
                    <label>Place of Death Type:</label>
                    {this.radio('Dead on arrival at hospital', 'placeOfDeathType', 'Dead on arrival at hospital', { optional: true })}
                    {this.radio('Death in home', 'placeOfDeathType', 'Death in home', { optional: true })}
                    {this.radio('Death in hospice', 'placeOfDeathType', 'Death in hospice', { optional: true })}
                    {this.radio('Death in hospital', 'placeOfDeathType', 'Death in hospital', { optional: true })}
                    {this.radio('Death in hospital-based emergency department or outpatient department', 'placeOfDeathType', 'Death in hospital-based emergency department or outpatient department', { optional: true })}
                    {this.radio('Death in nursing home or long term care facility', 'placeOfDeathType', 'Death in nursing home or long term care facility', { optional: true })}
                  </Form.Group>
                </Form.Field>
                <Form.Field>
                  <Form.Group grouped>
                    <label>Was Medical Examiner or Coroner Contacted?</label>
                    {this.radio('Yes', 'examinerContacted', 'Yes')}
                    {this.radio('No', 'examinerContacted', 'No')}
                  </Form.Group>
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>Name and Address of Place of Death</label>
              </Form.Field>
              <Form.Field>
                <label>Name:</label>
                {this.input('text', 'placeOfDeathName')}
              </Form.Field>
              <Form.Group>
                <Form.Field width={13}>
                  <label>Street:</label>
                  {this.input('text', 'placeOfDeathStreet', { optional: true })}
                </Form.Field>
                <Form.Field width={3}>
                  <label>Apt:</label>
                  {this.input('text', 'placeOfDeathApt', { optional: true })}
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>City:</label>
                  {this.input('text', 'placeOfDeathCity', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>County:</label>
                  {this.input('text', 'placeOfDeathCounty', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>State:</label>
                  {this.input('text', 'placeOfDeathState', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>Zip Code:</label>
                  {this.input('text', 'placeOfDeathZip', { optional: true })}
                </Form.Field>
              </Form.Group>

              <h2>Person Pronouncing Death</h2>

              <Form.Field>
                <label>Type your full name to electronically sign this document:</label>
                {this.input('text', 'pronouncerName')}
              </Form.Field>

              <Form.Field>
                <label>License Number:</label>
                {this.input('text', 'pronouncerNumber')}
              </Form.Field>

              {this.nextStepButton('CauseOfDeath')}

            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default PronounceForm;
