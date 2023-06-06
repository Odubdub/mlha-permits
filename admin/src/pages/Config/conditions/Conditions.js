// material
import { Card, CardHeader, Menu, Button, ToggleButton, ToggleButtonGroup, Stack, IconButton, MenuItem } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useContext, useRef, useState } from 'react'
import { AuthorityContext } from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext'
import ConditionsForm from './ConditionsForm'
import { fDate } from 'src/utils/formatTime'
import { getFullName } from 'src/helper'
import { getShortApplicationName } from 'src/pages/Registrations/PermitTypes'
import CertificateConditionsForm from './CertificateConditions'

export default function Conditions({service}) {

  const allTabs = {
    'form': 'Form',
    'certificate': 'Certificate'
  }
  const tabs = Object.values(allTabs)
  const [selectedTab, setSelectedTab] = useState(allTabs.form)

  const [editConditions, setEditConditions] = useState(false)
  const typeRef = useRef(null)
  const [openType, setOpenType] = useState(false)
  const {authority} = useContext(AuthorityContext)

  const defaultType = authority.accessConfig.map(aC=>(aC.permitType))
  const allPermits = authority.accessConfig.map(aC=>aC.permitType)
  const [permitType, setPermitType] = useState(allPermits[0])
  
  const setType = (permitType) => {
      setOpenType(false)
      setPermitType(permitType)
  }

  return (
    <Card  sx={{pb:2, mt:2, display: 'flex', flexDirection: 'column'}}>
      <CardHeader 
      title={'Conditions'}
      sx={{mb:2}}
      action={
        <ToggleButtonGroup size="small">
            {
            tabs.map((tab) => (
            <ToggleButton 
              key={tab} 
              value={tab} 
              disabled={selectedTab == tab} 
              onClick={()=>{setSelectedTab(tab)}}>
              {tab}
          </ToggleButton>))
          }
        </ToggleButtonGroup>
      }
      subheader={getShortApplicationName(service.code)}/>
      {
        selectedTab == allTabs.form ?
        <ConditionsForm service={service}/>
        :
        <CertificateConditionsForm service={service}/>
      }      
    </Card>
  )
}