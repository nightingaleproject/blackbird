import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import FormPage from './FormPage';

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

              <Grid>
                <Grid.Row>
                  <Grid.Column width={8}>
                    <Form.Field>
                      <label>Injury at work?</label>
                    </Form.Field>
                    {this.radio('Yes', 'injuryAtWork', 'Yes', { optional: true })}
                    {this.radio('No', 'injuryAtWork', 'No', { optional: true })}
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Form.Field>
                      <label>If transportation injury, specify</label>
                    </Form.Field>
                    {this.radio('Driver/Operator', 'transportationInjury', 'Vehicle driver', { optional: true })}
                    {this.radio('Passenger', 'transportationInjury', 'Passenger', { optional: true })}
                    {this.radio('Pedestrian', 'transportationInjury', 'Pedestrian', { optional: true })}
                    {this.radio('Other', 'transportationInjury', 'Other', { optional: true })}
                  </Grid.Column>
                </Grid.Row>
              </Grid>

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
                  <label>County:</label>
                  {this.input('text', 'locationOfInjuryCounty', { optional: true })}
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

              <Form.Field>
                <label>Describe how injury occurred</label>
              </Form.Field>
              {this.textarea('howInjuryOccurred', { optional: true })}

              {this.nextStepButton('ReviewAndSubmit')}

            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default InjuryQuestionsForm;
