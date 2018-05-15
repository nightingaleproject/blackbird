import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import FormPage from './FormPage';

class AdditionalQuestionsForm extends FormPage {

  render() {

    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('AdditionalQuestions')}
        </Grid.Row>

        <Grid.Row>

          <Grid.Column width={8}>

            <Form>
              <Form.Field>
                <label>Was an Autopsy Performed?</label>
              </Form.Field>
              {this.radio('Yes', 'autopsyPerformed', 'Yes')}
              {this.radio('No', 'autopsyPerformed', 'No')}

              <Form.Field>
                <label>Were Autopsy Findings Available to Complete the Case of Death?</label>
              </Form.Field>
              {this.radio('Yes', 'autopsyAvailable', 'Yes')}
              {this.radio('No', 'autopsyAvailable', 'No')}

              <Form.Field>
                <label>Manner of Death:</label>
              </Form.Field>
              {this.radio('Natural', 'mannerOfDeath', 'Natural')}
              {this.radio('Homicide', 'mannerOfDeath', 'Homicide')}
              {this.radio('Accident', 'mannerOfDeath', 'Accident')}
              {this.radio('Suicide', 'mannerOfDeath', 'Suicide')}
              {this.radio('Pending Investigation', 'mannerOfDeath', 'Pending Investigation')}
              {this.radio('Could not be Determined', 'mannerOfDeath', 'Could not be determined')}
            </Form>

          </Grid.Column>
          <Grid.Column width={8}>

            <Form>
              <Form.Field>
                <label>Did tobacco use contribute to death?</label>
              </Form.Field>
              {this.radio('Yes', 'tobacco', 'Yes')}
              {this.radio('No', 'tobacco', 'No')}
              {this.radio('Probably', 'tobacco', 'Probably')}
              {this.radio('Unknown', 'tobacco', 'Unknown')}

              <Form.Field>
                <label>If female:</label>
              </Form.Field>
              {this.radio('Not pregnant within past year', 'pregnancy', 'Not pregnant within past year', { optional: true })}
              {this.radio('Pregnant at time of death', 'pregnancy', 'Pregnant at time of death', { optional: true })}
              {this.radio('Not pregnant, but pregnant within 42 days of death', 'pregnancy', 'Not pregnant, but pregnant within 42 days of death', { optional: true })}
              {this.radio('Not pregnant, but pregnant 43 days to 1 year before death', 'pregnancy', 'Not pregnant, but pregnant 43 days to 1 year before death', { optional: true })}
              {this.radio('Unknown if pregnant within the past year', 'pregnancy', 'Unknown if pregnant within the past year', { optional: true })}

              {this.nextStepButton('InjuryQuestions')}
            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default AdditionalQuestionsForm;
