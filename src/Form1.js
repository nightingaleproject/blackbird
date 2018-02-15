import React, { Component } from 'react';

class Form1 extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  next(event) {
    event.preventDefault();
    this.props.setStep('form2')
  }

  previous(event) {
    event.preventDefault();
    this.props.setStep('welcome')
  }

  render() {
    return (
      <div className="step">

        <h2 className="title">Death Certification</h2>
        <h3 className="fs-subtitle">[Items 24-28] - Must be completed by person who pronounced or certifies death</h3>

        Date Pronounced Dead:<br/>
        <input className="centered" type="text" name="pronounced_death_date"/><br/>
        Time Pronounced Dead<span className="tod-timezone"></span>:<br/>
        <input className="centered" type="text" name="pronounced_death_time"/><br/>

        Actual or Presumed Date of Death: <br/>
        <input className="centered" type="text" name="actual_death_date"/><br/>
        Actual or Presumed Time of Death<span className="tod-timezone"></span>: <br/>
        <input className="centered" type="text" name="actual_death_time"/><br/>

        Was Medical Examiner or Coroner Contacted?: <br/>
        <input type="radio" name="examiner_contacted" value="yes" /> Yes<br/>
        <input type="radio" name="examiner_contacted" value="no" /> No<br/>

        Was an Autopsy Performed?: <br/>
        <input type="radio" name="autopsy" value="yes" /> Yes<br/>
        <input type="radio" name="autopsy" value="no" /> No<br/>

        Were Autopsy Findings Available to Complete the Case of Death?: <br/>
        <input type="radio" name="autopsy_available" value="yes" /> Yes<br/>
        <input type="radio" name="autopsy_available" value="no" /> No<br/><br/>

        <h2 className="fs-title">Person Pronouncing Death</h2>
        Type your full name to electronically sign this document:<br/>
        <input className="centered" type="text" name="certifier_name"/><br/>
        License Number: <br/>
        <input className="centered" type="text" name="certifier_number"/><br/>

        <br/><br/>
        <input type="button" name="previous" className="previous action-button" value="Previous" onClick={this.previous}/>
        <input type="button" name="next" className="next action-button" value="Next" onClick={this.next}/>
    
      </div>
    );
  }

}

export default Form1;
