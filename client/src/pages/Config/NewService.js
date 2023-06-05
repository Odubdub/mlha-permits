import { LoadingButton } from '@mui/lab';
import {
  Stack,
  Typography,
  IconButton,
  Paper,
  List,
  Modal,
  Button,
  MenuItem,
  Menu,
  Divider,
  Chip
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { isBlank } from 'src/helperFuntions';
import DynamicField from '../RegDetails/Issuance.js/DynamicField';
import { replaceAllUnderscores, replaceHyphens } from './format';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import axios from 'axios';
import { generateRendererConfig } from './registry/output';
import { getRendererConfig } from './render';
import { getIssuanceConfig } from './issuance';
import { getFromServer, postToServer, serviceRegistryHost } from 'src/ApiService';
import { Box } from '@mui/system';
import { NewServiceForm } from './NewServiceForm';

const NewService = ({ setShowNewServices, newServices, open, refresh }) => {
  const fields = [
    {
      fieldName: 'serviceConfig',
      fieldLabel: 'Select Configuration',
      fieldType: 'Attachment',
      description: '',
      accept: 'application/json',
      tooltip: '',
      options: '',
      endpoint: '',
      mandatory: false
    }
  ];

  const supeFields = [
    {
      fieldName: 'email',
      defaultValue: '',
      fieldLabel: 'Super Admin Email',
      placeholder: 'modirisi@gov.bw',
      enabled: false,
      fieldType: 'ShortText',
      fieldDescription: '',
      options: [],
      mandatory: true
    },
    {
      fieldName: 'idNumber',
      defaultValue: '',
      fieldLabel: 'Super Admin ID Number',
      enabled: false,
      placeholder: '999928888',
      fieldType: 'ShortText',
      fieldDescription: '',
      options: [],
      mandatory: true
    }
  ];

  const [departments, setDepartments] = useState([]);
  const [configData, setConfigData] = useState({});
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const serviceRef = useRef(null);
  let isNewDepartment = false;

  const [responseError, setResponseError] = useState(null);

  const getOwner = (code) => {
    const sections = code.split('_');
    const ministry = sections[0] + '_' + sections[1];
    const department = sections[0] + '_' + sections[1] + '_' + sections[2];
    return { ministry, department };
  };

  let renderedFields = [];
  if (selectedServiceData != null) {
    const owner = getOwner(selectedServiceData.serviceCode);
    renderedFields = [...(departments.includes(owner.department) ? [] : supeFields), ...fields];

    if (!departments.includes(selectedServiceData.department)) {
      isNewDepartment = true;
    }
  }

  const validateAll = () => {
    const errs = {};
    renderedFields.forEach((field) => {
      const value = data[field.fieldName];

      if (field.mandatory && isBlank(value)) {
        errs[field.fieldName] = true;
      } else if (field.fieldName == 'email') {
        if (!validateEmail(value)) {
          errs[field.fieldName] = true;
        }
      } else if (field.fieldName == 'idNumber') {
        if (!(value.length == 9 && (value[4] == 1 || value[4] == 2))) {
          errs[field.fieldName] = true;
        }
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validate = (e) => {
    const { value, name } = e.target;

    const err = {};
    if (name == 'email') {
      if (!validateEmail(value)) {
        err[name] = true;
      }
    } else if (name == 'idNumber') {
      if (!(value.length == 9 && (value[4] == 1 || value[4] == 2))) {
        err[name] = true;
      }
    }

    setErrors(err);
    if (name == 'serviceConfig' && value) {
      readFile();
    }
    return Object.keys(errors).length === 0;
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const readFile = () => {
    const fileReader = new FileReader();
    fileReader.readAsText(getFileForKey('serviceConfig'), 'UTF-8');
    fileReader.onload = (e) => {
      const result = JSON.parse(e.target.result);
      checkErrors(result);
      const owner = getOwner(result.serviceCode);
      const rendererConfig =
        getRendererConfig(service.serviceCode, service.version) ||
        generateRendererConfig(result, capitalizeFirstLetter(replaceAllUnderscores(service.name)));
      const issuanceConfig =
        getIssuanceConfig(service.serviceCode, service.version) || generateIssuanceConfig(result);
      setConfigData({
        ...(result.formField.length == 0 && { form: 'No Form' }),
        registryId: result._id,
        registryRef: result._id,
        profile: result.profileData,
        departmentName: result.department,
        departmentCode: owner.department,
        ministryCode: owner.ministry,
        ministry: result.ministries_agencies,
        ...getSuperAdmin(),
        code: result.serviceCode,
        type: service.name.toLowerCase(),
        shortName: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
        version: result.version,
        form: result.formField,
        issuanceFee: result.issuanceFee,
        applicationFee: result.payment.paymentAmount,
        issuanceFeeService: rendererConfig.issuanceFeeService || '',
        issuanceFeeType: result.issuanceFeeType || 'Auto',
        renderer: rendererConfig,
        issuance: issuanceConfig,
        reviewProcessSteps: [
          {
            actorType: 'user',
            type: 'verify-application-details',
            feedback: {
              positive: 'Application details verified',
              negative: 'Application details not verified'
            }
          },
          {
            actorType: 'user',
            type: 'verify-application-attachments',
            feedback: {
              positive: 'Application attachments verified',
              negative: 'Application attachments not verified'
            }
          },
          {
            actorType: 'user',
            type: 'approve-application',
            feedback: {
              positive: 'Application recommended for issuance',
              negative: 'Application not recommended for issuance'
            }
          }
        ],
        registry: result
      });
    };
  };

  const checkErrors = (result) => {
    let message = '';
    if (!result.department) {
      message += 'Service Department is missing\n';
    }

    if (!result.ministry) {
      message += 'Ministry is missing\n';
    }

    if (!result.code) {
      message += 'Service code is missing\n';
    }

    if (!result.version) {
      message += 'Version is missing\n';
    }

    if (!result.issuanceFee) {
      message += 'Issuance fee is missing\n';
    }

    if (!result.applicationFee) {
      message += 'Application fee is missing\n';
    }

    if (!result.registry) {
      message += 'Erro in Registry configuration\n';
    }

    if (!result.renderer) {
      message += 'Error in Renderer configuration\n';
    }

    if (result.issuance) {
      message += 'Error in Issuance configuration\n';
    }

    if (!result.reviewProcessSteps) {
      message += 'Error in Review process steps\n';
    }

    if (message.length > 0) {
      setErrors({ serviceConfig: message });
    } else {
      setErrors({});
    }
  };

  const getFileForKey = (key) => {
    var element = document.getElementById(key).getElementsByTagName('input')[0];
    return element.files[0];
  };

  //function that capitalizes the first letter of each word
  function capitalizeFirstLetter(string) {
    const str = string.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const downloadFile = () => {
    // create file in browser
    const fileName = `${configData.shortName}-config.json`;
    const json = JSON.stringify(configData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    // create "a" HTML element with href to file
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const editor = document.getElementsByClassName('jsoneditor')[0];
  if (editor) {
    editor.style.borderRadius = '10px';
    editor.style.borderColor = '#FFFFFF';
    editor.style.overflow = 'hidden';
  }

  const menu = document.getElementsByClassName('jsoneditor-menu')[0];
  if (menu) {
    menu.style.backgroundColor = '#32C5FF';
  }

  const search = document.getElementsByClassName('jsoneditor-search')[0];
  if (search) {
    search.style.display = 'none';
  }

  const getType = (service) => {
    const str = service.description.toLowerCase();
    if (str.includes('certificate')) {
      return 'Certificate';
    } else if (str.includes('license')) {
      return 'License';
    } else if (str.includes('report')) {
      return 'Report';
    } else if (str.includes('registration')) {
      return 'Registration';
    } else if (str.includes('job card')) {
      return 'Job Card';
    }

    return 'permit';
  };

  const getInitials = (service) => {
    const source = service.name.includes('-')
      ? replaceHyphens(service.name)
      : replaceAllUnderscores(service.name);
    const serviceName = capitalizeFirstLetter(source);
    const nameArray = serviceName.split(' ');
    const initials = nameArray[0].charAt(0) + nameArray[1].charAt(0);
    return initials.toUpperCase();
  };

  const generateIssuanceConfig = (service) => {
    return {
      code: service.serviceCode,
      name: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
      type: getType(service),
      mode: 'default',
      certificateType: 'generic',
      hasValidity: true,
      hasValidUntil: true,
      validity: 14,
      period: 'Days',
      department: service.department,
      title: getShortApplicationName(capitalizeFirstLetter(replaceAllUnderscores(service.name))),
      suffix: getInitials(service),
      conditions: true,
      generate: [
        {
          fieldName: 'conditionsTitle',
          defaultValue: '',
          fieldLabel: 'Conditions title',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        },
        {
          fieldName: 'conditions',
          defaultValue: '',
          fieldLabel: 'Conditions',
          enabled: false,
          fieldType: 'LongText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }
      ],
      issue: [
        {
          fieldName: 'notificationMessage',
          defaultValue: `Your ${capitalizeFirstLetter(
            replaceAllUnderscores(service.name)
          )} has been issued. Please print this page and present it to the relevant authorities.`,
          fieldLabel: 'Notification Message',
          fieldType: 'LongText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }
      ]
    };
  };

  const postServiceConfigs = () => {
    setResponseError(null);
    if (validateAll()) {
      setIsLoading(true);
      postToServer({
        path: 'authority/services-config/',
        params: {
          ...configData,
          ...getSuperAdmin()
        },
        onComplete: (data) => {
          if (!departments.includes(configData.department)) {
            setDepartments([...departments, configData.departmentCode]);
          }
          refresh();
          setIsLoading(false);
        },
        onError: (err) => {
          console.log('The error is: ', err);
          setResponseError(err.response.data.message);
          setIsLoading(false);
        }
      });
    }
  };

  const getSuperAdmin = () => {
    return renderedFields.find((f) => f.fieldName == 'idNumber')
      ? { superAdminEmail: data.email, superAdminIdNo: data.idNumber }
      : {};
  };

  const getRemoteRegistration = (service) => {
    axios
      .get(serviceRegistryHost + `services/single-with-code/${service.serviceCode}`)
      .then((res) => {
        if (res.data.length > 0) {
          const result = res.data[0];
          const department = getOwner(result.serviceCode);
          const name = getShortApplicationName(
            capitalizeFirstLetter(replaceAllUnderscores(service.name))
          );
          const rendererConfig = getRendererConfig(
            service.serviceCode,
            service.version,
            result,
            name
          );
          const reviewSteps = rendererConfig.reviewProcessSteps || [
            {
              actorType: 'user',
              type: 'verify-application-details',
              feedback: {
                positive: 'Application details verified',
                negative: 'Application details not verified'
              }
            },
            {
              actorType: 'user',
              type: 'verify-application-attachments',
              feedback: {
                positive: 'Application attachments verified',
                negative: 'Application attachments not verified'
              }
            },
            {
              actorType: 'user',
              type: 'approve-application',
              feedback: {
                positive: 'Application recommended for issuance',
                negative: 'Application not recommended for issuance'
              }
            }
          ];

          rendererConfig.reviewProcessSteps = undefined;

          setSelectedServiceData(res.data[0]);
          setConfigData({
            ...(result.formField.length == 0 && { form: 'No Form' }),
            registryId: result._id,
            registryRef: result._id,
            departmentName: result.department,
            departmentCode: department.department,
            ministry: result.ministries_agencies,
            form: result.formField,
            ministryCode: department.ministry,
            ...getSuperAdmin(),
            code: result.serviceCode,
            shortName: getShortApplicationName(
              capitalizeFirstLetter(replaceAllUnderscores(service.name))
            ),
            type: service.name.toLowerCase(),
            serviceName: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
            version: result.version,
            issuanceFee: rendererConfig.issuanceFee ? Number(rendererConfig.issuanceFee) : 0,
            issuanceFeeType: result.issuanceFeeType || 'Auto',
            applicationFee:
              result.payment.paymentAmount.toLowerCase() == 'pay-nothing'
                ? 0
                : Number(result.payment.paymentAmount),
            issuanceFeeService: rendererConfig.issuanceFeeService || 'NONE',
            registry: result,
            renderer:
              rendererConfig ||
              generateRendererConfig(
                result,
                capitalizeFirstLetter(replaceAllUnderscores(service.name))
              ),
            issuance:
              getIssuanceConfig(service.serviceCode, service.version) ||
              generateIssuanceConfig(result),
            reviewProcessSteps: reviewSteps
          });

          setShowEditor(false);
          setTimeout(() => {
            setShowEditor(true);
          }, 100);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (newServices.length > 0) {
      setSelectedService(newServices[0]);
      selectService(newServices[0]);
    } else {
      // setSelectedService(null)
      // setConfigData({})
      // setShowNewServices(false)
    }
  }, [newServices]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShowEditor(true);
      }, 2000);
    } else {
      setShowEditor(false);
    }
  }, [open]);

  useEffect(() => {
    if (Object.keys(configData).length != 0) {
      setTimeout(() => {
        setShowEditor(true);
      }, 100);
    }
  }, [configData]);

  useEffect(() => {
    getFromServer({
      path: 'authority/departments',
      onComplete: (data) => {
        setDepartments(data.map((d) => d.code));
      },
      onError: (err) => {
        console.log('The error is: ', err);
      }
    });
  }, []);

  const getShortApplicationName = (name) => {
    //Check if string has suffix "application"
    let shortName = name;
    const suffixes = [
      'permit',
      'certificate',
      'license',
      'report',
      'job card',
      'registration',
      'register'
    ];
    suffixes.forEach((suffix) => {
      if (shortName.includes(suffix)) {
        shortName = shortName.replace(suffix, '');
      }
    });

    if (shortName.toLowerCase().includes('rebate')) {
      //replace third " " with "."
      const words = shortName.split(' ');
      shortName = words[0] + ' ' + words[1] + ' ' + words[2] + '.' + words[3];
    }

    return shortName.trim();
  };

  const selectService = (service) => {
    setShowEditor(false);
    setSelectedService(service);
    setServiceMenuOpen(false);
    getRemoteRegistration(service);
  };

  return (
    <Modal open={open}>
      <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
        <Stack sx={{ bgcolor: '#fff', borderRadius: 2, width: '800px', px: 2, py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {`Unconfigured Service${newServices.length > 1 ? 's' : ''}`}
            </Typography>
            <Stack direction="row">
              {selectedService != null && (
                <>
                  <Button
                    color="primary"
                    ref={serviceRef}
                    sx={{ color: 'primary' }}
                    onClick={() => setServiceMenuOpen(true)}
                    endIcon={<Iconify sx={{ p: 0.5 }} icon="bxs:down-arrow" />}
                  >
                    {capitalizeFirstLetter(replaceAllUnderscores(selectedService.name))}
                  </Button>
                  <Menu
                    open={serviceMenuOpen}
                    anchorEl={serviceRef.current}
                    onClose={() => setServiceMenuOpen(false)}
                    PaperProps={{
                      sx: { maxWidth: '100%', px: 1.6 }
                    }}
                    sx={{ pb: 0 }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {newServices.map((service, index) => (
                      <MenuItem
                        sx={{
                          fontWeight:
                            selectedService.serviceCode == service.serviceCode ? '700' : '300',
                          color:
                            selectedService.serviceCode == service.serviceCode ? '#32C5FF' : '#000'
                        }}
                        key={index}
                        onClick={() => selectService(service)}
                      >
                        {capitalizeFirstLetter(replaceAllUnderscores(service.name))}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
              <IconButton onClick={() => setShowNewServices(false)} disabled={isLoading}>
                <Iconify icon="ep:close" />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
          <Box>
            <Paper style={{ maxHeight: '60vh', overflow: 'auto' }}>
              <List>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  {renderedFields.map((field, index) => (
                    <Box mx={1} flex={1} key={index}>
                      <DynamicField
                        field={field}
                        fieldData={data}
                        errors={errors}
                        onChange={validate}
                        setFieldData={setData}
                        isDisabled={isLoading}
                        key={index}
                      />
                    </Box>
                  ))}
                </Stack>
                <NewServiceForm data={configData} setData={setConfigData} />
                {selectedService != null && (
                  <Stack sx={{ opacity: showEditor ? 1 : 0, mt: 2, mx: 1, minHeight: 400 }}>
                    <Editor key={showEditor} value={configData} onChange={setConfigData} />
                  </Stack>
                )}
              </List>
            </Paper>
          </Box>
          <Divider />
          {responseError && (
            <Stack direction="row" width="100%" mt={2} justifyContent="end">
              <Chip label={responseError} sx={{ bgcolor: 'red', color: '#fff' }} />
            </Stack>
          )}
          <Stack direction="row" width="100%" mt={2} justifyContent="end">
            <LoadingButton
              disabled={
                !Object.keys(configData).length > 0 || selectedServiceData.formField.length == 0
              }
              sx={{ mr: 2 }}
              loadingPosition="end"
              variant="contained"
              onClick={downloadFile}
              endIcon={<Iconify icon="charm:download" />}
            >
              Download Configuration
            </LoadingButton>
            <LoadingButton
              loading={isLoading}
              disabled={
                !Object.keys(configData).length > 0 || selectedServiceData.formField.length == 0
              }
              loadingPosition="end"
              variant="contained"
              onClick={postServiceConfigs}
              endIcon={<Iconify icon="charm:arrow-right" />}
            >
              Upload Configuration
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default NewService;
