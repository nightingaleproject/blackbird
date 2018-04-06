import React from 'react';
import { Card, Grid } from 'semantic-ui-react'
import FontAwesome from '@fortawesome/react-fontawesome'
import { faUserCircle } from '@fortawesome/fontawesome-free-solid'

function PatientCard(props) {
  const patient = props.patient;
  if (patient) {
    return (
        <Card fluid>
          <Grid columns={2}>
            <Grid.Column width={2}>
              <FontAwesome icon={faUserCircle} size="6x" />
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
