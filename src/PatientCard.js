import React from 'react';
import { Card, Icon, List, Table } from 'semantic-ui-react';

function PatientCard(props) {
  const patient = props.patient;
  if (patient) {
    return (
      <Card fluid color="blue" className="patient">
        <Table className="patient-info-table">
          <Table.Body>
            <Table.Row>
              {patient.name && (
                <Table.Cell>
                  <List>
                    <List.Item>
                      <Icon color="blue" name="user" />
                      <List.Content><span className="patient-info-header-text">{patient.name}</span></List.Content>
                    </List.Item>
                  </List>
                </Table.Cell>
              )}
              {(patient.birthDate || patient.age) && (
                <Table.Cell>
                  <List>
                    <List.Item>
                      <Icon color="blue" name="birthday" />
                      <List.Content>
                        <span className="patient-info-header-text">Birthdate: </span>
                        {patient.birthDate}
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <Icon color="blue" name="calendar" />
                      <List.Content>
                        <span className="patient-info-header-text">Age at Death: </span>
                        {patient.age} old
                      </List.Content>
                    </List.Item>
                  </List>
                </Table.Cell>
              )}
              {(patient.race || patient.gender) && (
                <Table.Cell>
                  <List>
                    <List.Item>
                      <Icon color="blue" name="users" className="fw" />
                      <List.Content>
                        <span className="patient-info-header-text">Race and Ethnicity: </span>
                        {patient.race}
                        {patient.ethnicity && ', ' + patient.ethnicity}
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <Icon
                        color="blue"
                        name={(patient.gender === 'female' && 'woman') || (patient.gender === 'male' && 'man')}
                        className="fw"
                      />
                      <List.Content>
                        <span className="patient-info-header-text">Gender: </span>
                        {patient.gender}
                      </List.Content>
                    </List.Item>
                  </List>
                </Table.Cell>
              )}
              {(patient.address || patient.maritalStatus) && (
                <Table.Cell>
                  <List>
                    <List.Item>
                      <List.Content>
                        <Icon color="blue" name="point" />
                        <span className="patient-info-header-text">Address: </span>
                        {patient.address}
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <Icon color="blue" name="user circle" />
                        <span className="patient-info-header-text">Marital Status: </span>
                        {patient.maritalStatus}
                      </List.Content>
                    </List.Item>
                  </List>
                </Table.Cell>
              )}
            </Table.Row>
          </Table.Body>
        </Table>
      </Card>
    );
  } else {
    return null;
  }
}

export default PatientCard;
