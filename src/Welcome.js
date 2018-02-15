import React, { Component } from 'react';

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient';
var FHIR = window.FHIR;

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = { fhirServer: 'https://syntheticmass.mitre.org/fhir', decedentName: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const smart = FHIR.client({
      serviceUrl: this.state.fhirServer
    });
    const searchParams = { type: 'Patient' }
    if (this.state.decedentName.length > 0) {
      searchParams.name = this.state.decedentName;
    }
    this.setState({ names: [] });
    smart.api.search(searchParams).done(function(result) {
      var names = result.data.entry.map(function(entry) {
        var record = entry.resource;
        var first = record.name[0].given.join(' ');
        var last = record.name[0].family
        return (`${first} ${last}`);
      });
      this.setState({ names });
    }.bind(this));
  }

  render() {

    const Names = function(props) {
      if (!props.names) {
        return <div/>;
      } else if (props.names.length === 0) {
        return <div>Searching...</div>;
      } else {
        return <div>{props.names.map(function(name) { return <div key={name}>{name}</div>; })}</div>;
      }
    };

    return (
      <div className="Welcome">
        <h2 className="title">Welcome</h2>
        <p className="instructions">This prototype application was developed as a collaboration between the <a href="http://miblab.bme.gatech.edu">Wang Lab</a> at Georgia Tech's Wallace H. Coulter Department of Biomedical Engineering and the Centers for Disease Control.</p>
      <p className="instructions">The purpose of this application is to provide visualization, context, and decision support at the point of a patient's death, with the aim of improving the timeliness, accuracy, and completeness of mortality reporting.</p>
        <h2 className="fs-title">Search for Decedent Record</h2>
        <h3 className="fs-subtitle">Specify FHIR server and patient name to search for</h3>
        <form onSubmit={this.handleSubmit}>
          <label>FHIR server:</label>
          <input type="text" name="fhirServer" value={this.state.fhirServer} onChange={this.handleChange}/>
          <br/>
          <label>Decedent name:</label>
          <input type="text" name="decedentName" value={this.state.decedentName} onChange={this.handleChange}/>
          <br/>
          <input type="submit" value="Search"/>
        </form>
        <Names names={this.state.names}/>
      </div>
    );
  }

}

export default Welcome;
