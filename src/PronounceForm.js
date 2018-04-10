import React from 'react';
import { Form } from 'semantic-ui-react';
import FormPage from './FormPage';

class PronounceForm extends FormPage {

  render() {

    return (

      <div>

        {this.menu('Pronouncing', ['pronouncedDeathDate', 'pronouncedDeathTime', 'actualDeathDate', 'actualDeathTime', ])}

        <Form>
          <Form.Field>
            <label>Date Pronounced Dead:</label>
            {this.input('date', 'pronouncedDeathDate')}
          </Form.Field>

          <Form.Field>
            <label>Time Pronounced Dead:</label>
            {this.input('text', 'pronouncedDeathTime')}
          </Form.Field>

          <Form.Field>
            <label>Actual or Presumed Date of Death:</label>
            {this.input('date', 'actualDeathDate')}
          </Form.Field>

          <Form.Field>
            <label>Actual or Presumed Time of Death:</label>
            {this.input('text', 'actualDeathTime')}
          </Form.Field>

          <Form.Field>
            <label>Was Medical Examiner or Coroner Contacted?:</label>
          </Form.Field>
          {this.radio('Yes', 'examinerContacted', 'yes')}
          {this.radio('No', 'examinerContacted', 'no')}

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
    
      </div>
    );
  }

}

export default PronounceForm;
