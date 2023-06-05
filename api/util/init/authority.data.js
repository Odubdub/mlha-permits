const ministries = [
  {
    "abbr": "MTI",
    "code": "MTI_007",
    "name": "Ministry of Trade and Industry"
  },
  {
    "abbr": "MLGRD",
    "code": "MLGRD_008",
    "name": "Ministry of Local Government and Rural Development"
  }
];

const departments = [
  {
    "abbr": "BOTC",
    "code": "MTI_007_12",
    "ministry_code": "MTI_007",
    "name": "Botswana Trade Commission"
  },
  {
    "abbr": "GCC",
    "code": "MLGRD_008_10",
    "ministryCode": "MLGRD_008",
    "name": "Gaborone City Council"
  },
  {
    "abbr": "FCC",
    "code": "MLGRD_008_11",
    "ministryCode": "MLGRD_008",
    "name": "Francistown City Council"
  },
  {
    "abbr": "LTC",
    "code": "MLGRD_008_12",
    "ministryCode": "MLGRD_008",
    "name": "Lobatse Town Council"
  },
  {
    "abbr": "STC",
    "code": "MLGRD_008_13",
    "ministryCode": "MLGRD_008",
    "name": "Sowa Town Council"
  },
  {
    "abbr": "SPTC",
    "code": "MLGRD_008_14",
    "ministryCode": "MLGRD_008",
    "name": "Selebi Phikwe Town Council"
  },
  {
    "abbr": "JTC",
    "code": "MLGRD_008_15",
    "ministryCode": "MLGRD_008",
    "name": "Jwaneng Town Council"
  },
  {
    "abbr": "KGDC",
    "code": "MLGRD_008_16",
    "ministryCode": "MLGRD_008",
    "name": "Kgatleng District Council."
  },
  {
    "abbr": "KDCM",
    "code": "MLGRD_008_17",
    "ministryCode": "MLGRD_008",
    "name": "Kweneng District Council"
  },
  {
    "abbr": "LLSDC",
    "code": "MLGRD_008_18",
    "ministryCode": "MLGRD_008",
    "name": "Lentsweletau Sub District Council"
  },
  {
    "abbr": "LGSDC",
    "code": "MLGRD_008_19",
    "ministryCode": "MLGRD_008",
    "name": "Letlhakeng Sub District Council"
  },
  {
    "abbr": "MGSDC",
    "code": "MLGRD_008_20",
    "ministryCode": "MLGRD_008",
    "name": "Mogoditshane Sub District Council"
  },
  {
    "abbr": "MSSDC",
    "code": "MLGRD_008_21",
    "ministryCode": "MLGRD_008",
    "name": "Moshupa Sub District Council"
  },
  {
    "abbr": "KLGDCT",
    "code": "MLGRD_008_22",
    "ministryCode": "MLGRD_008",
    "name": "Kgalagadi District Council Tsabong"
  },
  {
    "abbr": "HSDC",
    "code": "MLGRD_008_23",
    "ministryCode": "MLGRD_008",
    "name": "Hukuntsi Sub District Council"
  },
  {
    "abbr": "CDCM",
    "code": "MLGRD_008_24",
    "ministryCode": "MLGRD_008",
    "name": "Central District Council Maun"
  },
  {
    "abbr": "BSDC",
    "code": "MLGRD_008_25",
    "ministryCode": "MLGRD_008",
    "name": "Bobonong Sub District Council"
  },
  {
    "abbr": "TTMSDC",
    "code": "MLGRD_008_26",
    "ministryCode": "MLGRD_008",
    "name": "Tutume Sub District Council"
  },
  {
    "abbr": "LNSDC",
    "code": "MLGRD_008_27",
    "ministryCode": "MLGRD_008",
    "name": "Letlhakane Sub District Council"
  },
  {
    "abbr": "MSDC",
    "code": "MLGRD_008_28",
    "ministryCode": "MLGRD_008",
    "name": "Mahalapye Sub District Council"
  },
  {
    "abbr": "PSDC",
    "code": "MLGRD_008_29",
    "ministryCode": "MLGRD_008",
    "name": "Palapye Sub District Council"
  },
  {
    "abbr": "TNTSDC",
    "code": "MLGRD_008_30",
    "ministryCode": "MLGRD_008",
    "name": "Tonota Sub District Council"
  },
  {
    "abbr": "CHBDC",
    "code": "MLGRD_008_31",
    "ministryCode": "MLGRD_008",
    "name": "Chobe District Council."
  },
  {
    "abbr": "GHZDC",
    "code": "MLGRD_008_32",
    "ministryCode": "MLGRD_008",
    "name": "Ghanzi District Council."
  },
  {
    "abbr": "CHSDC",
    "code": "MLGRD_008_33",
    "ministryCode": "MLGRD_008",
    "name": "Charles Hill Sub District Council"
  },
  {
    "abbr": "NEDC",
    "code": "MLGRD_008_34",
    "ministryCode": "MLGRD_008",
    "name": "North-East District Council."
  },
  {
    "abbr": "NWDCM",
    "code": "MLGRD_008_35",
    "ministryCode": "MLGRD_008",
    "name": "North-West District Council Maun"
  },
  {
    "abbr": "GSDC",
    "code": "MLGRD_008_36",
    "ministryCode": "MLGRD_008",
    "name": "Gumare Sub District Council"
  },
  {
    "abbr": "SUDC",
    "code": "MLGRD_008_37",
    "ministryCode": "MLGRD_008",
    "name": "Southern District Council"
  },
  {
    "abbr": "GHPSDC",
    "code": "MLGRD_008_38",
    "ministryCode": "MLGRD_008",
    "name": "Goodhope Sub Distric Council"
  },
  {
    "abbr": "MABSDC",
    "code": "MLGRD_008_39",
    "ministryCode": "MLGRD_008",
    "name": "Mabutsane Sub District Council"
  },
  {
    "abbr": "SEDC",
    "code": "MLGRD_008_40",
    "ministryCode": "MLGRD_008",
    "name": "South-East District Council"
  },
  {
    "abbr": "TSDC",
    "code": "MLGRD_008_41",
    "ministryCode": "MLGRD_008",
    "name": "Tlokweng Sub District Council"
  },
];