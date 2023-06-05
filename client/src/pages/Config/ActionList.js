// material
import { Box, Pagination, Stack, Typography, Chip } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { EditorMode } from './EditorMode'
import { AuthContext } from 'src/AuthContext'
import { AuthorityContext } from 'src/layouts/dashboard/NewSidebar.js/AuthorityContext'

export default function ActionList(permitType) {

    // const [users, setUsers] = useState([data])
    const [pagination, setPagination] = useState({ pages: 1, current: 1, rows: 5, maxEntries: 0})
    const { authority } = useContext(AuthorityContext)
    const [approvals, setApprovals] = useState([])

    const {userData, setUserData} = useContext(AuthContext)
    const fontSize = userData != null ? userData.fontSize : 14
    
    const openModal = (mode) => {}

    const openUser = (user) => {
        openModal(EditorMode.view)
    }

    const handleChangePage = (_, newPage) => {
        setPagination({...pagination, current: newPage})
    }

    useEffect(() => {
        console.log('Thos permits = ', permitType.permitType)
        // console.log('That permits = ', allPermits[0])
    }, [permitType]);

    useEffect(()=>{

        authority.accessConfig.forEach(aC=>{

            console.log('Auth filter', permitType,  aC.permitType)
        })

        setApprovals(authority.accessConfig.filter(ac=>ac.permitType == permitType.permitType)[0].roles)
    }, [authority])

    const getApprovalWidget = (approval) => {
        return (
            <Box 
                onClick={()=>openUser(approval)}
                key={approval.id} 
                sx={{display:'flex', mx:2, mb:0.5, borderRadius: 1, pb: 1, px: 2, bgcolor:'#80808010', flexDirection:'column', '&:hover': { background: "primary.main"}}}>        
                <Box pt={1} display='flex' flexDirection='column' justifyContent='space-between' alignItems='start'>
                    <Stack direction='row' width='100%' justifyContent='space-between' alignItems='center'>
                    <Typography variant="subtitle1" fontSize={fontSize}>
                        {`${approval.name}`}
                    </Typography>
                    <Chip label={approval.required ? 'Required' : 'Not Required'}/>
                    </Stack>
                    <Typography component='subtitle2' fontSize={12}>
                        {approval.descr}
                    </Typography>
                </Box>
            </Box>
        )
    }

  return (
    <Box>
    <Box sx={{mx:4}}>
    </Box>
        {
            approvals.length > 0 ? 
            approvals.map(user=>getApprovalWidget(user))
            :
            <Typography sx={{width:'100%', my:4, color: 'gray', fontSize: fontSize, textAlign: 'center'}} >
                {`No Approvals/Permissions set for ${permitType}`}
            </Typography> 
        }        
    <Box sx={{display:'flex', flexDirection:'row'}}>
        <Pagination
            count={pagination.pages}
            page={pagination.current}
            onChange={handleChangePage}
            sx={{alignSelf:'flex-end', ml:'auto'}}/>
    </Box>
    </Box>
  )
}