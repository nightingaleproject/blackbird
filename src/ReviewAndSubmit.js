import React from 'react';
import { Grid, Message, Form, Button } from 'semantic-ui-react';
import FormPage from './FormPage';

class ReviewAndSubmit extends FormPage {
  render() {

    const reviewRow = (title, value) => {
      return (
        <Grid.Row>
          <Grid.Column width={4}>
            <div className='review-title'>{title}</div>
          </Grid.Column>
          <Grid.Column width={12}>
            <Message content={value} />
          </Grid.Column>
        </Grid.Row>
      );
    };

    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('ReviewAndSubmit')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Grid>
              {reviewRow('Date Pronounced Dead', this.props.record.pronouncedDeathDate)}
              {reviewRow('Time Pronounced Dead', this.props.record.pronouncedDeathTime)}
              {reviewRow('Actual or Presumed Date of Death', this.props.record.actualDeathDate)}
              {reviewRow('Actual or Presumed Time of Death', this.props.record.actualDeathTime)}
              {reviewRow('Was Medical Examiner or Coroner Contacted?', this.props.record.examinerContacted)}
              {reviewRow('Was an Autopsy Performed?', this.props.record.autopsyPerformed)}
              {reviewRow('Were Autopsy Findings Available to Complete the Cause of Death?', this.props.record.autopsyAvailable)}
              {reviewRow('Person Pronouncing Death', this.props.record.pronouncerName)}
              {reviewRow('License Number of Person Pronouncing Death', this.props.record.pronouncerNumber)}
              {reviewRow('Immediate Cause of Death', this.props.record.cod1Text)}
              {reviewRow('Approximate Interval', this.props.record.cod1Time)}
              {reviewRow('Underlying Cause of Death', this.props.record.cod2Text)}
              {reviewRow('Approximate Interval', this.props.record.cod2Time)}
              {reviewRow('Underlying Cause of Death', this.props.record.cod3Text)}
              {reviewRow('Approximate Interval', this.props.record.cod3Time)}
              {reviewRow('Underlying Cause of Death', this.props.record.cod4Text)}
              {reviewRow('Approximate Interval', this.props.record.cod4Time)}
              {reviewRow('Other Significant Conditions Contributing to Death', this.props.record.contributing)}
              {reviewRow('Did Tobacco Use Contribute to Death?', this.props.record.tobacco)}
              {reviewRow('Pregnancy Status', this.props.record.pregnancy)}
              {reviewRow('Manner of Death', this.props.record.mannerOfDeath)}
              {reviewRow('Date of Injury', this.props.record.dateOfInjury)}
              {reviewRow('Time of Injury', this.props.record.timeOfInjury)}
              {reviewRow('Place of Injury', this.props.record.placeOfInjury)}
              {reviewRow('Injury at Work?', this.props.record.injuryAtWork)}
              {reviewRow('Location of Injury (State)', this.props.record.locationOfInjuryState)}
              {reviewRow('Location of Injury (City)', this.props.record.locationOfInjuryCity)}
              {reviewRow('Location of Injury (Street)', this.props.record.locationOfInjuryStreet)}
              {reviewRow('Location of Injury (Apt)', this.props.record.locationOfInjuryApt)}
              {reviewRow('Location of Injury (Zip)', this.props.record.locationOfInjuryZip)}
            </Grid>

          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Form>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>Certifier Name:</label>
                  {this.input('text', 'certifierName')}
                </Form.Field>
                <Form.Field>
                  <label>Certifier License Number:</label>
                  {this.input('text', 'certifierNumber')}
                </Form.Field>
              </Form.Group>
              <Form.Field>
                <label>Address of Certifier</label>
              </Form.Field>
              <Form.Group>
                <Form.Field width={16}>
                  <label>Street:</label>
                  {this.input('text', 'certifierStreet')}
                </Form.Field>
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field>
                  <label>City:</label>
                  {this.input('text', 'certifierCity')}
                </Form.Field>
                <Form.Field>
                  <label>State:</label>
                  {this.input('text', 'certifierState')}
                </Form.Field>
                <Form.Field>
                  <label>Zip Code:</label>
                  {this.input('text', 'certifierZip')}
                </Form.Field>
              </Form.Group>

              <Button primary floated='right' onClick={() => alert('No EDRS Configured')}>Submit</Button>

            </Form>
          </Grid.Column>
        </Grid.Row>

      </React.Fragment>
    );
  }
}

export default ReviewAndSubmit;
