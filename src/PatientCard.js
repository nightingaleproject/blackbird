import React from 'react';
import { Card, Icon, List, Table } from 'semantic-ui-react';

function PatientCard(props) {
  const patient = props.patient;
  if (patient) {
    return (
      <Card fluid color="blue" className="patient">
        <Table className="patient-info-table">
          <Table.Body>
            <Table.Row textAlign="center">
              {patient.name && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon color="blue" name="user" />
                        <span className="patient-info-header-text">Name</span>
                      </List.Header>
                      {patient.name}
                    </List.Content>
                  </List.Item>
                </Table.Cell>
              )}
              {patient.birthDate && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon color="blue" name="birthday" />
                        <span className="patient-info-header-text">Birthdate</span>
                      </List.Header>
                      {patient.birthDate}
                    </List.Content>
                  </List.Item>
                </Table.Cell>
              )}
              {patient.age && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon color="blue" name="calendar" />
                        <span className="patient-info-header-text">Age at Death</span>
                      </List.Header>
                      {patient.age} old
                    </List.Content>
                  </List.Item>
                </Table.Cell>
              )}
              {patient.race && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon color="blue" name="users" />
                        <span className="patient-info-header-text">Race and Ethnicity</span>
                      </List.Header>
                      {patient.race}
                      {patient.ethnicity && ', ' + patient.ethnicity}
                    </List.Content>
                  </List.Item>
                </Table.Cell>
              )}
              {patient.gender && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon
                          color="blue"
                          name={(patient.gender === 'female' && 'woman') || (patient.gender === 'male' && 'man')}
                        />
                        <span className="patient-info-header-text">Gender</span>
                      </List.Header>
                      {patient.gender}
                    </List.Content>
                  </List.Item>
                </Table.Cell>
              )}
              {patient.address && (
                <Table.Cell>
                  <List.Item>
                    <List.Content>
                      <List.Header className="patient-info-header">
                        <Icon color="blue" name="point" />
                        <span className="patient-info-header-text">Address</span>
                      </List.Header>
                      {patient.address}
                    </List.Content>
                  </List.Item>
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
