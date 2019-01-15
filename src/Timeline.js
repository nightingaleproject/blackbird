import React, { Component } from 'react';
import { Menu, Card, Input, Icon } from 'semantic-ui-react';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = { tab: "Conditions", searchString: "" };
    this.gotoTab = this.gotoTab.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  gotoTab(newTab) {
    this.setState({ tab: newTab });
  }

  handleSearchChange(event, input) {
    this.setState({ searchString: input.value });
  }

  render() {

    const conditionLinks = (conditions) => {
      if (!conditions || conditions.length === 0) {
        return <p>No conditions found</p>;
      } else {
        return conditions.map((condition) => {
          const selected = this.props.selectedConditions.includes(condition);
          return (
            <Card fluid key={condition.id} id={condition.id} onClick={this.props.handleConditionClick}>
              <Card.Content>
                <Card.Header>{condition.description} {selected ? <Icon name='check' /> : null}</Card.Header>
                <Card.Meta>{condition.formattedDateRange}</Card.Meta>
              </Card.Content>
            </Card>
          );
        });
      }
    };

    const resourceCards = (name, resources) => {
      if (!resources || resources.length === 0) {
        return <p>No {name} found</p>;
      } else {
        return resources.map((resource) => {
          const prescriber = resource.prescriber;
          return (
            <Card fluid key={resource.id}>
              <Card.Content>
                <Card.Header>{resource.description}</Card.Header>
                {prescriber ? <Card.Meta>Prescribed by {prescriber.name}</Card.Meta> : null }
                <Card.Meta>{resource.formattedDateRange}</Card.Meta>
                <Card.Description>{resource.additionalText}</Card.Description>
              </Card.Content>
            </Card>
          );
        });
      }
    };

    const searchRegex = new RegExp(this.state.searchString, 'gi');
    const resourceFilter = (element) => element.description.match(searchRegex);

    const displayedConditions = (this.props.conditions || []).filter(resourceFilter);
    const displayedProcedures = (this.props.procedures || []).filter(resourceFilter);
    const displayedObservations = (this.props.observations || []).filter(resourceFilter);
    const displayedMedications = (this.props.medications || []).filter(resourceFilter);

    const renderTab = (tab) => {
      switch (tab) {
      case 'Conditions':
      default:
        return conditionLinks(displayedConditions);
      case 'Procedures':
        return resourceCards('procedures', displayedProcedures);
      case 'Tests':
        return resourceCards('tests', displayedObservations);
      case 'Medications':
        return resourceCards('medications', displayedMedications);
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
          {menuItem('Conditions', displayedConditions)}
          {menuItem('Procedures', displayedProcedures)}
          {menuItem('Tests', displayedObservations)}
          {menuItem('Medications', displayedMedications)}
        </Menu>
        <Input fluid icon='search' placeholder='Search...' onChange={this.handleSearchChange} />
        {renderTab(this.state.tab)}
      </div>
    );
  }
}

export default Timeline;
