import React, { Component } from 'react';

class Form1 extends Component {

  render() {

    const input = function(type, name) {
      return <input type={type} name={name} value={this.props.record[name]} onChange={this.props.handleRecordChange} />;
    }.bind(this);

    const radio = function(name, value) {
      const checked = (this.props.record[name] === value);
      return <input type='radio' name={name} value={value} checked={checked} onChange={this.props.handleRecordChange} />;
    }.bind(this);

    return (
      <div className="step">

        <h2 className="title">Death Certification</h2>
        <h3 className="fs-subtitle">[Items 24-28] - Must be completed by person who pronounced or certifies death</h3>

        Date Pronounced Dead:<br/>
        {input('date', 'pronouncedDeathDate')}<br/>
        Time Pronounced Dead:<br/>
        {input('text', 'pronouncedDeathTime')}<br/>

        Actual or Presumed Date of Death:<br/>
        {input('date', 'actualDeathDate')}<br/>
        Actual or Presumed Time of Death:<br/>
        {input('text', 'actualDeathTime')}<br/>

        Was Medical Examiner or Coroner Contacted?:<br/>
        {radio('examinerContacted', 'yes')} Yes<br/>
        {radio('examinerContacted', 'no')} No<br/>

        Was an Autopsy Performed?: <br/>
        {radio('autopsyPerformed', 'yes')} Yes<br/>
        {radio('autopsyPerformed', 'no')} No<br/>

        Were Autopsy Findings Available to Complete the Case of Death?: <br/>
        {radio('autopsyAvailable', 'yes')} Yes<br/>
        {radio('autopsyAvailable', 'no')} No<br/>

        <h2 className="fs-title">Person Pronouncing Death</h2>
        Type your full name to electronically sign this document:<br/>
        {input('text', 'certifierName')}<br/>
        License Number: <br/>
        {input('text', 'certifierNumber')}<br/>

        <br/><br/>
        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.props.previousStep}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.props.nextStep}/>
    
      </div>
    );
  }

}

export default Form1;
