class FHIRExport {
  constructor(resourceObject) {
    bundle = {}
    bundle.resourceType = "Bundle";
    bundle.type = "document"
    bundle.entry = [];
    bundle.entry << generateComposition(resourceObject)
    bundle.entry << generateDecedent(resourceObject)
  }

  function generateComposition(resourceObject) {
    //construct death certification record composition
    comp.resourceType = "Composition"
    comp.type = {
      "coding": [{
        "system": "http://loinc.org",
        "code": "64297-5",
        "display": "Death certificate"
      }],
      "text": "Death certificate"
    }
    comp.status = "preliminary";
    comp.date = (new Date(Date.now())).toISOString();]
    comp.title = "Death certificate for " + resourceObject.patient.name

    comp.section = {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "69453-9",
          "display": "Cause of death"
        }],
      },
    }
    comp.section.entry = []
    comp.subject = {
      "reference": "Patient/" + resourceObject.patient.id,
      "display": "Decedent Referenced"
    }
  }

  function generateDecedent(resourceObject) {
    dec = resourceObject.patient
    dec.text = "Decedent Record for " + resourceObject.patient.name
    dec.age = {"ageinyears": patient.age}
    dec.birthplace = {} //sdr birthplace extension
    dec.servedinarmedforces = false
    dec.maritalstatusatdeath = "coding": [{
      "system": "http://hl7.org/fhir/v3/MaritalStatus",
      "code": "",
      "display": ""
    }]

    dec.placeofdeath = {}
    dec.placeofdeath.placeofdeathtype = "coding": [{
        "system": "http://hl7.org/fhir/v3/MaritalStatus",
        "code": "",
        "display": ""
    }]
    dec.placeofdeath.facilityname = ""
    dec.placeofdeath.address = {} //sdr address extension

    dec.disposition = {}
    dec.disposition.dispositiontype = "coding": [{
        "system": "http://snomed.info/sct",
        "code": "",
        "display": ""
    }]
    dec.education =
    dec.occupation =
    return dec
  }

}
