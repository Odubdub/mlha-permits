import { LoadingButton } from '@mui/lab';
import { Modal, Stack, IconButton, Paper, List, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { post } from './ApiService';
import { AuthContext } from './AuthContext';
import Iconify from './bundle/Iconify';
import { RequestContext } from './RequestContext';
import { isBlank } from './FieldForm';
import Section from './bundle/Section';

export const ConfirmApproveModal = ({ open, action = '', setData, data, onClose }) => {
  const [openSection, setOpenSection] = useState(0);
  const { userData, setUserData } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const { currentRequest } = useContext(RequestContext);

  const validate = () => {
    const errs = {};

    sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.mandatory && isBlank(data[field.fieldName])) {
          errs[field.fieldName] = true;
        }
      });
    });

    setValidated(true);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onFieldBlur = () => {
    validate();
  };

  const onFieldFocus = (i) => {
    validate();
  };

  const actions = {
    approve: [
      {
        title: 'Approve Action Confirmation',
        subtitle: 'Add any comments if required.',
        fields: [
          {
            fieldName: 'confirmAction',
            defaultValue: '',
            fieldLabel: 'Confirm Action',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'Dropdown',
            size: 12,
            options: ['Approve'],
            mandatory: false
          },
          {
            fieldName: 'actionComments',
            defaultValue: '',
            fieldLabel: 'Comments',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'LongText',
            size: 12,
            options: [],
            mandatory: false
          }
        ]
      }
    ],

    reject: [
      {
        title: 'Action Confirmation',
        subtitle: 'Confirm rejection of this M&D Tools',
        fields: [
          {
            fieldName: 'confirmAction',
            defaultValue: '',
            fieldLabel: 'Confirm Action',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'Dropdown',
            size: 12,
            options: ['Reject'],
            mandatory: true
          },
          {
            fieldName: 'actionReason',
            defaultValue: '',
            fieldLabel: 'Reason',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'ShortText',
            size: 12,
            options: [],
            mandatory: true
          },
          {
            fieldName: 'actionComments',
            defaultValue: '',
            fieldLabel: 'Comments',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'LongText',
            size: 12,
            options: [],
            mandatory: false
          }
        ]
      }
    ],

    defer: [
      {
        title: 'Defer Action Confirmation',
        subtitle: 'Add any comments if required.',
        fields: [
          {
            fieldName: 'deferTo',
            defaultValue: '',
            fieldLabel: 'Defer to',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'Dropdown',
            size: 12,
            options: [
              '1GOV-DEV',
              '1GOV-IT-L1',
              '1GOV-IT-L2',
              '1GOV-IT-L3',
              '1GOV-DEPT-L2',
              '1GOV-MINISTRY-AGENCY-L2',
              '1GOV-MINISTRY-AGENCY-L3'
            ],
            mandatory: true
          },
          {
            fieldName: 'actionReason',
            defaultValue: '',
            fieldLabel: 'Reason',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'ShortText',
            size: 12,
            options: [],
            mandatory: true
          },
          {
            fieldName: 'actionComments',
            defaultValue: '',
            fieldLabel: 'Comments',
            enabled: false,
            placeholder: '',
            fieldDescription: '',
            fieldType: 'LongText',
            size: 12,
            options: [],
            mandatory: false
          }
        ]
      }
    ]
  };

  const confirmApproval = () => {
    if (validate()) {
      setIsLoading(true);
      post(`requests/approve/${currentRequest._id}`, {
        ...data,
        idNumber: userData.preferred_username,
        username: userData.name || `${userData.given_name} ${userData.family_name}`,
        roles: userData.realm_access.roles
      })
        .then(() => {
          onClose();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  };

  const sections = actions[action] || [];

  return (
    <Modal open={open}>
      <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
        <Stack sx={{ width: 500, borderRadius: 2, px: 2, pt: 1 }} bgcolor="#fff">
          <Stack direction="row" justifyContent="space-between" alignItems="center" pb={1}>
            <Typography variant="h6" children={'Confirm Action'} mb={0} gutterBottom />
            <IconButton onClick={onClose}>
              <Iconify icon="clarity:close-line" />
            </IconButton>
          </Stack>
          <Paper style={{ bgcolor: 'transparent' }}>
            <List mb={4}>
              {sections.map((section, i) => (
                <Section
                  index={i}
                  key={i}
                  isLast={i == sections.length - 1}
                  title={section.title}
                  subtitle={section.subtitle}
                  viewAll={true}
                  open={true}
                  validated={validated}
                  onOpen={() => setOpenSection(i)}
                  isActiveSection={i == openSection}
                  onNext={() => setOpenSection(i + 1)}
                  fields={section.fields}
                  readOnly={false}
                  onFieldBlur={() => onFieldBlur()}
                  onFieldFocus={() => onFieldFocus(i)}
                  errors={errors}
                  setData={setData}
                  data={data}
                />
              ))}
            </List>
          </Paper>
          <LoadingButton
            children="Complete Confirmation"
            loading={isLoading}
            onClick={() => confirmApproval()}
            loadingPosition="end"
            variant="contained"
            sx={{ alignSelf: 'flex-end', mt: 2, mb: 2, mr: 0 }}
            endIcon={<Iconify icon="ic:round-send" />}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};
