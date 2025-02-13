import mongoose from "mongoose";

const applyNowSchema = new mongoose.Schema({
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    gender: String,
    birthDate: {
      day: String,
      month: String,
      year: String
    },
    birthCity: String,
    birthCountry: String,
    citizenshipCountry: String,
    studyLevel: String,
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
  applicantInfo: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'student'
    },
    applicationDate: {
      type: Date,
      default: Date.now
    }
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  programDetails: {
    studyLevel: String,
    program: String,
    university: String
  },
  status: {
    type: String,
    enum: ['pending', 'under review', 'approved', 'rejected'],
    default: 'pending'
  },
  contactInfo: {
    homeAddress: {
      street1: String,
      street2: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Nepal'
      }
    },
    livingInUS: {
      type: Boolean,
      default: false
    },
    phone: {
      mobile: {
        countryCode: {
          type: String,
          default: '+977'
        },
        number: String
      },
      home: {
        countryCode: {
          type: String,
          default: '+977'
        },
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
      sameAsHome: {
        type: Boolean,
        default: false
      }
    }
  },
  educationHistory: {
    secondarySchool: {
      name: String,
      city: String,
      country: String,
      startDate: {
        month: String,
        year: String
      },
      graduationDate: {
        month: String,
        year: String
      },
      advancedStandingCredits: Boolean,
      creditTypes: {
        aice: Boolean,
        ap: Boolean,
        asLevel: Boolean,
        ib: Boolean,
        other: Boolean
      }
    },
    additionalSchools: [{
      name: String,
      city: String,
      country: String,
      startDate: {
        month: String,
        year: String
      },
      graduationDate: {
        month: String,
        year: String
      },
      advancedStandingCredits: Boolean,
      creditTypes: {
        aice: Boolean,
        ap: Boolean,
        asLevel: Boolean,
        ib: Boolean,
        other: Boolean
      }
    }],
    examDetails: {
      type: String,
      totalScore: String,
      date: {
        day: String,
        month: String,
        year: String
      }
    }
  },
  agreements: {
    termsAndConditions: {
      type: Boolean,
      default: false
    },
    dataPrivacy: {
      type: Boolean,
      default: false
    },
    enrollmentContract: {
      type: Boolean,
      default: false
    },
    medicalInsurance: {
      type: Boolean,
      default: false
    },
    declarations: {
      type: Boolean,
      default: false
    }
  },
  comments: String
}, {
  timestamps: true
});

applyNowSchema.pre('save', function(next) {
  if (!this.applicantInfo.applicationDate) {
    this.applicantInfo.applicationDate = new Date();
  }
  next();
});

const ApplyNow = mongoose.model('ApplyNow', applyNowSchema);
export default ApplyNow; 