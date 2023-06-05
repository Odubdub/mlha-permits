// mongoose model for a company
const mongoose = require("mongoose");
const fetchCompanyFromCipa = require("../../helpers/cipa-info.helper");
const Schema = mongoose.Schema;

PhysicalAddressSchema = new Schema({
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String
  },
  locality: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

PostalAddressSchema = new Schema({
  addressLine1: {
    type: String,
    required: true
  },
  addressLine2: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

CompanyDirectorSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  residentialAddress: PhysicalAddressSchema,
  postalAddress: PostalAddressSchema
});

CompanyOwnershipSchema = new Schema({
  numberOfShares: {
    type: Number,
    required: true
  },
  ownershipType: {
    type: String,
    required: true
  },
  shareholderName: {
    type: String,
    required: true
  }
});

const CompanySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  ownConstitution: {
    type: String,
    required: true
  },
  incorporationDate: {
    type: Date,
    required: true
  },
  incorporationNumber: {
    type: String,
    required: true
  },
  annualReturnFilingMonth: {
    type: String,
    required: true
  },
  businessPostalAddress: {
    type: PostalAddressSchema,
    required: true
  },
  principalPlaceOfBusiness: {
    type: PhysicalAddressSchema,
    required: true
  },
  companyDirectors: [CompanyDirectorSchema],
  companyOwnership: [CompanyOwnershipSchema],
}, {
  timestamps: true
});

CompanySchema.methods.addNewCompany = async (companyId) => {
  const companyfromCipa = await fetchCompanyFromCipa(companyId);

};



const Company = mongoose.model("Company", CompanySchema);
module.exports = Company;
