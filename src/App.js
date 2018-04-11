import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import Patient from './Patient';
import Header from './Header';
import PatientCard from './PatientCard';
import Welcome from './Welcome';
import PronounceForm from './PronounceForm';
import CauseOfDeathForm from './CauseOfDeathForm';
import AdditionalQuestionsForm from './AdditionalQuestionsForm';
import Validate from './Validate';

// fhirclient seems pretty broken from this perspective, it doesn't
// export anything and it puts FHIR in window; work around for now
import nothing from 'fhirclient'; // eslint-disable-line no-unused-vars
const FHIR = window.FHIR;

class App extends Component {

  constructor(props) {
    super(props);
    const record = {
      pronouncedDeathDate: '',
      pronouncedDeathTime: '',
      actualDeathDate: '',
      actualDeathTime: '',
      examinerContacted: null,
      autopsyPerformed: null,
      autopsyAvailable: null,
      certifierName: '',
      certifierNumber: '',
      cod1Text: '',
      cod1Time: '',
      cod2Text: '',
      cod2Time: '',
      cod3Text: '',
      cod3Time: '',
      cod4Text: '',
      cod4Time: '',
      tobacco: null,
      pregnancy: null,
      mannerOfDeath: null
    };
    this.state = { step: 'Welcome', record: record, selectedConditions: [] };
    this.setPatient = this.setPatient.bind(this);
    this.setResources = this.setResources.bind(this);
    this.gotoStep = this.gotoStep.bind(this);
    this.handleRecordChange = this.handleRecordChange.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
  }

  componentDidMount() {
    // TODO: Use common code with Welcome.js
    // TODO: Adding code to index.js so that if launch is accessed we don't show Welcome.js
    FHIR.oauth2.ready(function(smart) {
      // If we're called from within a SMART context, set the patient to what is provided and go to certification
      smart.api.search({ type: 'Patient', query: { _id: smart.patient.id } }).then(function(result) {
        const patient = result.data.entry[0].resource;
        this.setPatient(new Patient(patient));
        this.gotoStep('Pronounce');
      }.bind(this));
    }.bind(this));
  }

  setPatient(patient) {
    this.setState({ patient });
  }

  setResources(resourceName, resources) {
    this.setState({ [resourceName]: resources });
  }

  gotoStep(newStep) {
    this.setState({ step: newStep });
  }

  updateRecord(field, value) {
    this.setState((prevState) => {
      const newRecord = Object.assign({}, prevState.record);
      newRecord[field] = value;
      return ({ record: newRecord });
    });
  }

  handleRecordChange(event, data) {
    this.updateRecord(data.name, data.value);
  }

  // Add/remove a condition from the patient record to/from the death record
  // TODO: We'll want an interface that allows text to be edited, condition order to be changed, conditions to be added manually, etc
  handleConditionClick(event, data) {
    event.preventDefault();
    const clickedCondition = this.state.conditions.find(function(condition) { return condition.id === data.id; });
    // First update our internal conditions state, adding or subtracting as needed and sorting by onset
    let newConditions = this.state.selectedConditions.slice(); // Create a new copy of the array
    if (newConditions.some(function(condition) { return condition.id === clickedCondition.id })) {
      newConditions = newConditions.filter(function(condition) { return condition.id !== clickedCondition.id });
    } else {
      newConditions.push(clickedCondition);
      newConditions = _.sortBy(newConditions, function(condition) { return moment(condition.onsetDateTime); });
    }
    this.setState({ selectedConditions: newConditions });
    // Then update the user display of the conditions
    for (let i = 0; i < 4; i++) {
      if (newConditions[i]) {
        const text = newConditions[i].code.coding[0].display;
        const onset = newConditions[i].onsetDateTime;
        this.updateRecord(`cod${i+1}Text`, text);
        this.updateRecord(`cod${i+1}Time`, onset);
      } else {
        this.updateRecord(`cod${i+1}Text`, '');
        this.updateRecord(`cod${i+1}Time`, '');
      }
    }
  }

  render() {

    const renderStep = function(step) {
      switch (step) {
      case 'Pronounce':
        return <PronounceForm patient={this.state.patient} gotoStep={this.gotoStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 'CauseOfDeath':
        return <CauseOfDeathForm conditions={this.state.conditions} medications={this.state.medications} procedures={this.state.procedures} observations={this.state.observations} gotoStep={this.gotoStep} handleRecordChange={this.handleRecordChange} handleConditionClick={this.handleConditionClick} record={this.state.record} />;
      case 'AdditionalQuestions':
        return <AdditionalQuestionsForm patient={this.state.patient} gotoStep={this.gotoStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 'Validate':
        return <Validate patient={this.state.patient} gotoStep={this.gotoStep} handleRecordChange={this.handleRecordChange} record={this.state.record} />;
      case 'Welcome':
      default:
        return <Welcome setPatient={this.setPatient} setResources={this.setResources} gotoStep={this.gotoStep} />;
      }
    }.bind(this);

    return (
        <div className="App">
          <Header/>
          <Grid container>
            <PatientCard patient={this.state.patient} />
            {renderStep(this.state.step)}
          </Grid>
        </div>
    );

  }

}

export default App;
