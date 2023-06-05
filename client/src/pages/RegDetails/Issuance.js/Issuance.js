import { Box, Chip, Divider, Grid, InputAdornment, List, Paper, Stack, TextField, Typography } from "@mui/material"
import moment from "moment"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "src/AuthContext"
import DynamicField from "./DynamicField"

export const toDateInput = (dateStr) => {

    var date = dateStr != undefined ? new Date(dateStr) : new Date()

    var day = date.getDate()
    var month = date.getMonth() + 1
    var year = date.getFullYear()

    if (month < 10) month = "0" + month
    if (day < 10) day = "0" + day

    return year + "-" + month + "-" + day
}

const calculateValidUntil = (validFrom, duration) => {

    const start = new Date(validFrom)
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000)
    return end
}

export default function Issuance({ isDisabled=false, config, setIssuanceData, data, issuanceData, errors}){

    const { userData } = useContext(AuthContext)


    useEffect(()=>{
        
        //Default Fields
        const fieldData = {}
        if (config.issue) {
            config.issue.forEach(field => {
                fieldData[field.fieldName] = field.defaultValue || ''
            })
        }

        //Set default values
        setIssuanceData({
            ...issuanceData, 
            ...fieldData,
        })
    }, [issuanceData.validFrom])

    
    return (
        <Stack sx={{width: '100%', maxHeight:500, display: 'flex', justifyContent: 'left'}}>
            <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
                Issuance
            </Typography>
            <Typography marginBottom='0.5em'  variant="h6" color='#808080' fontWeight='normal' fontSize={14} ml={2} component="h2">
                {config.title}
            </Typography>
            <Divider />
            <Paper style={{maxHeight: '80vh', overflow: 'auto'}}>
                <List> 
                    <Stack>
                    <Box display='flex' flexDirection='row' my={1}>
                    <Grid container>
                        <Grid item xs={3} sm={6} md={8}>
                            <Stack flex={1} ml={2} mt={2} mr={2}>
                                <Typography fontWeight='bold' mb={1}>
                                    {`Additional Details`}
                                </Typography>
                                <Stack direction='column'>
                                    {
                                        (config.issue || []).map((field, index)=>(<DynamicField field={field} fieldData={issuanceData} errors={errors} setFieldData={setIssuanceData} isDisabled={isDisabled} key={index} />))
                                    }
                                </Stack>
                                <Stack bgcolor='#80808010'>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={6} md={4}> 
                            <Stack flex={1} ml={2} mt={2} mr={2}>
                                <Typography fontWeight='bold' mt={1}>
                                    {`Issued by`}
                                </Typography>
                                <Divider/>
                                <Stack direction='row' mb={1}>
                                    <Box  width={150} minWidth={150}>
                                        <Typography fontWeight='normal'>
                                            Designation
                                        </Typography>
                                    </Box>
                                    <p fontWeight='medium'>
                                        {userData.designation}
                                    </p>
                                </Stack>
                                <Stack direction='row' mb={1}>
                                    <Box width={150} minWidth={150}>
                                        <Typography fontWeight='normal'>
                                            Name
                                        </Typography>
                                    </Box>
                                    <p fontWeight='medium'>
                                        {`${userData.foreNames} ${userData.lastName}`}
                                    </p>
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    </Box>
                    <Divider />
                    </Stack>
                </List>
            </Paper>
        </Stack> 
    )}
