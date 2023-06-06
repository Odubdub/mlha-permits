import { Box, Chip, Divider, FormControl, Grid, InputAdornment, InputLabel, List, ListItemText, MenuItem, OutlinedInput, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { useContext, useEffect } from "react"
import { AuthContext } from "src/AuthContext"
import DynamicField from "./DynamicField"


export default function DirectIssuance({ isDisabled=false, config, setIssuanceData, issuanceData, errors}){

    const { userData } = useContext(AuthContext)

    // useEffect(()=>{
    //     //Calculate end date
    //     setIssuanceData({...issuanceData,})
        
    //     //Default Fields
    //     const fieldData = {}
    //     if (config.fields) {
    //         config.fields.forEach(field => {
    //             fieldData[field.fieldName] = field.defaultValue || ''
    //         })
    //     }

    //     //Set default values
    //     setIssuanceData({
    //         ...issuanceData, 
    //         ...fieldData
    //     })
    // },[])
    
    return (
        <Stack sx={{width: '100%', maxHeight:500, display: 'flex', justifyContent: 'left'}}>
            <Typography id="m-title" variant="h4" ml={2} mt={1} component="h2">
                Direct Issuance
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
                                        (config.fields || []).map((field, index)=>(<DynamicField field={field} fieldData={issuanceData} errors={errors} setFieldData={setIssuanceData} isDisabled={isDisabled} key={index} />))
                                    }
                                </Stack>
                                <Stack bgcolor='#80808010'>
                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={3} sm={6} md={4}> 
                            <Stack flex={1} ml={2} mt={2} mr={2}>
                                <Typography fontWeight='bold' mt={1}>
                                    {`Issuer's Details`}
                                </Typography>
                                <Divider/>
                                <Stack direction='row' mb={1}>
                                    <Typography fontWeight='normal' width={150}>
                                        Designation
                                    </Typography>
                                    <Typography fontWeight='medium'>
                                        {userData.designation}
                                    </Typography>
                                </Stack>
                                <Stack direction='row' mb={1}>
                                    <Typography fontWeight='normal' width={150}>
                                        Name
                                    </Typography>
                                    <Typography fontWeight='medium'>
                                        {`${userData.foreNames} ${userData.lastName}`}
                                    </Typography>
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
