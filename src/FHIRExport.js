class FHIRExport {
  constructor(resourceObject) {
    this.bundle = {}
    this.bundle.resourceType = "Bundle"
    this.bundle.type = "document"
    this.bundle.entry = []
    this.bundle.entry.push(this.generateComposition(resourceObject))
    this.bundle.entry.push(this.generateDecedent(resourceObject))
  }

  generateComposition(resourceObject) {
    //construct death certification record composition
    console.log("composition")
    var composition = {}
    composition.resourceType = "Composition"
    composition.type = {
      "coding": [{
        "system": "http://loinc.org",
        "code": "64297-5",
        "display": "Death certificate"
      }],
      "text": "Death certificate"
    }
    composition.status = "preliminary";
    composition.date = new Date(Date.now()).toISOString()
    composition.title = "Death certificate for " + resourceObject.patient.name

    composition.section = {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "69453-9",
          "display": "Cause of death"
        }],
      },
    }
    composition.section.entry = []
    composition.subject = {
      "reference": "Patient/" + resourceObject.patient.id,
      "display": "Decedent Referenced"
    }
    return composition
  }

  generateDecedent(resourceObject) {
    var decedent = {}
    decedent.text = "Decedent Record for " + resourceObject.patient.name
    decedent.age = {"ageinyears": resourceObject.patient.age}
    decedent.birthplace = {} //sdr birthplace extension
    decedent.servedinarmedforces = false
    decedent.maritalstatusatdeath = {"coding": [{
      "system": "http://hl7.org/fhir/v3/MaritalStatus",
      "code": "",
      "display": ""
    }]}

    decedent.placeofdeath = {}
    decedent.placeofdeath.placeofdeathtype = {"coding": [{
        "system": "http://github.com/nightingaleproject/fhirDeathRecord/sdr/decedent/vs/PlaceOfDeathTypeVS",
        "code": "",
        "display": ""
    }]}
    decedent.placeofdeath.facilityname = ""
    decedent.placeofdeath.address = {} //sdr address extension

    decedent.disposition = {}
    decedent.disposition.dispositiontype = {"coding": [{
        "system": "http://snomed.info/sct",
        "code": "",
        "display": ""
    }]}
    return decedent
  }
}

export default FHIRExport;
