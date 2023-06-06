// material
import { Card, CardHeader, Stack, IconButton, Collapse, ToggleButtonGroup, ToggleButton } from '@mui/material'
import { useEffect, useState } from 'react'
import UserForm from './UserForm'
import { EditorMode } from '../EditorMode'
import UsersList from './UserList'
import { getFromServer } from 'src/ApiService'
import { UserBulk } from './UserBulk'

export default function Users({service, department}) {

const allTabs = {
  'all': 'Existing',
  'new': 'New User',
  'bulk': 'Bulk Upload'
}

 // const [users, setUsers] = useState([data])
 const [editorMode, setEditorMode] = useState(EditorMode.none)
 const [user, setOpenUser] = useState(null)
 const [allRoles, setAllRoles] = useState([])
const [serviceRoles, setServiceRoles] = useState([])
const [usersKey, setUsersKey] = useState(0)

 const tabs = Object.values(allTabs)
 const [selectedTab, setSelectedTab] = useState(allTabs.all)

 const viewUser = (user) => {

    setOpenUser(user)
    setEditorMode(EditorMode.view)
 }

 const close = () => {

    setEditorMode(EditorMode.none)
    setOpenUser(null)
  }

  const closeAndReload = () => {
    setEditorMode(EditorMode.none)
    setOpenUser(null)
    setSelectedTab(allTabs.all)
    setUsersKey(usersKey + 1)
  }

  const createUser = () => {

    setEditorMode(EditorMode.create)
    setOpenUser(null)
  }

  useEffect(()=>{

    getFromServer({path: 'authority/roles', params: {}, onComplete: (response)=>{

      const servRoles = []
      response.forEach(role => {
        if (role.service != null && service != null){
          if (role.service._id == service._id){
            servRoles.push(role)
          }
        }
      })

      // console.log('Roles ', response)
      // console.log('Service Roles ', servRoles)
      setServiceRoles(servRoles)
      setAllRoles(response)
    }, onError: (error)=>{
        console.log('Error is : ', error)
    }})
  },[department, service])

  useEffect(()=>{

    if (selectedTab == allTabs.new){
      createUser()
    } else {
      close()
    }
  },[selectedTab])

  useEffect(()=>{
    
  },[service, department])

  return (
    <Card  sx={{pb:2, display: 'flex', flexDirection: 'column', minHeight: 420}}>
      <CardHeader
      title='User Accounts' sx={{mb:1}} 
      subheader={selectedTab == allTabs.bulk ? 'Upload Users' : (editorMode == EditorMode.none ? 'All users & their assigned roles' : editorMode == EditorMode.create ? 'Create a user account' : "Update Admin's details")}
      action={
        <ToggleButtonGroup size="small" disabled={editorMode == EditorMode.view}>
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
      }/>
      {
        selectedTab != allTabs.bulk ?
      <Stack flex={1}>
        <Collapse in={editorMode != EditorMode.none}>
          <UserForm roles={serviceRoles} editorMode={editorMode} department={department} service={service} onReload={()=>setUsersKey(usersKey+1)} user={user} close={close}/>
        </Collapse>
        <UsersList key={usersKey} openList={editorMode == EditorMode.none} roles={allRoles} openUser={viewUser} department={department} service={service} close={close}/>
      </Stack>
      :
      <UserBulk onClose={closeAndReload} department={department}/>
      }
    </Card>
  )
}