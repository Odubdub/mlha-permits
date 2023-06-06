import { LoadingButton } from '@mui/lab';
import { Stack, Typography, IconButton, Box, Paper, List } from '@mui/material';
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { storageHost } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import Iconify from 'src/components/Iconify';
import { isBlank } from 'src/helperFuntions';
import { getRow } from 'src/validate';
import DynamicField from './Issuance.js/DynamicField';

const ActionInput = ({ metadata, onClose, actionData = {}, onCompleteAction }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(AuthContext);
  const { largeModal, title, fields } = metadata || {
    title: 'Confirm this Action',
    type: 'verify',
    largeModal: false,
    fields: [
      {
        fieldName: 'verify',
        fieldLabel: 'Are you sure you want to proceed?',
        fieldType: 'Dropdown',
        field: 3,
        fieldDescription: '',
        options: ['Yes'],
        mandatory: true
      }
    ]
  };

  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [files, setFiles] = useState({});

  const validate = () => {
    const errors = {};
    fields.forEach((field) => {
      if (field.mandatory && isBlank(data[field.fieldName])) {
        errors[field.fieldName] = true;
      }
    });
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setIsLoading(true);

    if (data.verify == 'Yes' && Object.keys(data).length == 1) {
      onCompleteAction();
      close();
      console.log('done');
      return;
    }

    const refs = await uploadFiles();
    // console.log(refs);

    const actionDetails = { ...data, ...refs };
    let sanitized = {};

    const allFieldKeys = fields.map((field) => field.fieldName);
    Object.keys(actionDetails).forEach((key) => {
      if (allFieldKeys.includes(key) && key != 'verify') {
        sanitized[key] = actionDetails[key];
      }
    });

    if (Object.keys(actionDetails).length == 0) {
      sanitized = null;
    }

    onCompleteAction(sanitized, () => {
      setIsLoading(false);
      onClose();
    });
  };

  const getFileType = (mime) => {
    if (mime.includes('image')) {
      return 'image';
    } else if (mime.includes('video')) {
      return 'video';
    } else if (mime.includes('audio')) {
      return 'audio';
    } else if (mime.includes('pdf')) {
      return 'pdf';
    } else if (mime.includes('text')) {
      return 'text';
    } else if (mime.includes('zip')) {
      return 'zip';
    } else if (mime.includes('msword')) {
      return 'word';
    } else if (mime.includes('excel')) {
      return 'excel';
    } else if (mime.includes('powerpoint')) {
      return 'powerpoint';
    } else if (mime.includes('spreadsheetml')) {
      return 'excel';
    } else if (mime.includes('presentationml')) {
      return 'powerpoint';
    } else if (mime.includes('wordprocessingml')) {
      return 'word';
    } else {
      return 'unknown';
    }
  };

  const uploadFiles = async () => {
    // setIsLoading(true);

    const forms = [];
    Object.keys(files).forEach((key) => {
      const file = files[key];
      const form = new FormData();
      form.append('file', file);
      form.append('type', getFileType(file.type));
      form.append('name', file.name);
      form.append('description', file.name);
      form.append('key', key);
      forms.push(form);
    });

    //loop through all the forms and upload them to the server
    const references = {};
    for (let i = 0; i < forms.length; i++) {
      try {
        const config = {
          method: 'post',
          url: `${storageHost}upload/MTCD001`,
          headers: { 'content-type': 'multipart/form-data' },
          data: forms[i]
        };

        const response = await axios(config);
        const fieldName = forms[i].get('key');
        references[fieldName] = {
          size: files[fieldName].size,
          name: files[fieldName].name,
          type: getFileType(files[fieldName].type),
          lastModified: files[fieldName].lastModified,
          ...((response || {}).data || {})
        };
      } catch (error) {
        console.log(error.message);
      }
    }

    return references;
  };

  const close = () => {
    onClose();
  };

  useEffect(() => {
    if (Object.keys(actionData).length == 0) return;

    const sanitizedData = {};

    // Remove file refs from actionData
    Object.keys(actionData).forEach((key) => {
      if (!key.includes('Att')) {
        sanitizedData[key] = actionData[key];
      }
    });

    setData(sanitizedData);
  }, []);

  console.log(data);

  return (
    <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
      <Stack
        sx={{
          bgcolor: '#fff',
          borderRadius: 2,
          width: largeModal ? '50vw' : '500px',
          px: 2,
          py: 2
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={close} disabled={isLoading}>
            <Iconify icon="ep:close" />
          </IconButton>
        </Stack>
        <Paper style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <List>
            {fields.map((field, index) => (
              <DynamicField
                field={field}
                fieldData={data}
                errors={errors}
                setFieldData={setData}
                setFiles={setFiles}
                files={files}
                isDisabled={isLoading}
                key={index}
              />
            ))}
            {userData && (
              <Stack
                pl={2}
                pb={1}
                mt={2}
                border="dotted 1px #32c5ff"
                borderRadius={2}
                bgcolor="info.lighter"
              >
                <Typography variant="subtitle" sx={{ my: 1, fontWeight: 'bold' }}>
                  Completed By
                </Typography>
                {getRow({
                  title: `Names`,
                  size: 'small',
                  bold: true,
                  pb: 0,
                  desc: `${userData.foreNames} ${userData.lastName}` || 'N/A'
                })}
                {getRow({
                  title: `Email`,
                  size: 'small',
                  pb: 0,
                  bold: true,
                  desc: userData.email || 'N/A'
                })}
                {getRow({
                  title: `Designation`,
                  size: 'small',
                  pb: 0,
                  bold: true,
                  desc: userData.designation || 'N/A'
                })}
                <Box />
                {getRow({
                  title: `1Gov ID`,
                  size: 'small',
                  bold: true,
                  desc: userData.idNumber || 'N/A'
                })}
              </Stack>
            )}
          </List>
        </Paper>
        <Stack direction="row" width="100%" mt={2} justifyContent="end">
          <LoadingButton
            loading={isLoading}
            loadingPosition="end"
            variant="contained"
            onClick={submit}
            endIcon={<Iconify icon="charm:arrow-right" />}
          >
            Complete Action
          </LoadingButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ActionInput;
