import React from 'react';
import { Card, Grid, Icon } from 'semantic-ui-react'

function PatientCard(props) {
  const patient = props.patient;
  if (patient) {
    return (
        <Card fluid>
          <Grid columns={2}>
            <Grid.Column width={2}>
              <Icon name='user circle' size='huge' />
            </Grid.Column>
            <Grid.Column width={14}>
              <Card.Header>{patient.name}</Card.Header>
              <Card.Meta>{patient.age}</Card.Meta>
            </Grid.Column>
          </Grid>
        </Card>
    );
  } else {
    return null;
  }
}

export default PatientCard;
