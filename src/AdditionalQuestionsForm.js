import React from 'react';
import { Grid, Form, Button } from 'semantic-ui-react';
import FormPage from './FormPage';

class AdditionalQuestionsForm extends FormPage {

  render() {

    return (
      <Grid.Row>

        {this.menu('AdditionalQuestions')}

        <Form>

          <Form.Field>
            <label>Was an Autopsy Performed?:</label>
          </Form.Field>
          {this.radio('Yes', 'autopsyPerformed', 'yes')}
          {this.radio('No', 'autopsyPerformed', 'no')}

          <Form.Field>
            <label>Were Autopsy Findings Available to Complete the Case of Death?:</label>
          </Form.Field>
          {this.radio('Yes', 'autopsyAvailable', 'yes')}
          {this.radio('No', 'autopsyAvailable', 'no')}

          <Form.Field>
            <label>Did tobacco use contribute to death?:</label>
          </Form.Field>
          {this.radio('Yes', 'tobacco', '373066001')}
          {this.radio('No', 'tobacco', '373067005')}
          {this.radio('Probably', 'tobacco', '2931005')}
          {this.radio('Unknown', 'tobacco', 'UNK')}

          <Form.Field>
            <label>If female:</label>
          </Form.Field>
          {this.radio('Not pregnant within past year', 'pregnancy', 'PHC1260')}
          {this.radio('Pregnant at time of death', 'pregnancy', 'PHC1261')}
          {this.radio('Not pregnant, but pregnant within 42 days of death', 'pregnancy', 'PHC1262')}
          {this.radio('Not pregnant, but pregnant 43 days to 1 year before death', 'pregnancy', 'PHC1263')}
          {this.radio('Unknown if pregnant within the past year', 'pregnancy', 'PHC1264')}

          <Form.Field>
            <label>Manner of Death:</label>
          </Form.Field>
          {this.radio('Natural', 'mannerOfDeath', '38605008')}
          {this.radio('Homicide', 'mannerOfDeath', '27935005')}
          {this.radio('Accident', 'mannerOfDeath', '7878000')}
          {this.radio('Suicide', 'mannerOfDeath', '44301001')}
          {this.radio('Pending Investigation', 'mannerOfDeath', '185973002')}
          {this.radio('Could not be Determined', 'mannerOfDeath', '65037004')}

          <Button className='validate' primary onClick={() => this.props.gotoStep('Validate')}>Complete</Button>

        </Form>
      </Grid.Row>
    );
  }

}

export default AdditionalQuestionsForm;
