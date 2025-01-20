import mongoose from "mongoose";

const advisorInquirySchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    countryOfOrigin: { type: String, required: true },
    phoneCode: { type: String, required: true },
    mobileNumber: { type: String },
    degreeType: { type: String, required: true },
    startDate: { type: String },
    tuitionBudget: { type: String },
    citizenship: { type: String },
    message: { type: String },
    subscribeNews: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const AdvisorInquiry = mongoose.model("AdvisorInquiry", advisorInquirySchema);

export default AdvisorInquiry;
