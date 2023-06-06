// material
import { Box, Card, Chip, Collapse, Divider, IconButton, InputAdornment, Pagination, Stack, TextField, Tooltip, Typography } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from 'src/AuthContext'
import { getFromServer } from 'src/ApiService'
import { cleanString } from '../Services'
import { matchSorter } from 'match-sorter'
import { RoleCell } from '../roles/RoleCell'

export default function UsersList({openUser, openList, roles}) {

    const [users, setUsers] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [selectedUser, setSelectedUser] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [searchQ, setSearchQ] = useState('')

    const [page, setPage] = useState(1)
    const pageLimit = 5
    const [displayedUsers, setDisplayedUsers] = useState([])

    const {userData, setUserData} = useContext(AuthContext)

    const fontSize = userData != null ? userData.fontSize : 14

    const handleChangePage = (_, newPage) => {
        setPage(newPage)
    }

    const getName = (user) => {

        if (user.foreNames){
            return `${user.foreNames} ${user.lastName}`
        }

        return user.email
    }

    const search = (event) => {

        //delay for search
        const v = event.target.value
        setSearchQ(v)
        if (v){
            setTimeout(() => {
                if (v == event.target.value) {
                    const output = matchSorter(users, v, {keys: ['email', 'idNumber', 'designation', 'foreNames', 'lastName']})
                    setDisplayedUsers(output.slice(0,pageLimit))
                }
            }, 500)
        } else {
            setUsers([...users])
        }
    }

    useEffect(()=>{

        if (roles.length > 0){
            const path = `authority/admin-users`
            getFromServer({
                path: path,
                onComplete: data => {
                    console.log('Got users here')
                    setUsers(data)
                }
            })
        }

        setPage(1)
    }, [roles])

    useEffect(()=>{

        const start = (page - 1)*pageLimit
        setDisplayedUsers(users.slice(start, start+pageLimit))
    }, [page, users])

    const removePrefix = (string) => {
    //remove word from string that starts with 'S00'
        if (string.startsWith('S00')){

            //remove first word from string
            const words = string.split(' ')
            words.shift()
            return words.join(' ')
        }

        return string
    }

    const getAdminServices = (userRoles) => {

        const services = []

        roles.forEach(role => {

            if (userRoles.includes(role._id)){

                if (!services.includes(role.service.code)){
                    services.push(role.service.code)
                }
            }
        })

       return services
    }

    const getUserWidget = (user) => {

        const isSelected = selectedUser == user._id
        return (
            <Stack 
                onClick={()=>isSelected ? setSelectedUser('') : setSelectedUser(user._id)} 
                onMouseLeave={()=>setSelectedUser('')}
                key={user._id}
                sx={{display:'flex', bgcolor: '#80808010', mx: isSelected ? 0 : 3, mb:1, borderRadius: 1, py: isSelected ? 1 : 0, pr: isSelected ? 3 : 0, pl: 2, flexDirection:'column', transition: "all 0.3s", 
                '&:hover': { bgcolor: isSelected ? '#80808010' : 'primary.main'}}}>
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant="subtitle1" fontSize={14}>
                        {getName(user)}
                    </Typography>
                    <Stack direction='row' alignItems='center'>
                        {
                            isSelected ?
                            <>
                                {
                                    !user.foreNames &&
                                    <Stack direction='row' alignItems='center' px={0.5} py={0.3} height={26} color='#fff' bgcolor='red' borderRadius={2} >
                                        <Iconify icon='mdi:alert-circle-outline' fontSize={20} />
                                        <Typography ml={0.7} mr={1} fontSize={14}>Not Activated</Typography>
                                    </Stack>
                                }
                                <Box display='flex' px={1} py={0.5} color='#fff' borderRadius={1} flexDirection='row' alignItems='center'>
                                    <Tooltip title={
                                        <Stack>
                                            {
                                                getAdminServices(user.roles).map(s=>(
                                                    <Typography variant="subtitle1" fontSize={14}>
                                                        {removePrefix(cleanString(s))}
                                                    </Typography>
                                                ))
                                            }
                                        </Stack>}>
                                        <Chip ml={1} mt={1} size='small' label={
                                            <Iconify icon='carbon:service-id' color={selectedUser === user._id ? '#000' : '#808080'} />
                                            }/>
                                    </Tooltip>
                                </Box>
                                <IconButton sx={{justifySelf: 'end'}} onClick={()=>openUser(user)}>
                                    <Iconify icon='mdi:edit' color={selectedUser === user._id ? '#000' : '#808080'} />
                                </IconButton>
                            </>
                            :
                            <Box display='flex' px={1} py={0.5} color='#fff' borderRadius={1} flexDirection='row' alignItems='center'>
                                <Tooltip title={`${getName(user)} has ${user.roles.length} role${user.roles.length > 1 ? "s" : ""}`}>
                                    <Chip ml={1} mt={1} label={user.roles.length}/>
                                </Tooltip>
                            </Box>
                        }
                    </Stack>
                </Box>
                <Collapse in={selectedUser == user._id}>
                    <Stack>
                        {
                            roles.length > 0 &&
                            <>
                                <Divider sx={{my:1}}/>
                                {
                                    user.roles.map((role, i) => {
                                        return (
                                        <RoleCell key={i} ml={1} mr={0} role={roles.find(r => r._id == role)} roles={roles} setSelectedRole={setSelectedRole} selectedRole={selectedRole}/>
                                    )})
                                }
                            </>
                        }
                    </Stack>
                </Collapse>
            </Stack>
        )
    }


  return (
      <Stack flex={1}>
        <Collapse in={openList}>
            <Box sx={{mx:3}}>
                <TextField 
                fullWidth
                size='small'
                onChange={search}
                placeholder='Search for user'
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        {
                            searchQ.length > 0 &&
                            <Chip label={`${displayedUsers.length} result${displayedUsers.length==1?'':'s'}`}/>
                        }
                    </InputAdornment>),
                    startAdornment: (
                        <InputAdornment position="end">
                            <Iconify fontSize={16} sx={{transform:'translate(-10px,0px)'}} icon='fe:search'/>
                        </InputAdornment>
                      )
                  }}
                id="outlined-basic"
                sx={{mb: 2, fontSize: fontSize}}
                variant="outlined" />
            </Box>
            <Stack>
                {
                    users.length > 0 ?
                    <Stack display='flex'>
                        {
                            displayedUsers.map(user=>getUserWidget(user)) 
                        }
                    </Stack> 
                    : 
                    <Typography 
                        sx={{width:'100%', color: 'gray', fontSize: fontSize, textAlign: 'center'}} >
                        { isSearch ? 'No Users With that Omang Number' : 'No Registered Users' }
                    </Typography>
                }
            </Stack>
        </Collapse>
        {
            users.length > 0 && openList && searchQ.length == 0 &&
            <Stack alignItems={'end'} flex={1} justifyContent='end' pr={2}>
                <Pagination mr={2} count={Math.ceil(users.length/pageLimit)} page={page} onChange={handleChangePage} sx={{marginTop: 1}}/>
            </Stack>
        }
      </Stack>
  )
}