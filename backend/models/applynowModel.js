import mongoose from "mongoose";

const applyNowSchema = new mongoose.Schema({
  personalInfo: {
    firstName: String,
    lastName: String,
    email: String,
    gender: String,
    birthDate: {

      day: String,
      month: String,
      year: String
    },
    birthCity: String,
    birthCountry: String,
    citizenshipCountry: String,
    studyArea: String,
    entranceTerm: String,
    referralSource: String,
    hasUsVisa: Boolean,
    hasVisaDenial: Boolean,
    i20Transfer: String,
    fundingSource: String,
    homeAddress: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    livingInUS: Boolean,
    phone: {
      mobile: {
        countryCode: String,
        number: String
      },
      home: {
        countryCode: String,
        number: String
      }
    },
    emergencyContact: {
      relationship: String,
      firstName: String,
      lastName: String,
      email: String,
      phone: {
        countryCode: String,
        number: String
      },
      sameAsHome: Boolean,
      address: {
        street1: String,
        street2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      }
    }
  },
  educationHistory: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  documents: {
    hasDocuments: Boolean,
    files: [{
      name: String,
      url: String,
      type: String
    }]
  },
  agreements: {
    disciplinaryAction: Boolean,
    criminalOffense: Boolean,
    autoApply: Boolean,
    enrollmentContract: Boolean,
    medicalInsurance: Boolean,
    declarations: Boolean
  },
  programDetails: {
    studyLevel: String,
    program: String,
    university: String
  }
}, {
  timestamps: true
});

export default mongoose.model('ApplyNow', applyNowSchema); 