import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import _ from 'lodash';
import moment from 'moment';
import Header from './Header';
import PatientCard from './PatientCard';
import Welcome from './Welcome';
import PronounceForm from './PronounceForm';
import CauseOfDeathForm from './CauseOfDeathForm';
import AdditionalQuestionsForm from './AdditionalQuestionsForm';
import Validate from './Validate';
import { SMARTWrap } from './FHIRClientWrapper';

class App extends Component {

  constructor(props) {
    super(props);
    const record = {
      // TODO: pull information on date/time of death from patient record if present
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
    // First page depends on whether we're running in a SMART on FHIR context or not
    if (props.smart) {
      this.state = { step: 'Pronouncing', record: record, selectedConditions: [] };
    } else {
      this.state = { step: 'Welcome', record: record, selectedConditions: [] };
    }
    this.setPatient = this.setPatient.bind(this);
    this.setUser = this.setUser.bind(this);
    this.setResources = this.setResources.bind(this);
    this.gotoStep = this.gotoStep.bind(this);
    this.handleRecordChange = this.handleRecordChange.bind(this);
    this.handleConditionClick = this.handleConditionClick.bind(this);
  }

  componentWillMount() {
    // If we're running in a SMART on FHIR context, load the patient and all resources
    if (this.props.smart) {
      SMARTWrap.load().then(([user, patient, conditions, medications, procedures, observations]) => {
        this.setUser(user);
        this.setPatient(patient);
        this.setResources(conditions, medications, procedures, observations);
      });
    }
  }

  setPatient(patient) {
    this.setState({ patient });
  }

  setUser(patient) {
    this.setState({ patient });
  }

  setResources(conditions, medications, procedures, observations) {
    this.setState({ conditions, medications, procedures, observations });
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
  // TODO: This is getting long, we should refactor into additional functions
  handleConditionClick(event, data) {
    event.preventDefault();
    const clickedCondition = this.state.conditions.find((condition) => condition.id === data.id);
    // First update our internal conditions state, adding or subtracting as needed and sorting by onset
    let newConditions = this.state.selectedConditions.slice(); // Create a new copy of the array
    if (newConditions.some((condition) => condition.id === clickedCondition.id)) {
      newConditions = newConditions.filter((condition) => condition.id !== clickedCondition.id);
    } else {
      newConditions.push(clickedCondition);
      newConditions = _.sortBy(newConditions, (condition) => moment(condition.startDate));
    }
    this.setState({ selectedConditions: newConditions });
    // Then update the user display of the conditions
    for (let i = 0; i < 4; i++) {
      if (newConditions[i]) {
        const text = newConditions[i].description;
        // TODO: Use user or record supplied death time, not current time, if available
        const onset = moment(newConditions[i].startDate).fromNow(true);
        this.updateRecord(`cod${i+1}Text`, text);
        this.updateRecord(`cod${i+1}Time`, onset);
      } else {
        this.updateRecord(`cod${i+1}Text`, '');
        this.updateRecord(`cod${i+1}Time`, '');
      }
    }
  }

  render() {

    const renderStep = (step) => {
      switch (step) {
      case 'Pronouncing':
        return <PronounceForm patient={this.state.patient}
                              gotoStep={this.gotoStep}
                              handleRecordChange={this.handleRecordChange}
                              record={this.state.record} />;
      case 'CauseOfDeath':
        return <CauseOfDeathForm conditions={this.state.conditions}
                                 selectedConditions={this.state.selectedConditions}
                                 medications={this.state.medications}
                                 procedures={this.state.procedures}
                                 observations={this.state.observations}
                                 gotoStep={this.gotoStep}
                                 handleRecordChange={this.handleRecordChange}
                                 handleConditionClick={this.handleConditionClick}
record={this.state.record} />;
      case 'AdditionalQuestions':
        return <AdditionalQuestionsForm patient={this.state.patient}
                                        gotoStep={this.gotoStep}
                                        handleRecordChange={this.handleRecordChange}
                                        record={this.state.record} />;
      case 'Validate':
        return <Validate patient={this.state.patient}
                         gotoStep={this.gotoStep}
                         handleRecordChange={this.handleRecordChange}
                         record={this.state.record} />;
      case 'Welcome':
      default:
        return <Welcome setPatient={this.setPatient} setResources={this.setResources} gotoStep={this.gotoStep} />;
      }
    };

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
