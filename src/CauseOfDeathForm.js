import React from 'react';
import { Grid, Form, Button } from 'semantic-ui-react';
import FormPage from './FormPage';
import Timeline from './Timeline';

class CauseOfDeathForm extends FormPage {

  render() {

    const deleteButton = (condition) => {
      if (condition) {
        return <Button icon='delete' id={condition.id} onClick={this.props.handleConditionClick} />;
      }
    };

    return (
      <React.Fragment>

        <Grid.Row>
          {this.menu('CauseOfDeath')}
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={8}>
            <Timeline conditions={this.props.conditions}
                      selectedConditions={this.props.selectedConditions}
                      medications={this.props.medications}
                      procedures={this.props.procedures}
                      observations={this.props.observations}
                      handleConditionClick={this.props.handleConditionClick} />
          </Grid.Column>

          <Grid.Column width={8}>

            <Form>

              <Form.Field>
                <label>Immediate Cause</label>
              </Form.Field>

              <Form.Group>
                {this.input('text', 'cod1Time', { width: 4 })}
                {this.input('text', 'cod1Text', { width: 12, label: deleteButton(this.props.selectedConditions[0]) })}
              </Form.Group>

              <Form.Field>
                <label>Underlying Causes</label>
              </Form.Field>

              <Form.Group>
                {this.input('text', 'cod2Time', { width: 4, optional: true })}
                {this.input('text', 'cod2Text', { width: 12, optional: true, label: deleteButton(this.props.selectedConditions[1]) })}
              </Form.Group>

              <Form.Group>
                {this.input('text', 'cod3Time', { width: 4, optional: true })}
                {this.input('text', 'cod3Text', { width: 12, optional: true, label: deleteButton(this.props.selectedConditions[2]) })}
              </Form.Group>

              <Form.Group>
                {this.input('text', 'cod4Time', { width: 4, optional: true })}
                {this.input('text', 'cod4Text', { width: 12, optional: true, label: deleteButton(this.props.selectedConditions[3]) })}
              </Form.Group>

              <Form.Field>
                <label>Other Significant Conditions</label>
              </Form.Field>

              {this.textarea('contributing', { optional: true })}

              {this.nextStepButton('AdditionalQuestions')}

            </Form>

          </Grid.Column>
        </Grid.Row>
      </React.Fragment>
    );
  }

}

export default CauseOfDeathForm;
