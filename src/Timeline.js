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

    const conditionLink = (condition) => {
      return <Card header={condition.description} key={condition.id} onClick={this.props.handleConditionClick} id={condition.id} />;
    };

    const conditionLinks = (conditions) => {
      if (!conditions || conditions.length === 0) {
        return <div>No conditions found</div>;
      } else {
        return conditions.map(conditionLink);
      }
    };

    const resourceCards = (resources) => {
      return resources.map((resource) => {
        return <Card header={resource.description} key={resource.id} />;
      });
    };

    const renderTab = (tab) => {
      switch (tab) {
      case 'Conditions':
      default:
        return conditionLinks(this.props.conditions);
      case 'Procedures':
        return resourceCards(this.props.procedures);
      case 'Tests':
        return resourceCards(this.props.observations);
      case 'Medications':
        return resourceCards(this.props.medications);
      }
    };

    const menuItem = (name, resources) => {
      resources = resources || [];
      return (
          <Menu.Item active={this.state.tab === name} onClick={() => this.gotoTab(name)}>
            {name} ({resources.length})
          </Menu.Item>
      );
    }

    return (
      <div className="timeline">
        <Menu tabular>
          {menuItem('Conditions', this.props.conditions)}
          {menuItem('Procedures', this.props.procedures)}
          {menuItem('Tests', this.props.observations)}
          {menuItem('Medications', this.props.medications)}
        </Menu>
        {renderTab(this.state.tab)}
      </div>
    );

  }
}

export default Timeline;
