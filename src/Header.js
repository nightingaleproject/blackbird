import React from 'react';

function Header(props) {
  const patient = props.patient;
  let name = '';
  let id = '';
  let age = '';
  if (patient) {
    name = patient.name;
    id = patient.id;
    age = patient.age;
  }
  return (
    <div className="infohead">
      Patient Name: <span className="data" id="patient_name">{name}</span><br/>
      Patient ID: <span className="data" id="patient_id">{id}</span><br/>
      Patient Age: <span className="data" id="patient_age">{age}</span><br/>
    </div>
  );
}

export default Header;
