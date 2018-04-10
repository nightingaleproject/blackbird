import React, { Component } from 'react';
import { Menu, Card } from 'semantic-ui-react';

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
      return <Card header={text} key={condition.id} onClick={this.props.handleConditionClick} id={condition.id} />;
    }.bind(this);

    const conditionLinks = function(conditions) {
      if (!conditions || conditions.length === 0) {
        return <div>No conditions found</div>;
      } else {
        return <div>{conditions.map(conditionLink)}</div>;
      }
    };

    // TODO: Use common code for these conditions, procedures, etc
    const Conditions = function(props) {
      const conditions = props.conditions || [];
      return (
        <div>
          <p>The patient has {conditions.length} condition{conditions.length === 1 ? '' : 's'}:</p>
          {conditionLinks(props.conditions)}
        </div>
      );
    }

    const Procedures = function(props) {
      const procedures = props.procedures || [];
      return (
        <div>
          <p>The patient has {procedures.length} procedure{procedures.length === 1 ? '' : 's'}:</p>
        </div>
      );
    }

    const Tests = function(props) {
      const observations = props.observations || [];
      return (
        <div>
          <p>The patient has {observations.length} test{observations.length === 1 ? '' : 's'}:</p>
        </div>
      );
    }

    const Medications = function(props) {
      const medications = props.medications || [];
      return (
        <div>
          <p>The patient has {medications.length} medication{medications.length === 1 ? '' : 's'}:</p>
        </div>
      );
    }

    const renderTab = function(tab) {
      switch (tab) {
      case 'Procedures':
        return <Procedures procedures={this.props.procedures} />;
      case 'Tests':
        return <Tests observations={this.props.observations} />;
      case 'Medications':
        return <Medications medications={this.props.medications} />;
      case 'Conditions':
      default:
        return <Conditions conditions={this.props.conditions} />;
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
