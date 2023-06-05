// material
import { Box, Chip, Collapse, Divider, InputAdornment, Pagination, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/AuthContext'
import { getFromServer } from 'src/ApiService'
import Iconify from 'src/components/Iconify'
import { matchSorter } from 'match-sorter'
import { RoleCell } from './RoleCell'

export default function RoleList({openRole, service}){

    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState('')
    const [allRoles, setAllRoles] = useState([])
    const [page, setPage] = useState(1)
    const pageLimit = 5
    const [displayedRoles, setDisplayedRoles] = useState([])
    const [searchQ, setSearchQ] = useState('')

    const {userData, setUserData} = useContext(AuthContext)
    const fontSize = userData != null ? userData.fontSize : 14

    const handleChangePage = (_, newPage) => {
        setPage(newPage)
    }

    const search = (event) => {

        //delay for search
        const v = event.target.value
        setSearchQ(v)
        if (v){
            setTimeout(() => {
                if (v == event.target.value) {
                    const output = matchSorter(roles, v, {keys: ['name', 'permissions']})
                    setDisplayedRoles(output.slice(0,pageLimit))
                }
            }, 500)
        } else {

            setRoles([...roles])
        }
    }

    useEffect(()=>{
        const path = `authority/roles`
        getFromServer({
        path: path,
        onComplete: respose => {

            setAllRoles(respose)
            setRoles(respose.filter(role =>{
                if (role.service == null){
                    return false
                }

                return role.service._id == service._id
            }))
        }, onError: err=> {
            // console.log('Failed to fetch Users ', JSON.stringify(err.message))
        }})
    }, [])

    useEffect(()=>{
        setRoles(allRoles.filter(role =>{
            if (role.service == null){
                return false
            }
            return role.service._id == service._id
        }))
        setPage(1)
    }, [service])

    useEffect(()=>{

        const start = (page - 1)*pageLimit
        setDisplayedRoles(roles.slice(start, start+pageLimit))
        
    }, [page, roles])

  return (
      <Stack sx={{width: '100%', mt: 1, flex: 1}}>
        <Box mx={3}>
            <TextField
                fullWidth
                size='small'
                onChange={search}
                placeholder='Search for role'
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <Iconify icon='bi:search'/>
                    </InputAdornment>
                    ),
                    endAdornment: (
                    <InputAdornment position="end">
                        {
                            searchQ.length > 0 &&
                            <Chip label={`${displayedRoles.length} result${displayedRoles.length==1?'':'s'}`}/>
                        }
                    </InputAdornment>)
                }}
                id="outlined-basic"
                sx={{mb: 1, fontSize: fontSize}}
                variant="outlined" />
        </Box>
            {
            roles.length > 0 ? 
            <Stack justifyContent='space-between' height='100%' mx={1} flex={1}>
                <Stack flex={1}>
                 {
                   displayedRoles.map((role, index)=>(<RoleCell role={role} onOpen={openRole} index={index} setSelectedRole={setSelectedRole} selectedRole={selectedRole}/>))
                 }
                </Stack>
                {
                    searchQ.length == 0 &&
                    <Stack alignItems={'end'} pr={2}>
                        <Pagination mr={2} count={Math.ceil(roles.length/pageLimit)} page={page} onChange={handleChangePage} sx={{marginTop: 1}}/>
                    </Stack>
                }
            </Stack>
            : 
            <>
                <Typography sx={{width:'100%', fontSize: fontSize, textAlign: 'center', mt: 3}} >
                    No registered roles
                </Typography> 
                <Typography sx={{width:'100%', fontSize: fontSize, textAlign: 'center', mb: 3}} >
                    for this service
                </Typography> 
            </>
            }
      </Stack>
  )
}