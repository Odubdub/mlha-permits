import { LoadingButton } from '@mui/lab';
import { Stack, Typography, IconButton, Box, Paper, List, Modal } from '@mui/material';
import axios from 'axios';
import React, { useState, useContext, useEffect } from 'react';
import { postToServer, storageHost, uploadFile } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import Iconify from 'src/components/Iconify';
import { isBlank } from 'src/helperFuntions';
import { getRow } from 'src/validate';
import DynamicField from './Issuance.js/DynamicField';

const ReturnActionModal = ({ onClose, action = {}, onReload, id }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useContext(AuthContext);
  const { title, fields } = {
    title: 'Return to Officer',
    type: 'return',
    fields: [
      {
        fieldName: 'returnMessage',
        fieldLabel: 'Reason for returning',
        fieldType: 'LongText',
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
    if (validate()) {
      setIsLoading(true);
      const params = { ...data, actionType: action.type };
      postToServer({
        path: `applications/${id}/undo-review-status`,
        params,
        onComplete: () => {
          setTimeout(() => {
            setIsLoading(false);
            onClose();
          }, [3000]);
          onReload();
        },
        onError: (err) => {
          onReload();
          setIsLoading(false);
        }
      });
    }
  };

  const close = () => {
    onClose();
  };

  return (
    <Modal open={true}>
      <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
        <Stack
          sx={{
            bgcolor: '#fff',
            borderRadius: 2,
            width: 500,
            px: 2,
            py: 2
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              <Iconify icon="icomoon-free:undo2" sx={{ mr: 1 }} />

              {title}
            </Typography>
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
              <Stack
                pl={2}
                pb={1}
                mt={2}
                border="dashed 1px red"
                borderRadius={2}
                bgcolor="#ff000010"
              >
                <Typography variant="subtitle" sx={{ my: 1, fontWeight: 'bold' }}>
                  Target
                </Typography>
                {getRow({
                  title: `Action Type`,
                  size: 'small',
                  bold: true,
                  pb: 0,
                  desc: action.name || 'N/A'
                })}
                {getRow({
                  title: `Officer`,
                  size: 'small',
                  bold: true,
                  pb: 0,
                  desc: action.actor.name || 'N/A'
                })}
                {getRow({
                  title: `1Gov ID`,
                  size: 'small',
                  bold: true,
                  desc: action.actor.idNumber || 'N/A'
                })}
              </Stack>
              {userData && (
                <Stack
                  pl={2}
                  pb={1}
                  mt={1}
                  border="dotted 1px #32c5ff"
                  borderRadius={2}
                  bgcolor="info.lighter"
                >
                  <Typography variant="subtitle" sx={{ my: 1, fontWeight: 'bold' }}>
                    Returned By
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
    </Modal>
  );
};

export default ReturnActionModal;
