import React, { Component } from 'react';
import { Menu, Card, Input, Icon } from 'semantic-ui-react';

class Timeline extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: "Conditions",
      displayedConditions: props.conditions.slice(),
      displayedProcedures: props.procedures.slice(),
      displayedObservations: props.observations.slice(),
      displayedMedications: props.medications.slice()
    };
    this.gotoTab = this.gotoTab.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  gotoTab(newTab) {
    this.setState({ tab: newTab });
  }

  handleSearchChange(event, input) {
    const regex = new RegExp(input.value, 'gi');
    const filter = (element) => element.description.match(regex);
    this.setState({
      displayedConditions: this.props.conditions.filter(filter),
      displayedProcedures: this.props.procedures.filter(filter),
      displayedObservations: this.props.observations.filter(filter),
      displayedMedications: this.props.medications.filter(filter)
    });
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
                <Card.Header>
                  {condition.description}
                  {selected ? <Icon name='check' /> : null}
                </Card.Header>
                <Card.Description>
                  {condition.formattedDateRange}
                </Card.Description>
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
          return (
            <Card fluid key={resource.id}>
              <Card.Content>
                <Card.Header>{resource.description}</Card.Header>
                <Card.Description>
                  <p>{resource.formattedDateRange}</p>
                  <p>{resource.additionalText}</p>
                </Card.Description>
              </Card.Content>
            </Card>
          );
        });
      }
    };

    const renderTab = (tab) => {
      switch (tab) {
      case 'Conditions':
      default:
        return conditionLinks(this.state.displayedConditions);
      case 'Procedures':
        return resourceCards('procedures', this.state.displayedProcedures);
      case 'Tests':
        return resourceCards('tests', this.state.displayedObservations);
      case 'Medications':
        return resourceCards('medications', this.state.displayedMedications);
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
          {menuItem('Conditions', this.state.displayedConditions)}
          {menuItem('Procedures', this.state.displayedProcedures)}
          {menuItem('Tests', this.state.displayedObservations)}
          {menuItem('Medications', this.state.displayedMedications)}
        </Menu>
        <Input fluid icon='search' placeholder='Search...' onChange={this.handleSearchChange} />
        {renderTab(this.state.tab)}
      </div>
    );
  }
}

export default Timeline;
