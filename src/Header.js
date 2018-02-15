import React from 'react';

function Header(props) {
  let name = '';
  let id = '';
  const patient = props.patient;
  if (patient) {
    const first = patient.name[0].given.join(' ');
    const last = patient.name[0].family;
    name = `${first} ${last}`;
    id = patient.id;
  }
  return (
    <div className="infohead">
      Patient Name: <span className="data" id="patient_name">{name}</span><br/>
      Patient ID: <span className="data" id="patient_id">{id}</span><br/>
      Patient Age: <span className="data" id="patient_age"></span><br/>
    </div>
  );
}

export default Header;
