import { DataSource } from "../../RegDetails/DetailFields/DataSource"
const { FieldType } = require("../../RegDetails/DetailFields/FieldType")
const { Formatters } = require("../../RegDetails/DetailFields/Formatters")

export const getServiceConfig = (code, version) => {
  console.log("getServiceConfig", JSON.stringify(serviceRenderConfigs, null, 2))
    return serviceRenderConfigs.find(service => service.code == code && service.version == version)
}

const botcAtc = 'BOTC Act of 2007'
const gcc = 'Gaborone City Council'

const identityDetails = [
  {
    key: "lastName",
    desc: "Last Name",
    field: FieldType.text,
    formatter: Formatters.none,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "foreNames",
    desc: "Forenames",
    field: FieldType.text,
    formatter: Formatters.none,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "idNo",
    desc: "Identity Number",
    field: FieldType.text,
    formatter: Formatters.none,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "idType",
    desc: "Identity Type",
    field: FieldType.text,
    formatter: Formatters.none,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "idExpiryDate",
    desc: "Expiry Date",
    field: FieldType.text,
    formatter: Formatters.dateEstimated,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "dateOfBirth",
    desc: "Date of Birth",
    field: FieldType.text,
    formatter: Formatters.dateAge,
    source: DataSource.author,
    correctable: false
  },
  {
    key: "placeOfBirth",
    desc: "Place of Birth",
    field: FieldType.text,
    formatter: Formatters.none,
    source: DataSource.author,
    correctable: false
  }
]

const blankTableSection = {
  tableTitle1: '',
  subHeader1: '',
  tableTitle2: '',
  subHeader2: '',
  tableTitle3: '',
  subHeader3: '',
  tableTitle4: '',
  subHeader4: '',
  fields:[]
}

export const serviceRenderConfigs = [
    {
      version:  "1.0",
      code: "MTI_007_12_003",
      name:"Business Import Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [
        {
          key: "companyName",
          desc: "Company Name",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyRegNo",
          desc: "Company Reg. No.",
          field: FieldType.text,
          "infoType": "company",
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseNo",
          desc: "Trade licence No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyTinNo",
          desc: "TIN/VAT Reg. No",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "City/Town/Village",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
      ],
      permit: [
        {
          key: "purposeOfGoods",
          desc: "Purpose of Goods",
          field: FieldType.paragraph,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "productDescription",
          desc: "Product Description ",
          field: FieldType.paragraph,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "quantity",
          desc: "Quantity",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "tariffCode",
          desc: "HS code",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "originCountry",
          desc: "Origin Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "entryPort",
          desc: "Port of entry",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration1",
          desc: "Declaration 1",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `1. I have satisfied myself that the preparation of the application has been done in conformity with the guidelines and requirements in respect of the above-mentioned import permit provisions, with which I have fully acquainted myself and to which I unconditionally agree to.`
        },
        {
          key: "declaration2",
          desc: "Declaration 2",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `2. I accept that the decision by BOTC will be final and conclusive and that the Ministry of Investment, Trade and Industry or Botswana Unified Revenue Service (BURS)  may at any time conduct or order an investigation to verify information furnished in the application form.`
        },
        {
          key: "declaration3",
          desc: "Declaration 3",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `3. The information furnished in this application is true and correct.`
        },
        {
          key: "declaration4",
          desc: "Declaration 4",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `4. The applicant or any one of its associates, or related party is not subject of an investigation by the Police, the Directorate on Corruption Economic Crime, or the Commissioner for Botswana Unified Revenue Services (BURS) into previous claims or other related matters.`
        }
      ],
      attachments: [
        {
          key: "tradeLicAtt",
          desc: "Trading Licence",
          
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Attachment of Trading Licence"
        },
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'General Import Permit',
            suffix: 'IP'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'entryPort'
              }
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_004",
      name:"General Import Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [
          {
              key: "email",
              desc: "Email",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "phone",
              desc: "Phone",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade license. No.",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "tinNo",
              desc: "TIN/VAT Reg. No",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "addressLine1",
              desc: "Address Line 1",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "addressLine2",
              desc: "Line 2",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "locality",
              desc: "City/Town/Village",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "country",
              desc: "Country",
              field: FieldType.text,
              formatter: Formatters.none,
              source: DataSource.application
            }
      ],
      permit: [
        {
          key: "productDescription",
          desc: "Product Description ",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "tariffCode",
          desc: "HS code",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "quantity",
          desc: "Quantity",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "originCountry",
          desc: "Value of Goods",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "entryPort",
          desc: "Port of entry",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration1",
          desc: "Declaration 1",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `1. I have satisfied myself that the preparation of the application has been done in conformity with the guidelines and requirements in respect of the above-mentioned export permit provisions, with which I have fully acquainted myself and to which I unconditionally agree to.`
        },
        {
          key: "declaration2",
          desc: "Declaration 2",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `2. I accept that the decision by BOTC will be final and conclusive and that the Ministry or Botswana Unified Revenue Service (BURS)  may at any time conduct or order an investigation to verify information furnished in the application form.`
        },
        {
          key: "declaration3",
          desc: "Declaration 3",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `3. The information furnished in this application is true and correct.`
        },
        {
          key: "declaration4",
          desc: "Declaration 4",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `4. The applicant or any one of its associates, or related party is not subject of an investigation by the Police, the Directorate on Corruption Economic Crime, or the Commissioner for Botswana Unified Revenue Services (BURS) into previous claims or other related matters.`
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'General Import Permit',
            suffix: 'IP'
          },
          segmentedSection: [
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "validFrom",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'entryPort'
              }
            ]
          },
          conditions: true,
        }
      },
      attachments: [
        {
          key: "tradeLicAtt",
          desc: "Trading Licence",
          
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Attachment of Trading Licence (PDF)"
        },
      ]
    },
    {
      version:  "1.0",
      code: "MTI_007_12_007",
      name:"Rebate Item 405.04",
      applicant: [
        ...identityDetails,
      {
        key: "postalAddress",
        desc: "Postal Address",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "addressLine1",
        desc: "Address Line 1",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "addressLine2",
        desc: "Line 2",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "locality",
        desc: "City/Town/Village",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "country",
        desc: "Country",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "contactNumber",
        desc: "Contact Number",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "email",
        desc: "Email",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      {
        key: "facsimileNo",
        desc: "Facsimile Number",
        field: FieldType.text,
        formatter: Formatters.none,
        source: DataSource.application
      },
      ],
      owner: [
        {
          key: "organisationName",
          desc: "Organisation Name",
          descInfo: "Non Profit Organisation Name",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "welfareRegNo",
          desc: "Welfare Registration Number",
          desc: "Welfare Reg. No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "detailOfDistributors",
          desc: "Details of Distributors",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "tinNo",
          desc: "TIN/VAT Reg. No",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
      ],
      permit: [
        {
          key: "donationUsage",
          desc: "Donation Recipient",
          descInfo: "This donation is for",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "infrastructureDescription",
          desc: "Distribution infrastr.",
          descInfo: "Detailed description of the distribution infrastructure",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "storageAddress",
          desc: "Storage Address",
          descInfo: "Storage Place Physical Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "importedGoods",
          desc: "Donated products list",
          descInfo: "donated products",
          tableAction: "View Products",
          field: FieldType.table,
          correctable: false,
          formatter: Formatters.none,
          source: DataSource.application,
          table: {
            header: ['Description of Goods', 'Tariff Heading', 'Quantity', 'Country Importing From', 'Bill of Lading', 'Value of Goods'],
            columns: [
              {
                key: "productDescription",
                desc: "Description of Goods",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "tariffCode",
                desc: "Tariff Heading (HS code)",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "quantity",
                desc: "Quantity(i.e., kg/units)",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "originCountry",
                desc: "Country Importing From",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "billOfLading",
                desc: "Bill of Lading",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              }
            ]
          }
        }
      ],
      attachments: [
        {
          key: "certRegAtt",
          desc: "Society Certificate",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Welfare organizations must provide Certificate of Registration with Registrar of Societies",
        },
        {
          key: "undertakingAtt",
          desc: "Written Undertaking",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "A written undertaking or application letter by the Applicant",
        },
        {
          key: "billOfLadingAtt",
          desc: "Bill Of Lading",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Bill of Lading/ Waybill/ Consignment Note",
        },
        {
          key: "nonProfitAtt",
          desc: "Non-profit certificate",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of Registration Certificate as a non-profit organisation in terms of the Non-Profit Organizations Act (if applicable)",
        },
        {
          key: "donorLetterAtt",
          desc: "Donor Letter",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Letter from Donor confirming that the goods are donated  to disabled persons or for the upliftment of indigent persons (Gift Certificate)",
        },
        {
          key: "invoiceAtt",
          desc: "Invoice",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Invoice",
        },
        {
          key: "statutoryAtt",
          desc: "Statutory Agreement",
          
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of Statutory Agreement (if applicable)",
        },
        {
          key: "prevPermitAtt",
          desc: "Previous Permit",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of previous permit (if applicable).",
        },
        {
          key: "declarationAtt",
          desc: "Declaration",
          
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "The attached declaration must be completed by both the applicant and any other body responsible for distribution of donated goods.",
        },
        {
          key: "affidavitAtt",
          desc: "Signed affidavit",
          
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Signed affidavit.",
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "presentation",
            fieldLabel: "Presentation",
            fieldType: "richText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Rebate Item 405.04',
            suffix: 'RC'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: blankTableSection,
          component3: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Tariff Heading',
            subHeader2: 'HS Code',
            tableTitle3: 'Quantity',
            subHeader3: 'Kg/Units',
            tableTitle4: 'Goods Origin',
            subHeader4: 'Country',
            source: 'importedGoods',
            fields: {
              v1: 'productDescription',
              v2: 'tariffCode',
              v3: 'quantity',
              v4: 'originCountry',
            }
          },
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_005",
      name:"Rebate Item 412.11",
      applicant: [
        ...identityDetails,
        {
          key: "tinNo",
          desc: "TIN/VAT Reg. No",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Address Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "City/Town/Village",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "contactPerson",
          desc: "Contact Person",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "contactNumber",
          desc: "Contact Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
      ],
      owner: [
        {
          key: "companyName",
          desc: "Company Name",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyRegNo",
          desc: "Company Reg. No.",
          field: FieldType.text,
          "infoType": "company",
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseNo",
          desc: "Trade license. No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyTinNo",
          desc: "TIN/VAT Reg. No",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyAddressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyAddressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyLocality",
          desc: "City/Town/Village",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyCountry",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      permit: [
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "facsimileNo",
          desc: "Facsimile Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "productDescription",
          desc: "Product Description ",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "tariffCode",
          desc: "HS code",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "quantity",
          desc: "Quantity",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "originCountry",
          desc: "Country of Origin",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "billOfLading",
          desc: "Bill of Lading",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration",
          desc: "Declaration",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      attachments: [
        {
          key: "tradeLicAtt",
          desc: "Trading Licence",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Attachemnt of Manufacturing/Trading Licence (PDF)"
        },
        {
          key: "billOfLadingAtt",
          desc: "Bill of Lading",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo:"Bill of Lading PDF"
        },
        {
          key: "invoiceAtt",
          desc: "Invoice",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Invoice"
        },
        {
          key: "sanitaryCertAtt",
          desc: "(Phyto)Sanitary",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Sanitary and Phytosanitary Certificate"
        },
        {
          key: "prevPermitAtt",
          desc: "Previous Permit",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of previous permit (if applicable).",
        },
        {
          key: "undertakingAtt",
          desc: "Written undertaking",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "a) Written undertaking indicating that the goods are imported for relief of distress of persons in case of famine or other national disaster; \nb) Under any technical assistance agreement; or \nc) In terms of an obligation under multilateral international agreement to which the Republic is a party."
        },
        {
          key: "ce110Att",
          desc: "CE 110",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "CE 110",
        },
        {
          key: "affidavitAtt",
          desc: "Signed affidavit",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Signed affidavit"
        },
      ],
      issuance: {
        type: 'Certificate',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "presentation",
            defaultValue: 'Your rebate certificate has been issued.',
            fieldLabel: "Certificate Presentation",
            fieldType: "richText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your rebate certificate has been issued.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Rebate item 412.11',
            suffix: 'RC'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Product Description',
            subHeader1: 'Name of the product',
            tableTitle2: 'Tariff Heading',
            subHeader2: ' (HS Code)',
            tableTitle3: 'Quantity',
            subHeader3: 'Kg/Units',
            tableTitle5: 'Source',
            subHeader5: 'Country of Origin',
            fields:[
              {
                v1: 'productDescription',
                v2: 'tariffCode',
                v3: 'quantity',
                v5: 'originCountry',
              }
            ]
          },
          conditions: false,
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_010",
      name:"Rebate Item 470.03",
      applicant: [
        ...identityDetails,
      ],
      owner: [
        {
          key: "contactPerson",
          desc: "Contact Person",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "contactNumber",
          desc: "Contact Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "facsimileNo",
          desc: "Facsimile Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "postalAddress",
          desc: "Postal Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyName",
          desc: "Company Name",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyRegNo",
          desc: "Company Reg. No.",
          "infoType": "company",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseNo",
          desc: "Trade licence No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyTinNo",
          desc: "TIN/VAT Reg. No",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "City/Town/Village",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      permit: [
        {
          key: "notifLetter",
          desc: "Notification letter",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "productDescription",
          desc: "Product Description",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "tariffCode",
          desc: "HS code",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "quantity",
          desc: "Quantity",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "originCountry",
          desc: "Origin Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "importDates",
          desc: "Planned Import Dates",
          field: FieldType.text,
          formatter: Formatters.dateEstimated,
          source: DataSource.application
        },
        {
          key: "manufacturedProduct",
          desc: "Description",
          descInfo: "Description of Manufactured goods",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "manufacturedGoodTariffCode",
          desc: "HS code (Manuf.)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "nameOfBuyer",
          desc: "Details of Buyer",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "exportDates",
          desc: "Dates of Export",
          field: FieldType.text,
          formatter: Formatters.dateEstimated,
          source: DataSource.application
        },
        {
          key: "portOfExport",
          desc: "Port of Export",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "exportQuantity",
          desc: "Quantity",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "estimatedSalesValue",
          desc: "Sales Value",
          descInfo: "Sales Value of Export",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "yieldOfManufacture",
          desc: "Yield",
          descInfo: "Yield/Formula of Manufacture",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "reasonsForImporting",
          desc: "Reasons for importing ",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "otherImportingReason",
          desc: "Other Reason",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      issuance: {
        type: 'Certificate',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "presentation",
            fieldLabel: "Presentation",
            fieldType: "richText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Rebate item 470.03',
            suffix: 'RC'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Tariff Subheading',
            subHeader4: 'HS Code',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'tariffCode',
              }
            ]
          },
          conditions: true,
        }
      },
      attachments: [
        {
          key: "tradeLicAtt",
          desc: "Trading Licence",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Attachemnt of Manufacturing/Trading Licence (PDF)"
        },
        {
          key: "notifLetterAtt",
          desc: "Notification Letter",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo:"Attach notification letter by BURS stating that the applicant is registered as a user of rebate item 470.03"
        },
        {
          key: "regCertAtt",
          desc: "Reg. Certificate",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Proof that importer is registered with BURS"
        },
        {
          key: "rawMatAtt",
          desc: "List of raw materials",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "List of raw materials registered by BURS under Rebate 470.03"
        },
        {
          key: "renewalFormAtt",
          desc: "Renewal form",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Renewal form"
        },
        {
          key: "prevPermitAtt",
          desc: "Previous Permit",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of previous permit"
        },
        {
          key: "reconcilAtt",
          desc: "Reconciliation form",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Indicating goods imported in the past six months"
        },
        {
          key: "undertakAtt",
          desc: "Written undertaking",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Written undertaking indicating the materials imported by the applicant(s) are intended to “manufacture end products as described in the rebate provision” to such an extent that there is a visible permanent change in the fabrics, and a change in tariff heading"
        },
        {
          key: "taxCertAtt",
          desc: "Tax Clearance",
          field: FieldType.attachment
        },
        {
          key: "affidavitAtt",
          desc: "Signed affidavit",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Signed affidavit"
        }
      ]
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_006",
      name:"Advertising Permit",
      applicant: [
        ...identityDetails,
        {
          key: "postalAddress",
          desc: "Postal Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "telephone",
          desc: "Telephone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
      ],
      owner: [],
      permit: [
        {
          key: "proposedLocation",
          desc: "Proposed Location",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "currentZoning",
          desc: "Current Zoning",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "propertyOwner",
          desc: "Property Owner",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "ownerAddress",
          desc: "Owner's Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "workDescription",
          desc: "Work Description",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "gpsCoordinates",
          desc: "GPS Coord(S,E)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "roadName",
          desc: "Along Road",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "roadWidth",
          desc: "Road Width",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "typeOfSign",
          desc: "Type of Sign",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "sizeOfSign",
          desc: "Size of Sign (L x W)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "areaOfSign",
          desc: "Area of Sign (m²)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "heightOfSign",
          desc: "Height of Sign (m)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "numberOfSignFaces",
          desc: "No. of Sign Faces",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "offsetDistance",
          desc: "Offset road center",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "adjacentRoadFeature",
          desc: "Adj. Road Feature",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "distanceFromRoadFeature",
          desc: "Dist. From Feature",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "distanceFromClosestTree",
          desc: "Near tree(dist)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "distanceFromNearestBillboard",
          desc: "Near billboard(dist)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration",
          desc: "Declaration",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `1. I have satisfied myself that the preparation of the application has been done in conformity with the guidelines and requirements in respect of the above-mentioned import permit provisions, with which I have fully acquainted myself and to which I unconditionally agree to.`
        },
      ],
      attachments:[
        {
          key: "consentAtt",
          desc: "Consent",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Written consent of the owner upon which...",
        },
        {
          key: "localPlanAtt",
          desc: "Locality plan",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Locality plan in color...",
        },
        {
          key: "siteBlkPlanAtt",
          desc: "Site block plan",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Site block plan of the property....",
        },
        {
          key: "artisticAtt",
          desc: "Artistic Impression",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "An artistic impression showing all measurements of the sign....",
        },
        {
          key: "signDrawingAtt",
          desc: "Sign Drawing",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "A drawing showing the proposed sign and the distances in relation to any other 3rd party or free standing advertising sign",
        },
        {
          key: "zoningCertAtt",
          desc: "Zoning Certificate",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "An artistic impression showing all measurements of the sign....",
        },
        {
          key: "diagPropAtt",
          desc: "Diagram of property",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "A diagram of property by a land Surveryor indicating position of the proposed sign",
        },
        {
          key: "diagPropAtt",
          desc: "Building Plan(Elev)",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "A diagram of property by a land Surveryor indicating position of the proposed sign",
        },
        {
          key: "fencePlanAtt",
          desc: "Approved Plans",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Only if the sign is displayed on a boundary or fence. The plan showing measurements and position of theroposed advertising sign drawn to a scale acceptable to council",
        },
        {
          key: "stuctCertAtt",
          desc: "Struc. safety certif",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "A certificate by an engineer confirming the structural safety of the proposed advertising sign and its foundations",
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 365,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'Advertising Permit',
            suffix: 'AP'
          },
          segmentedSection: [
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "validFrom",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            }
          ],
          tableSection: {
            tableTitle1: '',
            subHeader1: '',
            tableTitle2: '',
            subHeader2: '',
            tableTitle3: '',
            subHeader3: '',
            tableTitle4: '',
            subHeader4: '',
            fields:[]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_004",
      name:"Burial Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [],
      permit: [
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "Locality",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "deceasedIdNo",
          desc: "Deceased's ID No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "dateOfDeath",
          desc: "Date of Death",
          field: FieldType.text,
          formatter: Formatters.date,
          source: DataSource.application
        },
        {
          key: "placeOfDeath",
          desc: "Place of Death",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "religiousDenomination",
          desc: "Religion",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration",
          desc: "Declaration",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `I certify that the information given above is true in every aspect.`
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'Burial Permit',
            suffix: 'BR',
          },
          segmentedSection: [
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.other,
              otherSource: 'deceasedDetails'
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: '',
            subHeader1: '',
            tableTitle2: '',
            subHeader2: '',
            tableTitle3: '',
            subHeader3: '',
            tableTitle4: '',
            subHeader4: '',
            fields:[
            ]
          },
          conditions: true,
        }
      },
      attachments: [
        {
          key: "deathCertAtt",
          desc: "Death Certificate",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of Deceased's Death Certificate"
        },
        {
          key: "guardianAtt",
          desc: "Guardian ID Card",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Mother/Guardian Identity Card"
        },
        {
          key: "passportAtt",
          desc: "Foreigner's Passport",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Copy of foreigner's Passport"
        },
        {
          key: "distCommAtt",
          desc: "Letter from D.C.",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Letter from District Commissioner"
        },
        {
          key: "childMotherAtt",
          desc: "Guardian Passport",
          field: FieldType.attachment,
          source: DataSource.application,
          descInfo: "Certified Passport copy child's mother"
        }
      ]
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_007",
      name:"Additional Dog License",
      applicant: [
        {
          key: "title",
          desc: "Title",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        ...identityDetails,
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "Locality",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      owner:[],
      permit:[
        {
          key: "dogBreed",
          desc: "Dog Breed",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "reasons",
          desc: "Reasons",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "dogDescription",
          desc: "Description of Dog",
          field: FieldType.paragraph,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "dogConviction",
          desc: "Related Convictions?",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      issuance:{
        type: 'License',
        validity: 365,
        period: 'Days',
        fields: [
          {
            fieldName: "type",
            fieldLabel: "Type of Permit",
            fieldType: "Dropdown",
            fieldDescription: "",
            options: [
              'Ordinary dog license',
              'Breeding dog license',
              'Guard Dog License',
              'Special purpose dog license'
            ],
            mandatory: true
          },
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header:{
            act: gcc,
            title: 'Additional Dog License',
            suffix: 'AD'
          },
          segmentedSection: [
            {
              key: "type",
              desc: "Type of Permit",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validFrom",
              desc: "Valid From",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: '',
            subHeader1: '',
            tableTitle2: '',
            subHeader2: '',
            tableTitle3: '',
            subHeader3: '',
            tableTitle4: '',
            subHeader4: '',
            fields:[
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_002",
      name:"Duplicate Dog License",
      applicant:  [
        {
          key: "title",
          desc: "Title",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        ...identityDetails,
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "Locality",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      owner: [],
      permit: [
        {
          key: "dogBreed",
          desc: "Dog Breed",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "reasons",
          desc: "Reasons",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "numberOfLicensedDogs",
          desc: "No. Licensed dogs",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "purposeOfDogs",
          desc: "Purpose of dogs",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "dogDescription",
          desc: "Description of Dog",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo:'Color, sex, name, age, vaccinations'
        },
        {
          key: "dogConviction",
          desc: "Dog Convictions",
          toolTipInfo:'Related Convictions?',
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      issuance: {
        type: 'License',
        validity: 365,
        period: 'Days',
        fields: [
          {
            fieldName: "type",
            fieldLabel: "Type of Permit",
            fieldType: "Dropdown",
            fieldDescription: "",
            options: [
              'Ordinary dog license',
              'Breeding dog license',
              'Guard Dog License',
              'Special purpose dog license'
            ],
            mandatory: true
          },
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your license has been issued.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'Duplicate Dog License',
            suffix: 'DD'
          },
          segmentedSection: [
            {
              key: "type",
              desc: "Type of Permit",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validFrom",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: '',
            subHeader1: '',
            tableTitle2: '',
            subHeader2: '',
            tableTitle3: '',
            subHeader3: '',
            tableTitle4: '',
            subHeader4: '',
            fields:[]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_002",
      name:"Non Ferrous Scrap Export Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [
        {
          key: "businessName",
          desc: "Company/Business",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "businessRegNo",
          desc: "Registration\nNumber",
          "infoType":"company",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseNo",
          desc: "License  Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "postalAddress",
          desc: "Postal Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "phone",
          desc: "Telephone Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "fax",
          desc: "Fax Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "physicalAddress",
          desc: "Physical Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
      ],
      permit: [
        {
          key: "productExportDate",
          desc: "Proposed Export Date",
          field: FieldType.text,
          formatter: Formatters.dateEstimated,
          source: DataSource.application
        },
        {
          key: "exitPort",
          desc: "Port of Exit",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "trailerRegNo",
          desc: "Truck/Trailer Reg No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "positionInBusiness",
          desc: "Applicant Status",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "products",
          desc: "Export List",
          descInfo: "List of scap metal to be exported",
          tableAction: "View Scrap Metal List",
          field: FieldType.staticTable,
          correctable: false,
          formatter: Formatters.none,
          source: DataSource.application,
          table: {
            rowStart: 1,
            rowLast: 9,
            header: ['Product', 'Quantity', 'Value', 'Recipient', 'Destination'],
            defaults: {
              product1: "8103: Tantalum and articles thereof, including waste and scrap",
              product2: "7404: Copper and brass waste and scrap",
              product3: "7503: Nickel waste and scrap",
              product4: "7602: Aluminum waste and scrap",
              product5: "7902: Zinc waste and scrap",
              product6: "8002: Iron waste and scrap",
              product7: "8101: Tungsten (Wolfram) and articles thereof including waste and scrap",
              product8: "8102: Molybdenum and articles thereof including waste and scrap",
              product9: "7204: Ferrous waste and scrap; re-melting scrap ingots of iron or steel"
            },
            row: [
              {
                key: "product",
                desc: "Scrap Metal Description",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "quantity",
                desc: "Tariff Heading (HS code)",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "value",
                desc: "",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "recipient",
                desc: "Recipient",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              },
              {
                key: "destination",
                desc: "Destination",
                field: FieldType.text,
                formatter: Formatters.none,
                source: DataSource.application,
              }
            ]
          }
        },
        {
          key: "declaration1",
          desc: "Declaration 1",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `1. I have satisfied myself that the preparation of the application has been done in conformity with the guidelines and requirements in respect of the above-mentioned export permit provisions, with which I have fully acquainted myself and to which I unconditionally agree to.`
        },
        {
          key: "declaration2",
          desc: "Declaration 2",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `2. I accept that the decision by BOTC will be final and conclusive and that the Ministry or Botswana Unified Revenue Service (BURS)  may at any time conduct or order an investigation to verify information furnished in the application form.`
        },
        {
          key: "declaration3",
          desc: "Declaration 3",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `3. The information furnished in this application is true and correct.`
        },
        {
          key: "declaration4",
          desc: "Declaration 4",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `4. The applicant or any one of its associates, or related party is not subject of an investigation by the Police, the Directorate on Corruption Economic Crime, or the Commissioner for Botswana Unified Revenue Services (BURS) into previous claims or other related matters.`
        }
      ],
      defaults: {
        product1: "8103: Tantalum and articles thereof, including waste and scrap",
        product2: "7404: Copper and brass waste and scrap",            
        product3: "7503: Nickel waste and scrap",            
        product4: "7602: Aluminum waste and scrap",            
        product5: "7902: Zinc waste and scrap",           
        product6: "8002: Iron waste and scrap",           
        product7: "8101: Tungsten (Wolfram) and articles thereof including waste and scrap",            
        product8: "8102: Molybdenum and articles thereof including waste and scrap",            
        product9: "7204: Ferrous waste and scrap; re-melting scrap ingots of iron or steel"
      },
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Non Ferrous Scrap Export',
            suffix: 'EN'
          },
          segmentedSection: [
            {
              key: "businessName",
              desc: "Company/Business",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "validFrom",
              desc: "Valid From",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "businessRegNo",
              desc: "Registration Reg. No.",
              "infoType":"company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "productExportDate",
              desc: "Proposed Export Date",
              formatter: Formatters.date,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "License  Number",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "exitPort",
              desc: "Port of Exit",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "trailerRegNo",
              desc: "Truck/Trailer Reg No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "destination",
              desc: "Destination",
              formatter: Formatters.none,
              source: DataSource.application
            }
          ],
          tableSection: {
            tableTitle1: 'Product',
            subHeader1: 'Description',
            tableTitle2: 'Quantity',
            subHeader2: 'tonnes',
            tableTitle3: 'Est. Value',
            subHeader3: 'BWP',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'product2',
                v2: 'quantity2',
                v3: 'value2',
                v4: 'destination2'
              },
              {
                v1: 'product3',
                v2: 'quantity3',
                v3: 'value3',
                v4: 'destination3'
              },
              {
                v1: 'product4',
                v2: 'quantity4',
                v3: 'value4',
                v4: 'destination4'
              },
              {
                v1: 'product5',
                v2: 'quantity5',
                v3: 'value5',
                v4: 'destination5'
              },
              {
                v1: 'product6',
                v2: 'quantity6',
                v3: 'value6',
                v4: 'destination6'
              },
              {
                v1: 'product7',
                v2: 'quantity7',
                v3: 'value7',
                v4: 'destination7'
              },
              {
                v1: 'product8',
                v2: 'quantity8',
                v3: 'value8',
                v4: 'destination8'
              },
              {
                v1: 'product9',
                v2: 'quantity9',
                v3: 'value9',
                v4: 'destination9'
              },
              {
                v1: 'product10',
                v2: 'quantity10',
                v3: 'value10',
                v4: 'destination10'
              },
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_001",
      name:"Ferrous Scrap Export Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [
        {
          key: "businessName",
          desc: "Company/Business",
          field: FieldType.moreInfo,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "businessRegNo",
          desc: "Registration  Number",
          field: FieldType.text,
          "infoType":"company",
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseNo",
          desc: "License  Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "postalAddress",
          desc: "Postal Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "phone",
          desc: "Telephone Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "fax",
          desc: "Fax Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "physicalAddress",
          desc: "Inspection Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      permit: [
        {
          key: "productExportDate",
          desc: "Proposed Export Date",
          field: FieldType.text,
          formatter: Formatters.dateEstimated,
          source: DataSource.application
        },
        {
          key: "exitPort",
          desc: "Port of Exit",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "trailerRegNo",
          desc: "Truck/Trailer Reg. No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "destination",
          desc: "Destination",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "positionInBusiness",
          desc: "Applicant Designation",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "product",
          desc: "Product Description",
          default: '7204: Ferrous waste and scrap; re-melting scrap ingots of iron or steel',
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "quantity",
          desc: "Quantity(Tonnes)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "value",
          desc: "Value(BWP)",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "recipient",
          desc: "Recipient",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "destination",
          desc: "Destination",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration1",
          desc: "Declaration 1",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `1. I have satisfied myself that the preparation of the application has been done in conformity with the guidelines and requirements in respect of the above-mentioned export permit provisions, with which I have fully acquainted myself and to which I unconditionally agree to.`
        },
        {
          key: "declaration2",
          desc: "Declaration 2",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `2. I accept that the decision by BOTC will be final and conclusive and that the Ministry or Botswana Unified Revenue Service (BURS)  may at any time conduct or order an investigation to verify information furnished in the application form.`
        },
        {
          key: "declaration3",
          desc: "Declaration 3",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `3. The information furnished in this application is true and correct.`
        },
        {
          key: "declaration4",
          desc: "Declaration 4",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `4. The applicant or any one of its associates, or related party is not subject of an investigation by the Police, the Directorate on Corruption Economic Crime, or the Commissioner for Botswana Unified Revenue Services (BURS) into previous claims or other related matters.`
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Export Ferrous Scrap',
            suffix: 'EF'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "validFrom",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            }
          ],
          tableSection: {
            tableTitle1: 'Product',
            subHeader1: 'Description',
            tableTitle2: 'Quantity',
            subHeader2: 'tonnes',
            tableTitle3: 'Est. Value',
            subHeader3: 'BWP',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'product1',
                v2: 'quantity1',
                v3: 'value1',
                v4: 'destination1'
              }
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MTI_007_12_008",
      name:"Exporter Registration",
      applicant: [
        ...identityDetails,
      ],
      owner: [],
      permit: [
        {
          key: "companyName",
          desc: "Company Name",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "companyRegNo",
          desc: "Company Reg. No.",
          field: FieldType.text,
          "infoType": "company",
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "salvageLicenceNo",
          desc: "Salvage Yard Lic. No.",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "postalAddress",
          desc: "Postal Address",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "fax",
          desc: "Fax",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "email",
          desc: "Email",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "statusInBusiness",
          desc: "Position in Business",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      issuance: {
        type: 'Registration',
        validity: 14,
        period:'Days',
        fields:[
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: botcAtc,
            title: 'Exporter',
            suffix:'ER'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "salvageLicenceNo",
              desc: "Salvage Yard License No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: blankTableSection,
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_001",
      name:"New Dog License",
      applicant: [
        {
          key: "title",
          desc: "Title",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        ...identityDetails,
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "Locality",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "country",
          desc: "Country",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      owner: [
      ],
      permit: [
        {
          key: "dogBreed",
          desc: "Dog Breed",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "licenseType",
          desc: "Type of License",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "dogDescription",
          desc: "Description of Dog",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo:'Color, sex, name, age, vaccinations'
        },
        {
          key: "dogConviction",
          desc: "Convictions",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo:'Related Convictions?'
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'DOG',
            suffix: 'ND'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              "infoType": "company",
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'entryPort'
              }
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_005",
      name:"Noise & Nuisance Permit",
      applicant: [
        ...identityDetails,
      ],
      owner: [
      ],
      permit: [
        {
          key: "plot",
          desc: "Plot Number",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "ward",
          desc: "Ward",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "activityDescription",
          desc: "Activity Description",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "noiseConviction",
          desc: "Related convictions?",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      issuance: {
        type: 'License',
        validity: 14,
        period: 'Days',
        fields: [
          
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'Noise and Nuisance',
            suffix: 'NN'
          },
          segmentedSection: [
            {
              key: "companyName",
              desc: "Company Name",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "companyRegNo",
              desc: "Company Reg. No.",
              "infoType": "company",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              key: "licenseNo",
              desc: "Trade licence No.",
              formatter: Formatters.none,
              source: DataSource.application
            },
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'entryPort'
              }
            ]
          },
          conditions: true,
        }
      }
    },
    {
      version:  "1.0",
      code: "MLGRD_008_10_003",
      name:"Park Booking Permit",
      applicant: [
        ...identityDetails,
        {
          key: "addressLine1",
          desc: "Address Line 1",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "addressLine2",
          desc: "Line 2",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "locality",
          desc: "City/Town/Village",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "phone",
          desc: "Phone",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        }
      ],
      owner: [],
      permit: [
        {
          key: "purposeOfPermission",
          desc: "Purpose",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "parkLocation",
          desc: "Park Location",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "bookedDate",
          desc: "Booked Date",
          field: FieldType.text,
          formatter: Formatters.dateEstimated,
          source: DataSource.application
        },
        {
          key: "startTime",
          desc: "Start Time",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "endTime",
          desc: "End Time",
          field: FieldType.text,
          formatter: Formatters.none,
          source: DataSource.application
        },
        {
          key: "declaration",
          desc: "Declaration",
          field: FieldType.declaration,
          formatter: Formatters.none,
          source: DataSource.application,
          toolTipInfo: `I acknowledge and agree to abide by the recreational facility conditions and any special conditions which may be advised.`
        }
      ],
      issuance: {
        type: 'Permit',
        validity: 14,
        period: 'Days',
        fields: [
          {
            fieldName: "conditions",
            fieldLabel: "Conditions",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          },
          {
            fieldName: "notificationMessage",
            defaultValue: 'Your permit has been issued. Please print this page and present it to the relevant authorities.',
            fieldLabel: "Notification Message",
            fieldType: "LongText",
            fieldDescription: "",
            options: [],
            mandatory: true
          }
        ],
        printout:{
          header: {
            act: gcc,
            title: 'Park Booking',
            suffix: 'PB'
          },
          segmentedSection: [
            {
              keys: ["foreNames", "lastName"],
              key: "applicantName",
              desc: "Applicant Name",
              formatter: Formatters.concatenated,
              source: DataSource.author,
            },
            {
              key: "validFrom",
              desc: "Company Reg. No.",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "validUntil",
              desc: "Valid Until",
              formatter: Formatters.none,
              source: DataSource.issuance
            },
            {
              key: "idNo",
              desc: "Identity Number",
              formatter: Formatters.none,
              source: DataSource.author,
            },
            {
              key: "idType",
              desc: "Identity Type",
              formatter: Formatters.none,
              source: DataSource.author,
            },
          ],
          tableSection: {
            tableTitle1: 'Goods to be imported',
            subHeader1: 'Name of the product',
            tableTitle2: 'Quantity',
            subHeader2: 'Kg/Units',
            tableTitle4: 'Destination of goods',
            subHeader4: 'Country, Town/Village',
            fields:[
              {
                v1: 'productDescription',
                v2: 'quantity',
                v4: 'entryPort'
              }
            ]
          },
          conditions: true,
        }
      }
    }
  ]