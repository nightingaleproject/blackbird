import React from 'react';
import { Grid, Form } from 'semantic-ui-react';
import FormPage from './FormPage';
import Timeline from './Timeline';

class CauseOfDeathForm extends FormPage {

  render() {

    return (
      <div>

        {this.menu('CauseOfDeath')}

        <Grid>

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
              <Form.Group>
                {this.input('text', 'cod1Text')}
                {this.input('text', 'cod1Time')}
              </Form.Group>

              <Form.Group>
                {this.input('text', 'cod2Text', { optional: true })}
                {this.input('text', 'cod2Time', { optional: true })}
              </Form.Group>

              <Form.Group>
                {this.input('text', 'cod3Text', { optional: true })}
                {this.input('text', 'cod3Time', { optional: true })}
              </Form.Group>

              <Form.Group>
                {this.input('text', 'cod4Text', { optional: true })}
                {this.input('text', 'cod4Time', { optional: true })}
              </Form.Group>
            </Form>

          </Grid.Column>

        </Grid>

      </div>
    );
  }

}

export default CauseOfDeathForm;
