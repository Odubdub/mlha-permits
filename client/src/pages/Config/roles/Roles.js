// material
import { Card, CardHeader, Menu, Stack, MenuItem, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, Box, OutlinedInput, Chip } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useContext, useState } from 'react'
import { AuthorityContext } from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext'
import { getFullName } from 'src/helper'
import RoleForm from './RoleForm'
import RoleList from './RoleList'
import { capitalize, cleanString, replaceHyphens } from '../format'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    }
  }
}

export default function Roles({onRefreshRoles, department, service}) {

    // const [users, setUsers] = useState([data])
    const [showList, setShowList] = useState(true)
    const [openType, setOpenType] = useState(false)
    const [role, setRole] = useState(null)

    const allTabs = {
      'all': 'Existing',
      'new': 'New Role'
    }

    const tabs = Object.values(allTabs)
    const [selectedTab, setSelectedTab] = useState(allTabs.all)
    const {authority} = useContext(AuthorityContext)
    const allPermits = authority.accessConfig.map(aC=>aC.permitType)
    const [permitType, setPermitType] = useState(allPermits[0])
    
    const setType = (permitType) => {

        setOpenType(false)
        setPermitType(permitType)
    }

    const editRole = (r) => {

      setRole(r)
      setSelectedTab(allTabs.new)
    }

    const refresh = () => {

        setSelectedTab(allTabs.all)
        onRefreshRoles()
        setRole(null)
    }

  return (
    <Card  sx={{pb:2, display: 'flex', flexDirection: 'column', minHeight: 420}}>
      <CardHeader 
      title={'Roles'}
      subheader={showList ? 'Assign a role' : 'Create a role'}
      action={
        <ToggleButtonGroup size="small">
            {
            tabs.map((tab) => (<ToggleButton 
            key={tab} 
            value={tab} 
            disabled={selectedTab == tab || role != null} 
            onClick={()=>{setSelectedTab(tab)}}>
            {tab}
          </ToggleButton>))
          }
        </ToggleButtonGroup>
      }
      />
      <Stack alignItems={'center'} flex={1}>
        {
          service != null && 
          <>
            {
              selectedTab == allTabs.all ?
              <RoleList
                capitalize={capitalize} 
                openRole={editRole}
                replaceUnderscores={replaceHyphens}
                service={service}/>
                :
              <RoleForm
                permitType={permitType} 
                onClose={()=>refresh()} 
                department={department} 
                cleanString={cleanString} 
                role={role}
                service={service}
                capitalize={capitalize} 
                replaceUnderscores={replaceHyphens}/>
            }
          </>
        }
      </Stack>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={openType}
        onClose={()=>setOpenType(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {
          allPermits.map((permit)=>(
              <MenuItem key={permit} onClick={()=>setType(permit)}>
              {getFullName(permit)}
              { permitType == permit &&
                  <Iconify ml={1} icon='bi:check'/>
              }
              </MenuItem>
          ))
        }
      </Menu>
    </Card>
  )
}