import { createContext } from "react"
import { PermitTypes } from "src/helper"
import { BOTCIcon, CouncilIcon, MOBEIcon, MyscIcon } from "../../../components/Icons"

export const Authorities = [
    {
        title: 'Botswana Trade Commission',
        shortTitle: 'BOTC',
        icon: BOTCIcon,
        accessConfig: [
          {
            permitType: PermitTypes.Export,
            roles: [
              {
                id: 'ertjwefh4thffdtujfnj',
                _id: 'ertjwefh4thffdtujfnj',
                required: true,
                descr: "Attachments are valid",
                name: "Attachments validity",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'sjryi6e5i53w368',
                _id: 'dsaflm43oinfp4n43',
                required: true,
                descr: "Applicant ",
                name: "Applicants information is valid",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'sgfjtry865386tj757ut',
                _id: 'sdanfo4iofakdn40o4k',
                required: true,
                descr: "All checks have passed",
                name: "Product exported verified",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'cnbmyjaetjq57537rea',
                _id: 'dsabjhj948y350j30j',
                required: true,
                descr: "All checks have passed",
                name: "Final approval",
                permission: 'aklmfpddsaddafe'
              }
            ],
          },
          {
            permitType: PermitTypes.Import,
            roles: [
              {
                id: 'gnksrgkfu546rttrhb5756',
                _id: 'samdnfi4890hf904334',
                required: true,
                descr: "Attachments are valid",
                name: "Attachments verification",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'sj6u54sjryi6j564utj54',
                _id: 'samdnfi4890hf9fe04334',
                required: true,
                descr: "Applicant ",
                name: "Applicant's information",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: '35qyrehqtewu54h5hhg5',
                _id: 'samdnfi4890hf9sdfser04334',
                required: true,
                descr: "The exported products are within",
                name: "Cleared with local scrap dealers",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'nxtjsjrqu5ayq35y535',
                _id: 'samdnfi4f890hfdfsg904334',
                required: true,
                descr: "All checks have passed",
                name: "Final approval",
                permission: 'aklmfpddsaddafe'
              }
            ],
          },
          {
            permitType: PermitTypes.Rebate,
            roles: [
              {
                id: 'shfth5hrtu5454656',
                _id: 'samdnfi489gfdg50hf904334',
                required: true,
                descr: "Rebate contents of an application",
                name: "Primary Information Verification",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'sfdhrt5thr6tjh56tr',
                _id: 'samdnfi48dfgr90hf904334',
                required: true,
                descr: "Rebate certificate is within given constraints",
                name: "Secondary Verification (Endorsing)",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'hsdfnbytdhrtyshet',
                _id: 'samdnfi48htrwe90hf904334',
                required: true,
                descr: "Rebate checks have passed",
                name: "Validating Tax Clearance",
                permission: 'aklmfpddsaddafe'
              },
              {
                id: 'bdfgfdgsreh5haf',
                _id: 'samdnfi4fdgdf890hf904334',
                required: true,
                descr: "Rebate checks have passed",
                name: "Approval",
                permission: 'aklmfpddsaddafe'
              }
            ]
          }
        ]
    },
    {
      title: 'Min. Youth Sports & Culture',
      shortTitle: 'MYSC',
      icon: MyscIcon,
      access: [
        {
          permitType: PermitTypes.Stadium,
          roles: []
        }
      ]
    },
    {
      title: 'Ministry of Basic Education',
      shortTitle: 'MOBE',
      icon: MOBEIcon,
      access: [
        {
          permitType: PermitTypes.Classroom,
          roles: []
        }
      ]
    },
    {
      title: 'Local Gov. and Rural Devel.',
      shortTitle: 'MLGRD',
      icon: CouncilIcon,
      access: [
        {
          permitType: PermitTypes.BurialPermits,
          roles: []
        }
      ]
    }
]

export const AuthorityContext = createContext({
    authority: Authorities[0],
    setAuthority: () => {}
})