import React from 'react';
import { Grid, Message, Form, Button, Input } from 'semantic-ui-react';
import FormPage from './FormPage';
import { recordToFHIR } from './FHIRExport';
// jQuery for AJAX is overkill, but it's already a dependency
import jQuery from 'jquery';

class ReviewAndSubmit extends FormPage {

  constructor(props) {
    super(props);
    this.state = { edrsEndpoint: 'http://localhost:4000/fhir/v1/death_records.json' };
    this.handleEndpointChange = this.handleEndpointChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEndpointChange(event, data) {
    this.setState({ edrsEndpoint: data.value });
  }

  handleSubmit() {
    const fhirData = recordToFHIR(this.props.record, this.props.patient);
    jQuery.ajax({
      url: this.state.edrsEndpoint,
      type: 'POST',
      data: JSON.stringify(fhirData),
      contentType: 'application/json',
      dataType: 'json',
      success: (data) => {
        alert('Successfully submitted data to server');
      },
      error: (response) => {
        if (response.status === 201) {
          // jQuery handles a 201 code as an error if the response body is blank (it's expecting JSON)
          alert('Successfully submitted data to server');
        } else {
          alert("Failed to submit data to server, error reported: " + response.statusText);
        }
      }
    });
  }

  render() {

    const record = this.props.record;

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

    // TODO: Combine some of these lines, such as addresses

    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('ReviewAndSubmit')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            <Grid>
              {reviewRow('Date Pronounced Dead', record.pronouncedDeathDate)}
              {reviewRow('Time Pronounced Dead', record.pronouncedDeathTime)}
              {reviewRow('Actual or Presumed Date of Death', record.actualDeathDate)}
              {reviewRow('Actual or Presumed Time of Death', record.actualDeathTime)}
              {reviewRow('Was Medical Examiner or Coroner Contacted?', record.examinerContacted)}
              {reviewRow('Was an Autopsy Performed?', record.autopsyPerformed)}
              {reviewRow('Were Autopsy Findings Available to Complete the Cause of Death?', record.autopsyAvailable)}
              {reviewRow('Person Pronouncing Death', record.pronouncerName)}
              {reviewRow('License Number of Person Pronouncing Death', record.pronouncerNumber)}
              {reviewRow('Immediate Cause of Death', record.cod1Text)}
              {reviewRow('Approximate Interval', record.cod1Time)}
              {reviewRow('Underlying Cause of Death', record.cod2Text)}
              {reviewRow('Approximate Interval', record.cod2Time)}
              {reviewRow('Underlying Cause of Death', record.cod3Text)}
              {reviewRow('Approximate Interval', record.cod3Time)}
              {reviewRow('Underlying Cause of Death', record.cod4Text)}
              {reviewRow('Approximate Interval', record.cod4Time)}
              {reviewRow('Other Significant Conditions Contributing to Death', record.contributing)}
              {reviewRow('Did Tobacco Use Contribute to Death?', record.tobacco)}
              {reviewRow('Pregnancy Status', record.pregnancy)}
              {reviewRow('Manner of Death', record.mannerOfDeath)}
              {reviewRow('Date of Injury', record.dateOfInjury)}
              {reviewRow('Time of Injury', record.timeOfInjury)}
              {reviewRow('Place of Injury', record.placeOfInjury)}
              {reviewRow('Injury at Work?', record.injuryAtWork)}
              {reviewRow('Location of Injury (State)', record.locationOfInjuryState)}
              {reviewRow('Location of Injury (City)', record.locationOfInjuryCity)}
              {reviewRow('Location of Injury (Street)', record.locationOfInjuryStreet)}
              {reviewRow('Location of Injury (Apt)', record.locationOfInjuryApt)}
              {reviewRow('Location of Injury (Zip)', record.locationOfInjuryZip)}
              {reviewRow('Describe how injury occurred', record.howInjuryOccurred)}
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

              <Form.Field>
                <label>EDRS FHIR Endpoint URL:</label>
                <Input type='text' name='edrsEndpoint' value={this.state.edrsEndpoint} onChange={this.handleEndpointChange} />
              </Form.Field>

              <Button primary floated='right' onClick={this.handleSubmit}>Submit</Button>
              <Button primary floated='right' onClick={() => console.log(JSON.stringify(recordToFHIR(this.props.record, this.props.patient), null, 2))}>Log FHIR to Console</Button>
              <Button primary floated='right' as='a' href={"data: text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recordToFHIR(this.props.record, this.props.patient), null, 2))} download="fhir-bundle.json">Download FHIR Bundle</Button>
            </Form>
          </Grid.Column>
        </Grid.Row>

      </React.Fragment>
    );
  }
}

export default ReviewAndSubmit;
