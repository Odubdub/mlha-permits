import { LoadingButton } from '@mui/lab'
import { Box, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { postToServer } from 'src/ApiService'
import Iconify from 'src/components/Iconify'
import { isBlank } from 'src/helperFuntions'
import XLSX from 'xlsx'
import { saveAs } from "file-saver";

const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x }).join(",")

/* generate an array of column objects */
const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o
}

const getData = (str) => {
    var output = '';
    for (var i = 0; i < str.length; i++) {
        output += String.fromCharCode(str.charCodeAt(i) - 1);
    }
    return output;
}
const downloadTemplate = (dept) => {
    /* original data */
    var data = JSON.parse('['+getData('\|#Pnboh#;#882323434#-#Fnbjm#;#xbtifAefwtrm/dp/cx#-#Eftjhobujpo#;#Tfojps!Gspoufoe!Efw#~^'))

    /* make the worksheet */
    var ws = XLSX.utils.json_to_sheet(data);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "People");
    XLSX.utils.book_append_sheet(wb, ws, "People2");

    /* write workbook (use type 'binary') */
    // XLSX is a ZIP-based format,
    //  Attempts to write a ZIP-based format as type "string" are explicitly blocked due to various issues with getting other browser APIs to play nice with the string.
    //   The "string" output format is primarily for text-based formats like HTML and CSV where you don't want to convert Chinese and other characters back to raw bytes.
    var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    /* generate a download */
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    // The preference for application/octet-stream probably has to do with IE6 compatibility.
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      `${dept} Permit Admins.xlsx`
    );
  };

export const UserBulk = ({onClose, department}) => {

    const [errors, setErrors] = useState({allErrors: []})
    const [responseError, setResponseError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const [data, setData] = useState({
        users: [],
        cols: []
      })
    
  const handleChange = (e) => {
    const files = e.target.files
    setResponseError(null)
    if (files && files[0]) setData({...data, value: e.target, file: files[0] })
  }
 
  const handleFile = (file) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader()

    const rABS = !!reader.readAsBinaryString
 
    reader.onload = (e) => {

      /* Parse data */
      const bstr = e.target.result
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const dataJson = XLSX.utils.sheet_to_json(ws)
      /* Update state */

      const d = { ...data, users: dataJson, cols: make_cols(ws['!ref']) }
      validateAll(d)
    }
 
    if (rABS) {
      reader.readAsBinaryString(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const validateAll = (d) => {

    const users = d.users.map(user => convertKeysToLowercase(user))
    const allErrors = []
    const errs = {}

    users.forEach(user => {

        if(isBlank(user.designation)) {
            errs.firstname = true
            allErrors.push('Designation: required')
        }
        if(!isOmangNumber(user.omang)) {
            errs.lastname = true
            allErrors.push(`Invalid omang: ${user.omang}`)
        }
        if(!validateEmail(user.email)) {
            errs.email = true
            allErrors.push(`Invalid email: ${user.email}`)
        }
    })

    setErrors({...errs, allErrors})
    if (allErrors.length == 0) {
        
        setData({...data, users})
    }
  }

  const refreshInput = () =>{
    setRefreshKey(refreshKey+1)
    setData({
      users: [],
      cols: []
    })
  }
  const uploadAll = () => {

    const allUsers = data.users.map(user=>({
      idNumber: user.omang, 
      email: user.email, 
      designation: user.designation
    }))
    
    setIsLoading(true)
    postToServer({
      path: 'authority/admin-users/bulk-upload', 
      params: { users: allUsers }, 
        onComplete: res=>{
          setIsLoading(false)
          refreshInput()
          if ((res.failedUsers || []).length > 0){
            setErrors({allErrors: []})
            
            setResponseError(res)
          } else {
            onClose()
          }
        }, 
        onError: error => {
          refreshInput()
        }
      })
}

  //function to check if string if omang is valid
    const isOmangNumber = (str) => {
        return (/^\d+$/.test(str) && str.length === 9 && (str.charAt(4) === '2' || str.charAt(4) === '1'));
    }

  //function to change all uppercase keys to lowercase
    const convertKeysToLowercase = (obj) => {
        const newObj = {};
        Object.keys(obj).forEach(key => {
            
            newObj[key.toLowerCase()] = obj[key].trim()
        });

        return newObj;
    }

  //function for validating email addresses
    const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/
        return re.test(email)
    }
  
  useEffect(() => {

    if (data.file){
        handleFile(data.file)
    }
  },[data.file])

  return (
    <Stack sx={{width: '100%', height: '310px', px: 2, mt: 2, justifyContent:'space-between'}}>
        <TextField
            onChange={handleChange}
            name={"file"}
            id="file"
            key={refreshKey}
            accept={SheetJSFT}
            type={'file'}
            InputLabelProps={{ shrink: true }}
            fullWidth
            label={'Select File'}
            variant="outlined" />
            {
                errors.allErrors.length > 0 &&
                <Stack alignItems='center' width='100%'>
                    <Typography variant='subtitle' sx={{fontWeight: 'bold', color: 'error.main'}}>
                        {`Found ${errors.allErrors.length} Error${errors.allErrors.length==1?'':'s'}.`}
                    </Typography>
                    <Typography variant='caption' textAlign='center' fontSize={14}>
                        {
                            `Fix the following error${errors.allErrors.length==1?'':'s'} in the data sheet uploaded: ` + errors.allErrors.join(', ')
                        }
                    </Typography>
                </Stack>
            }
            {
              responseError &&
              <Stack alignItems='center' width='100%'>
                
                {
                  responseError.addedUsers.length > 0 &&
                  <Stack sx={{fontWeight: 'bold', width: '98%', color: 'red', bgcolor: '#8080801F', my: 0.5, borderRadius: 2, px: 2, py: 1}}>
                    <Typography variant='subtitle' sx={{fontWeight: 'bold', color: 'green'}}>
                    {`Successfully added ${responseError.addedUsers.length} user(s)`}
                    </Typography>
                    <Typography color='#000' variant='caption'>
                      {
                        responseError.addedUsers.map((user)=>user.email).join(', ')
                      }
                    </Typography>
                  </Stack>
                }
                {
                  responseError.failedUsers.length > 0 &&
                  <Stack sx={{fontWeight: 'bold', color: 'red', width: '98%', bgcolor: '#8080801F', my: 0.5, borderRadius: 2, px: 2, py: 1}}>
                    <Typography variant='subtitle' sx={{fontWeight: 'bold', color: 'red'}}>
                      {`Failed to add ${responseError.failedUsers.length} user(s)`}
                    </Typography>
                    <Typography color='#000' variant='caption'>
                      {
                        responseError.failedUsers.map((user)=>`${user.email}: ${user.reason}`).join(', ')
                      }
                    </Typography>
                  </Stack>
                }
              </Stack>
            }
            {
                errors.allErrors.length == 0 && data.users.length > 0 && responseError == null &&
                <Stack alignItems='center' width='100%'>
                    <Typography variant='subtitle' sx={{fontWeight: 'bold'}}>
                        {`Found ${data.users.length} User${data.users.length==1?'':'s'}.`}
                    </Typography>
                    <Typography variant='caption' textAlign='center' fontSize={14}>
                        {
                            data.users.map(u=>u.email).join(', ')+`. You will have to assign roles to ${data.users.length==1?'this user':'these users'} to complete the registration process.`
                        }
                    </Typography>
                </Stack>
            }
            <Box display='flex' flexDirection='row' justifyContent='end' width='100%'>
            <LoadingButton
                    variant="contained"
                    onClick={()=>downloadTemplate(department.code)}
                    loadingPosition='end'
                    centerRipple
                    startIcon={<Iconify icon="file-icons:microsoft-excel"/>}
                    endIcon={<Iconify icon="fluent:arrow-download-20-filled"/>}
                    sx={{marginTop: 2, '&:hover':{bgcolor: '#00C700'}, boxShadow: '', bgcolor:'#00A700', marginRight: 1.5, alignSelf: 'end', justifySelf:'end'}}>
                    Get Template
                </LoadingButton>
                <LoadingButton
                    variant="contained"
                    onClick={uploadAll}
                    disabled={data.users.length == 0}
                    loadingPosition='end'
                    loading={isLoading}
                    centerRipple
                    endIcon={<Iconify icon="charm:arrow-right"/>}
                    sx={{marginTop: 2, marginRight: 1.5, alignSelf: 'end', justifySelf:'end'}}>
                    Upload
                </LoadingButton>
            </Box>
    </Stack>
  )
}
