import React from 'react';
import { Grid } from 'semantic-ui-react';
import FormPage from './FormPage';
import Timeline from './Timeline';

class CauseOfDeathForm extends FormPage {

  render() {

    return (
      <div className="step">

        {this.menu('CauseOfDeath')}

        <Grid>

          <Grid.Column width={6}>
            <Timeline conditions={this.props.conditions} medications={this.props.medications} procedures={this.props.procedures} observations={this.props.observations} handleConditionClick={this.props.handleConditionClick} />
          </Grid.Column>

          <Grid.Column width={10}>
            <h2 className="title">Death Certification</h2>

            {this.input('text', 'cod1Text')}
            {this.input('text', 'cod1Time')}<br/>

            {this.input('text', 'cod2Text')}
            {this.input('text', 'cod2Time')}<br/>

            {this.input('text', 'cod3Text')}
            {this.input('text', 'cod3Time')}<br/>

            {this.input('text', 'cod4Text')}
            {this.input('text', 'cod4Time')}<br/>
          </Grid.Column>

        </Grid>

      </div>
    );
  }

}

export default CauseOfDeathForm;
