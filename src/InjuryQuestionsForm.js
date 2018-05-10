import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import FormPage from './FormPage';

// TODO: Need to add field to describe how injury occurred

class InjuryQuestionsForm extends FormPage {

  render() {

    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('InjuryQuestions')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>

            <Form>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Date of Injury:</label>
                  {this.input('date', 'dateOfInjury', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>Time of Injury:</label>
                  {this.input('time', 'timeOfInjury', { optional: true })}
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>Place of Injury:</label>
                {this.input('text', 'placeOfInjury', { optional: true })}
              </Form.Field>

              <Form.Field>
                <label>Injury at work?</label>
              </Form.Field>
              {this.radio('Yes', 'injuryAtWork', 'yes', { optional: true })}
              {this.radio('No', 'injuryAtWork', 'no', { optional: true })}

              <Form.Field>
                <label>Address of Injury</label>
              </Form.Field>
              <Form.Group>
                <Form.Field width={13}>
                  <label>Street:</label>
                  {this.input('text', 'locationOfInjuryStreet', { optional: true })}
                </Form.Field>
                <Form.Field width={3}>
                  <label>Apt:</label>
                  {this.input('text', 'locationOfInjuryApt', { optional: true })}
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>City:</label>
                  {this.input('text', 'locationOfInjuryCity', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>State:</label>
                  {this.input('text', 'locationOfInjuryState', { optional: true })}
                </Form.Field>
                <Form.Field>
                  <label>Zip Code:</label>
                  {this.input('text', 'locationOfInjuryZip', { optional: true })}
                </Form.Field>
              </Form.Group>

              {this.nextStepButton('ReviewAndSubmit')}

            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default InjuryQuestionsForm;
