import React from 'react';

function Header(props) {
  let name = '';
  let id = '';
  const patient = props.patient;
  if (patient) {
    name = patient.name;
    id = patient.id;
  }
  // TODO Add different info (maybe photo)
  return (
    <div className="infohead">
      Patient Name: <span className="data" id="patient_name">{name}</span><br/>
      Patient ID: <span className="data" id="patient_id">{id}</span><br/>
      Patient Age: <span className="data" id="patient_age"></span><br/>
    </div>
  );
}

export default Header;
