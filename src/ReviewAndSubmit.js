import React from 'react';
import { Grid, Message, Button } from 'semantic-ui-react';
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
              {reviewRow('certifierName', this.props.record.certifierName)}
              {reviewRow('certifierNumber', this.props.record.certifierNumber)}
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
            <Button primary floated='right' onClick={() => alert('No EDRS Configured')}>Submit</Button>
          </Grid.Column>
        </Grid.Row>

      </React.Fragment>
    );
  }
}

export default ReviewAndSubmit;
