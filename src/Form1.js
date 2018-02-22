import React from 'react';
import FormPage from './FormPage';

class Form1 extends FormPage {

  render() {

    return (
      <div className="step">

        <h2 className="title">Death Certification</h2>
        <h3 className="fs-subtitle">[Items 24-28] - Must be completed by person who pronounced or certifies death</h3>

        Date Pronounced Dead:<br/>
        {this.input('date', 'pronouncedDeathDate')}<br/>
        Time Pronounced Dead:<br/>
        {this.input('text', 'pronouncedDeathTime')}<br/>

        Actual or Presumed Date of Death:<br/>
        {this.input('date', 'actualDeathDate')}<br/>
        Actual or Presumed Time of Death:<br/>
        {this.input('text', 'actualDeathTime')}<br/>

        Was Medical Examiner or Coroner Contacted?:<br/>
        {this.radio('examinerContacted', 'yes')} Yes<br/>
        {this.radio('examinerContacted', 'no')} No<br/>

        Was an Autopsy Performed?: <br/>
        {this.radio('autopsyPerformed', 'yes')} Yes<br/>
        {this.radio('autopsyPerformed', 'no')} No<br/>

        Were Autopsy Findings Available to Complete the Case of Death?: <br/>
        {this.radio('autopsyAvailable', 'yes')} Yes<br/>
        {this.radio('autopsyAvailable', 'no')} No<br/>

        <h2 className="fs-title">Person Pronouncing Death</h2>
        Type your full name to electronically sign this document:<br/>
        {this.input('text', 'certifierName')}<br/>
        License Number: <br/>
        {this.input('text', 'certifierNumber')}<br/>

        <br/><br/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.props.nextStep}/>
    
      </div>
    );
  }

}

export default Form1;
