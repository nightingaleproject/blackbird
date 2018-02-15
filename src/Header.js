import React from 'react';

function Header(props) {
  const patient = props.patient;
  let name = '';
  let id = '';
  let age = '';
  let img = ''
  if (patient) {
    name = patient.name;
    id = patient.id;
    age = patient.age;
    if (patient.photoSrc) {
      img = <img src={patient.photoSrc} />;
    }
  }
  return (
    <div className="infohead">
      Patient Name: <span className="data" id="patient_name">{name}</span><br/>
      Patient ID: <span className="data" id="patient_id">{id}</span><br/>
      Patient Age: <span className="data" id="patient_age">{age}</span><br/>
      {img}
    </div>
  );
}

export default Header;
