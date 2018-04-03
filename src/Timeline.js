import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = { tab: "Conditions" };
    this.gotoTab = this.gotoTab.bind(this);
  }

  gotoTab(newTab) {
    this.setState({ tab: newTab });
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

    const Conditions = function(props) {
      const conditions = props.patient.conditions;
      return (
        <div>
          <p>The patient has {conditions ? conditions.length : 0} conditions:</p>
          {conditionLinks(props.patient.conditions)}
        </div>
      );
    }

    const Procedures = function(props) {
      return <div>Procedures</div>;
    }

    const Tests = function(props) {
      return <div>Tests</div>;
    }

    const Medications = function(props) {
      return <div>Medications</div>;
    }

    const renderTab = function(tab) {
      switch (tab) {
      case 'Procedures':
        return <Procedures patient={this.props.patient} />;
      case 'Tests':
        return <Tests patient={this.props.patient} />;
      case 'Medications':
        return <Medications patient={this.props.patient} />;
      case 'Conditions':
      default:
        return <Conditions patient={this.props.patient} />;
      }
    }.bind(this);

    return (
      <div className="timeline">
        <Menu tabular>
          <Menu.Item name="Conditions" active={this.state.tab === "Conditions"} onClick={() => this.gotoTab("Conditions")}/>
          <Menu.Item name="Procedures" active={this.state.tab === "Procedures"} onClick={() => this.gotoTab("Procedures")}/>
          <Menu.Item name="Tests" active={this.state.tab === "Tests"} onClick={() => this.gotoTab("Tests")}/>
          <Menu.Item name="Medications" active={this.state.tab === "Medications"} onClick={() => this.gotoTab("Medications")}/>
        </Menu>
        {renderTab(this.state.tab)}
      </div>
    );

  }
}

export default Timeline;
