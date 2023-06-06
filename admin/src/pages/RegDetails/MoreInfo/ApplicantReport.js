import * as React from 'react'
import { Box, Chip, Divider, Fade, IconButton, List, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography, useTheme } from '@mui/material'
import Iconify from 'src/components/Iconify'
import Loader from 'src/components/Loader/loader'
import { useState, useRef } from 'react'
import { useEffect } from 'react'
import { postToServer } from 'src/ApiService'
import ReportChart from './ReportChart'
import TableHeader from 'src/components/TableHead'
import { getShortApplicationName } from 'src/pages/Registrations/PermitTypes'
import { getStatusColor, getStatusDescription } from 'src/helper'
import { fDate } from 'src/utils/formatTime'
import SearchNotFound from 'src/components/SearchNotFound'
import { useContext } from 'react'
import { RegDetailsContext } from '../RegDetailsContext'
import { useNavigate } from 'react-router-dom'

const TABLE_HEAD = [
    { id: 'type', label: 'Application Type', align: 'center' },
    { id: 'status', label: 'Status', align: 'center' },
    { id: 'registered', label: 'Registered', align: 'center' },
    { id: 'updated', label: 'Updated', align: 'center' },
  ]

export default function ApplicantReport({open, id, onClose, regNo, serviceCodes}){

    const theme = useTheme()
    const [data, setData] = useState(null)
    const [hasFailed, setHasFailed] = useState(false)
    const navigate = useNavigate()

    const { openApplicationID } = useContext(RegDetailsContext)

    const stop = useRef(null)
    const start = useRef(null)
    const stopWithCheck = useRef(null)
    const stopWithError = useRef(null)

    const getNextPath = () => {
        if (window.location.pathname.includes('/more-details'))
            return `details`
        return `more-details`
    }

    useEffect(() => {
        if (!hasFailed && open && data == null) {
            setTimeout(()=>{
                start.current()
                postToServer({path: `statistics/applicant/${serviceCodes[0]}/${regNo}`, params: {serviceCodes},onComplete: d=>{
                    setTimeout(()=>{
                        stopWithCheck.current()
                        setHasFailed(false)
                        setTimeout(()=>{
                            setData(d)
                            console.log('data ',d)
                        }, 1500)
                    }, 1000)
                }, onError: err=>{
                    console.log('err => ', err)
                    setHasFailed(true)
                    stopWithError.current()
                }})
            }, 1000)
        }
    }, [start.current, open])

  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        closeAfterTransition
        BackdropProps={{ timeout: 500 }}>
        <Stack sx={{alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
          <Fade in={open} style={{opacity: 1}}>
            <Box bgcolor='#fff' borderRadius={2} py={2} px={3}>
                <Stack direction='row' justifyContent='space-between' alignItems='center' pb={1}>
                    <Stack alignItems='center' direction='row'>
                        <Typography variant="h6" mb={0} gutterBottom>
                        {'Applicant Report'}
                        </Typography>
                        {
                            data != null &&
                            <Iconify fontSize={20} sx={{color: data != null ? 'green' : 'red', ml:2}} icon={data != null?'akar-icons:circle-check-fill':'ep:circle-close-filled'}/>
                        }
                    </Stack>
                    <IconButton onClick={onClose}>
                        <Iconify icon='clarity:close-line'/>
                    </IconButton>
                </Stack>
                <Divider/>
                <Paper style={{maxHeight: '70vh', minHeight: 500, minWidth: 500, overflow: 'auto'}}>
                {
                    data != null ?
                    <List>
                        <ReportChart
                            title={`Applications by #${regNo}`}
                            chartData={[
                                { label: 'Issued', value: data.issued },
                                { label: 'Pending', value: data.pending },
                                { label: 'Returned', value: data.returned },
                                { label: 'Rejected', value: data.rejected },
                                { label: 'Revoked', value: data.revoked },
                                { label: 'Pending Payment', value: data.pendingPayment }
                            ]}
                            chartColors={[
                                theme.palette.primary.main,
                                theme.palette.chart.blue[0],
                                theme.palette.chart.violet[0],
                                theme.palette.chart.yellow[0],
                            ]}
                            />
                        <Divider/>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                            <TableHeader
                                order='asc'
                                orderBy=''
                                headLabel={TABLE_HEAD}
                                rowCount={data.applications.length}/>
                            {
                                data.applications.length ? 
                                <TableBody>
                                {data.applications
                                .map((row) => {
                                    const { _id, serviceCode, status, createdAt, updatedAt } = row
                                    const isOpen = _id == id 
                                    return (
                                    <TableRow
                                        tabIndex={-1}
                                        key={_id}
                                        onClick={ isOpen ? null : () => navigate(`/application/${getNextPath()}?id=${_id}`)}
                                        role="checkbox"
                                        sx={{bgcolor: isOpen ? '#80808010' : 'transparent', cursor: isOpen ? 'not-allowed' : 'pointer'}}
                                        hover>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                                <Box sx={{pt:1,pb:1, my: 1}}>
                                                    <Typography variant="subtitle3" textTransform='capitalize' noWrap>
                                                    {getShortApplicationName(serviceCode)}
                                                    </Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                            <Box sx={{pt:1,pb:1}}>
                                                <Typography variant="subtitle3" textTransform='capitalize' noWrap>
                                                <Chip label={getStatusDescription(status)} size='small'  color='primary' style={{backgroundColor:getStatusColor(status)}}/>
                                                </Typography>
                                            </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                            <Typography variant="subtitle3" noWrap>
                                            {fDate(createdAt)}
                                            </Typography>
                                            </Stack>
                                        </TableCell>
                                        
                                        <TableCell component="th" scope="row" padding="none">
                                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                                            <Typography variant="subtitle3" noWrap>
                                                {fDate(updatedAt)}
                                            </Typography>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                    
                                    );
                                })}
                            </TableBody>
                            :
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                    <SearchNotFound />
                                    </TableCell>
                                </TableRow>
                                </TableBody>
                            }
                            </Table>
                        </TableContainer>
                    </List>
                    :
                    <Stack direction='column' justifyContent='center' alignItems='center' mt={4}>
                        <Box sx={{transform: 'scale(1.5)'}}>
                            <Loader start={start} stop={stop} stopWithCheck={stopWithCheck} stopWithError={stopWithError} />
                        </Box>
                        <Fade in={hasFailed}>
                            <Stack direction='row' justifyContent='center' alignItems='center' mt={4}>
                                <Stack alignItems='center' mt={2} color='#808080'>
                                    <Typography variant="subtitle" sx={{transform: 'translate(0px, 5px)'}} fontSize={16} my={0}>
                                        Failed to generate report
                                    </Typography>
                                    <Typography variant="h6" my={0}>
                                        Please try again later
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Fade>
                    </Stack>
                }          
                </Paper>
                <Divider/>
                <Stack direction='row' height={35} justifyContent='start' alignItems='center' pb={1}>
                    <Iconify fontSize={30} sx={{color: '#808080', mt: 2.5}} icon='icon-park-twotone:certificate'/>
                    <Stack mt={2} ml={1} color='#808080'>
                        <Typography variant="subtitle" sx={{transform: 'translate(0px, 5px)'}} fontSize={12} my={0}>
                            {`Applicant #${regNo} report source`}
                        </Typography>
                        <Typography variant="h6" fontSize={18} my={0}>
                            Central Permit Management
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
          </Fade>
        </Stack>
      </Modal>
  )
}