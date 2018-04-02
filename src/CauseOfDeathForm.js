import React from 'react';
import FormPage from './FormPage';
import { Menu } from 'semantic-ui-react';

class CauseOfDeathForm extends FormPage {

  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }

  render() {

    const conditionLink = function(condition) {
      const text = condition.code.coding[0].display;
      return <div key={condition.id}><button type="button" onClick={this.props.handleConditionClick} id={condition.id}>{text}</button></div>;
    }.bind(this);

    const conditionLinks = function(conditions) {
      if (!conditions || conditions.length === 0) {
        return <div>No conditions found</div>;
      } else {
        return <div>{conditions.map(conditionLink)}</div>;
      }
    };

    return (
      <div className="step">

        {this.menu('CauseOfDeath')}

        <div className="ui grid">

          <div className="six wide column timeline">
            <Menu tabular>
              <Menu.Item name="Conditions" active={true} />
              <Menu.Item name="Procedures" />
              <Menu.Item name="Tests" />
              <Menu.Item name="Medications" />
            </Menu>
            <p>The patient has {this.props.patient.conditions.length} conditions:</p>
            {conditionLinks(this.props.patient.conditions)}
          </div>

          <div className="ten wide column">
            <h2 className="title">Death Certification</h2>

            {this.input('text', 'cod1Text')}
            {this.input('text', 'cod1Time')}<br/>

            {this.input('text', 'cod2Text')}
            {this.input('text', 'cod2Time')}<br/>

            {this.input('text', 'cod3Text')}
            {this.input('text', 'cod3Time')}<br/>

            {this.input('text', 'cod4Text')}
            {this.input('text', 'cod4Time')}<br/>
          </div>

        </div>

      </div>
    );
  }

}

export default CauseOfDeathForm;
