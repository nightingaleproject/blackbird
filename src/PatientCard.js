import React from 'react';
import { Card, Icon } from 'semantic-ui-react'

function PatientCard(props) {
  const patient = props.patient;
  if (patient) {
    return (
        <Card fluid color='blue' className='patient'>
          <div>
            <div className='patient-icon'>
              <Icon color='blue' name='user circle' size='huge' />
            </div>
            <div className='patient-info'>
              <h4>{patient.name}</h4>
              <p>{patient.age} old</p>
            </div>
          </div>
        </Card>
    );
  } else {
    return null;
  }
}

export default PatientCard;
