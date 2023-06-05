// material
import { Card, CardHeader, Menu, Button, Stack, IconButton, MenuItem, Collapse } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useContext, useEffect, useRef, useState } from 'react'
import ApprovalForm from './ActionForm'
import ActionList from './ActionList'
import { AuthorityContext } from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext'
import { AuthorityPermits, getFullName } from 'src/helper'

export default function Approvals() {

    // const [users, setUsers] = useState([data])
    const [showApprovalList, setShowUserList] = useState(true)

    const typeRef = useRef(null)
    const [openType, setOpenType] = useState(false)

    const {authority} = useContext(AuthorityContext)
    const allPermits = authority.accessConfig.map(aC=>aC.permitType)
    const [permitType, setPermitType] = useState(allPermits[0]) 
    
    const setType = (permitType) => {

        setOpenType(false)
        setPermitType(permitType)
    }

  return (
    <Card  sx={{pb:2, mt:2, display: 'flex', flexDirection: 'column'}}>
      <CardHeader 
      title={
      <Button ref={typeRef} sx={{color:'#000', transform: `translateX(-10px)`, fontSize: '18px'}} onClick={()=>setOpenType(true)}>
          {`Required Actions・${getFullName(permitType)}`}
      </Button>
      } sx={{mb:2}}
      subheader={showApprovalList ? 'All actions' : 'Create an action'}
      action={
          <Stack  direction="row" spacing={2}>
            <IconButton aria-label="settings" onClick={()=> setShowUserList(!showApprovalList)}>
                <Iconify icon={showApprovalList ? 'bx:list-plus' : 'bx:list-check'}/>
            </IconButton>
          </Stack>
      }/>
      <Collapse in={!showApprovalList}>
        <ApprovalForm permitType={permitType}/>
      </Collapse>
      <Collapse in={showApprovalList}>
        <ActionList permitType={permitType}/>
      </Collapse>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={typeRef.current}
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