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
  Divider
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { isBlank } from 'src/helperFuntions';
import DynamicField from '../RegDetails/Issuance.js/DynamicField';
import { replaceAllUnderscores } from './format';
import { JsonEditor as Editor } from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';
import axios from 'axios';
import { generateConfigOutputs, generateOutputs, generateRendererConfig } from './registry/output';
import { getRendererConfig } from './render';
import { getIssuanceConfig } from './issuance';
import { getFromServer, patch, postToServer, serviceRegistryHost } from 'src/ApiService';
import { Box } from '@mui/system';
import { fShortDate } from 'src/utils/formatTime';
import { testSubmit } from './ServiceTests';
import { AllServiceConfigs } from './registry/registry';

const DebugService = ({ setShowNewServices, selectedService, onClose, open }) => {
  const payloadType = {
    apiRenderer: 'Api Renderer',
    localRenderer: 'Local Renderer',
    generateRenderer: 'Generate Renderer',
    issuance: 'Issuance Metadata',
    reviewProcess: 'Review Process',
    registry: 'Registry Metadata',
    form: 'Application Form',
    localForm: 'Local Form',
    full: 'Full Service Metadata',

    initial: 'CRM - Initial Submission',
    corrections: 'CRM - Form Corrections',
    payment: 'CRM - Push Payment',

    invalidSubmission: 'Invalid Initial Submission',
    invalidCorrections: 'Invalid Form Corrections',
    invalidPayment: 'Invalid Push Payment',
    resubmission: 'Gateway Resubmission'
  };

  const [selectedPayloadType, setSelectedPayloadType] = useState(null);

  const applicationPayloads = [
    payloadType.payment,
    payloadType.corrections,
    payloadType.invalidCorrections,
    payloadType.invalidPayment
  ];

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplications] = useState(null);
  const [applicaitonMenuOpen, setApplicationMenuOpen] = useState(false);

  const [configData, setConfigData] = useState({});
  const [selectedServiceData, setSelectedServiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [payloadTypeMenuOpen, setPayloadTypesMenuOpen] = useState(false);
  const payloadRef = useRef(null);
  const applicationRef = useRef(null);
  let isNewDepartment = false;

  let renderedFields = [
    {
      fieldName: 'serviceConfig',
      fieldLabel: 'Select JSON File',
      fieldType: 'Attachment',
      description: '',
      accept: 'application/json',
      tooltip: '',
      options: '',
      endpoint: '',
      mandatory: false
    }
  ];

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

      // Handle manual config data
      console.log('Handle manual config data!!! - ', e.target.result);
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

  const getOwner = (code) => {
    const sections = code.split('_');
    const ministry = sections[0] + '_' + sections[1];
    const department = sections[0] + '_' + sections[1] + '_' + sections[2];
    return { ministry, department };
  };

  const downloadFile = () => {
    // create file in browser
    const fileName = `${selectedServiceData.shortName}-${selectedPayloadType}-config.json`;
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
    const serviceName = capitalizeFirstLetter(replaceAllUnderscores(service.name));
    const nameArray = serviceName.split(' ');
    const initials = nameArray[0].charAt(0) + nameArray[1].charAt(0);
    return initials;
  };

  const generateIssuanceConfig = (service) => {
    return {
      code: service.serviceCode,
      name: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
      type: getType(service),
      mode: 'default',
      hasValidity: true,
      hasValidUntil: true,
      validity: 14,
      period: 'Days',
      department: service.department,
      title: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
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
    if (selectedPayloadType == payloadType.issuance) {
      updateIssuance();
    } else if (
      [payloadType.localRenderer, payloadType.generateRenderer, payloadType.apiRenderer].includes(
        selectedPayloadType
      )
    ) {
      updateRenderer();
    } else if (selectedPayloadType == payloadType.full) {
      updateRootConfig();
    } else if (selectedPayloadType == payloadType.registry) {
      // setConfigData(selectedServiceData.registry)
    } else if (selectedPayloadType == payloadType.initial) {
      testSubmit(configData, selectedServiceData.code);
    } else if ([payloadType.form, payloadType.localForm].includes(selectedPayloadType)) {
      updateApiForm();
    } else if (selectedPayloadType == payloadType.corrections) {
      testSubmit(configData);
    } else if (selectedPayloadType == payloadType.payment) {
      testSubmit(configData);
    } else if (selectedPayloadType == payloadType.invalidSubmission) {
      testSubmit(configData);
    } else if (selectedPayloadType == payloadType.invalidCorrections) {
      testSubmit(configData);
    } else if (selectedPayloadType == payloadType.invalidPayment) {
      testSubmit(configData);
    } else if (selectedPayloadType == payloadType.resubmission) {
      testSubmit(configData);
    }
  };

  const getSuperAdmin = () => {
    return isNewDepartment ? { superAdminEmail: data.email, superAdminIdNo: data.idNumber } : {};
  };

  const updateRenderer = () => {
    patch({
      path: `authority/services-config/renderer/${selectedServiceData._id}`,
      params: configData,
      onComplete: (data) => {
        console.log(data);
      },
      onError: (err) => {
        'Error updating renderer on CPMS';
      }
    });
  };

  const updateApiForm = () => {
    const fields = configData.map((field) => ({
      ...field,
      dataTableData:
        typeof field.dataTableData == 'string'
          ? field.dataTableData
          : JSON.stringify(field.dataTableData)
    }));

    axios
      .patch(serviceRegistryHost + `services/config/form/${selectedServiceData.registryRef}`, {
        fields: fields,
        profileData: [
          'first_name',
          'middle_name',
          'surname',
          'date_of_birth',
          'gender',
          'country_of_birth',
          'nationality',
          'primary_phone',
          'primary_postal',
          'primary_physical',
          'primary_email',
          'citizenship'
        ]
      })
      .then((res) => {
        console.log(res.data);

        patch({
          path: `authority/services-config/form/${selectedServiceData._id}`,
          params: configData,
          onComplete: (data) => {
            console.log(data);
          },
          onError: (err) => {
            'Error updating renderer on CPMS';
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateIssuance = () => {
    patch({
      path: `authority/services-config/issuance/${selectedServiceData._id}`,
      params: configData,
      onComplete: (data) => {
        console.log(data);
      },
      onError: (err) => {
        'Error updating renderer on CPMS';
      }
    });
  };

  const updateRootConfig = () => {
    patch({
      path: `authority/services-config/root-config/${selectedServiceData._id}`,
      params: configData,
      onComplete: (data) => {
        console.log(data);
      },
      onError: (err) => {
        'Error updating renderer on CPMS';
      }
    });
  };

  const getRemoteRegistration = (service) => {
    axios
      .get(serviceRegistryHost + `services/single-with-code/${service.serviceCode}`)
      .then((res) => {
        if (res.data.length > 0) {
          const result = res.data[0];
          const department = getOwner(result.serviceCode);
          setSelectedServiceData(res.data[0]);
          setConfigData({
            registryId: result._id,
            department: result.department,
            departmentCode: department.department,
            ministry: result.ministries_agencies,
            ministryCode: department.ministry,
            ...getSuperAdmin(),
            code: result.serviceCode,
            shortName: getShortApplicationName(
              capitalizeFirstLetter(replaceAllUnderscores(service.name))
            ),
            serviceName: capitalizeFirstLetter(replaceAllUnderscores(service.name)),
            version: result.version,
            issuanceFee: '0.00',
            issuanceFeeService: '',
            applicationFee: result.payment.paymentAmount,
            registry: result,
            renderer:
              getRendererConfig(service.serviceCode, service.version) ||
              generateRendererConfig(
                result,
                capitalizeFirstLetter(replaceAllUnderscores(service.name))
              ),
            issuance:
              getIssuanceConfig(service.serviceCode, service.version) ||
              generateIssuanceConfig(result),
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
            ]
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

  const generatePayload = (payloadType) => {
    setSelectedPayloadType(payloadType);
    setPayloadTypesMenuOpen(false);
  };

  const setConfigurationData = () => {
    if (selectedPayloadType == payloadType.apiRenderer) {
      setConfigData(selectedServiceData.renderer);
    } else if (selectedPayloadType == payloadType.issuance) {
      setConfigData(selectedServiceData.issuance);
    } else if (selectedPayloadType == payloadType.full) {
      setConfigData(selectedServiceData);
    } else if (selectedPayloadType == payloadType.registry) {
      setConfigData(selectedServiceData.registry);
    } else if (selectedPayloadType == payloadType.initial) {
      setConfigData(generateConfigOutputs(selectedServiceData));
    } else if (selectedPayloadType == payloadType.localForm) {
      //Transform
      const fields =
        (AllServiceConfigs.find((sc) => sc.code == selectedServiceData.code) || {}).fields || [];
      const finalFields = fields.map((field) => {
        let table = {};
        if (field.dataTableData) {
          table =
            typeof field.dataTableData == 'string'
              ? JSON.parse(field.dataTableData)
              : field.dataTableData;
        }

        let finalTable = {};
        // If table is not empty
        if (Object.keys(table).length > 0) {
          finalTable = {
            isLimited: table.isLimited || true,
            description:
              table.description || field.description || 'No description set for this table',
            limit: table.limit || 6,
            inputData: table.inputData
          };
        }

        return {
          fieldName: field.fieldName || 'fieldName',
          fieldLabel: field.fieldLabel || '',
          hint: field.hint || '',
          fieldType: field.fieldType || 'ShortText',
          endpoint_parameter: field.endpoint_parameter || false,
          description: field.description || field.fieldDescription || '',
          tooltip: field.tooltip || field.toolTip || '',
          options: replacePercentWithStars(field.options),
          dataTableData: finalTable,
          endpoint: field.endpoint || '',
          mandatory: field.mandatory || true,
          mimeTypes: field.fieldType == 'Attachment' ? ['pdf'] : []
        };
      });
      setConfigData(finalFields);
    } else if (selectedPayloadType == payloadType.form) {
      setConfigData(selectedServiceData.form);
    } else if (selectedPayloadType == payloadType.generateRenderer) {
      setConfigData(
        generateRendererConfig(selectedServiceData.registry, selectedServiceData.shortName)
      );
    } else if (selectedPayloadType == payloadType.localRenderer) {
      setConfigData(getRendererConfig(selectedServiceData.code, selectedServiceData.version));
    } else if (selectedPayloadType == payloadType.invalidSubmission) {
    } else if (selectedPayloadType == payloadType.invalidCorrections) {
    } else if (selectedPayloadType == payloadType.invalidPayment) {
    } else if (selectedPayloadType == payloadType.resubmission) {
    }
    setShowEditor(!showEditor);
  };

  const replacePercentWithStars = (str) => {
    return str.replace(/%/g, '*');
  };

  const convertGroupToTableConfig = () => {
    let count = 0;
    const changes = {};

    AllServiceConfigs.forEach((sc) => {
      let hasChanges = false;
      console.log(sc.displayName);
      const newFields = [];
      sc.fields.forEach((olfField) => {
        if (olfField.groupName) {
          //   console.log(olfField);
          hasChanges = true;
          count += 1;
          const newOne = {};
          newOne.fieldName = olfField.groupName;
          newOne.fieldType = 'DataTable';
          newOne.fieldLabel = olfField.groupLabel;
          newOne.tooltip = '';
          newOne.hint = '';
          newOne.options = '';
          newOne.endpoint = '';
          newOne.mandatory = olfField.mandatory;
          newOne.mimeTypes = [];
          newOne.endpoint_parameter = false;
          newOne.description = olfField.description || olfField.groupLabel;

          const columns = {};

          olfField.groupFields.forEach((gf, i) => {
            columns[i] = {
              'Column Key': gf.fieldName,
              'Column Name': gf.fieldLabel,
              'Field Type': 'ShortText',
              Options: '',
              Endpoint: ''
            };
          });

          newOne.dataTableData = JSON.stringify({
            isLimited: true,
            limit: 6,
            inputData: columns
          });

          newFields.push(newOne);
        } else {
          newFields.push(olfField);
        }
      });

      if (hasChanges) {
        changes[sc.name] = newFields;
      }

      console.log(changes);
    });

    console.log('count = ', count);
  };

  useEffect(() => {
    if (selectedPayloadType != null) {
      setConfigurationData();
    }
  }, [selectedPayloadType]);

  useEffect(() => {
    getFromServer({
      path: `authority/services-config/${selectedService.serviceCode}/${selectedService.version}`,
      onComplete: (data) => {
        setSelectedServiceData(data);
      },
      onError: (err) => {
        console.log('The error is: ', err);
      }
    });
  }, [open]);

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

  return (
    <Modal open={open}>
      <Stack width="100vw" height="100vh" alignItems="center" justifyContent="center">
        <Stack sx={{ bgcolor: '#fff', borderRadius: 2, width: '800px', px: 2, py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography onClick={convertGroupToTableConfig} variant="h6">
              Configuration & Debugging
            </Typography>
            <Stack direction="row" alignItems={'center'}>
              <Typography variant="h6">
                {getShortApplicationName(
                  capitalizeFirstLetter(replaceAllUnderscores(selectedService.name))
                )}
              </Typography>
              <IconButton onClick={() => onClose()} disabled={isLoading}>
                <Iconify icon="ep:close" />
              </IconButton>
            </Stack>
          </Stack>
          <Divider />
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
          <Paper style={{ maxHeight: '60vh', overflow: 'auto' }}>
            <List>
              {Object.keys(configData) != null && (
                <Stack sx={{ opacity: showEditor ? 1 : 0.99, mt: 2, minHeight: 400 }}>
                  <Editor key={showEditor} value={configData} onChange={setConfigData} />
                </Stack>
              )}
            </List>
          </Paper>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Stack direction="row">
              {selectedServiceData != null && (
                <>
                  <Button
                    color="primary"
                    ref={payloadRef}
                    sx={{ color: 'primary' }}
                    onClick={() => setPayloadTypesMenuOpen(true)}
                    endIcon={<Iconify sx={{ p: 0.5 }} icon="bxs:down-arrow" />}
                  >
                    {selectedPayloadType == null ? 'Select Payload Type' : selectedPayloadType}
                  </Button>
                  <Menu
                    open={payloadTypeMenuOpen}
                    anchorEl={payloadRef.current}
                    onClose={() => setPayloadTypesMenuOpen(false)}
                    PaperProps={{
                      sx: { maxWidth: '100%', px: 1.6 }
                    }}
                    sx={{ pb: 0 }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    {Object.keys(payloadType).map((payloadKey, index) => (
                      <Box key={index}>
                        <>
                          {[
                            payloadType.invalidSubmission,
                            payloadType.apiRenderer,
                            payloadType.initial
                          ].includes(payloadType[payloadKey]) && (
                            <>
                              <Typography variant="caption">
                                {payloadType[payloadKey] == payloadType.apiRenderer
                                  ? 'Service Configurations'
                                  : payloadType[payloadKey] == payloadType.invalidSubmission
                                  ? 'Invalid Payloads'
                                  : '1Gov Platform Payloads'}
                              </Typography>
                              <Divider />
                            </>
                          )}
                        </>
                        <MenuItem
                          sx={{
                            fontWeight:
                              payloadType[payloadKey] == selectedPayloadType ? '700' : '300',
                            color:
                              payloadType[payloadKey] == selectedPayloadType ? '#32C5FF' : '#000'
                          }}
                          key={index}
                          onClick={() => generatePayload(payloadType[payloadKey])}
                        >
                          {payloadType[payloadKey]}
                        </MenuItem>
                      </Box>
                    ))}
                  </Menu>
                </>
              )}
              {applicationPayloads.includes(selectedPayloadType) && (
                <>
                  <Button
                    color="primary"
                    ref={applicationRef}
                    sx={{ color: 'primary' }}
                    onClick={() => setApplicationMenuOpen(true)}
                    endIcon={<Iconify sx={{ p: 0.5 }} icon="bxs:down-arrow" />}
                  >
                    {selectedApplication == null
                      ? 'Select Application'
                      : fShortDate(selectedApplication.createdAt)}
                  </Button>
                  <Menu
                    open={applicaitonMenuOpen}
                    anchorEl={applicationRef.current}
                    onClose={() => setApplicationMenuOpen(false)}
                    PaperProps={{
                      sx: { maxWidth: '100%', px: 1.6 }
                    }}
                    sx={{ pb: 0 }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    {applications.map((application, index) => (
                      <Box key={index}>
                        <MenuItem
                          sx={{
                            fontWeight:
                              payloadType[application] == selectedPayloadType ? '700' : '300',
                            color:
                              payloadType[application] == selectedPayloadType ? '#32C5FF' : '#000'
                          }}
                          key={index}
                          onClick={() => generatePayload(payloadType[application])}
                        >
                          {payloadType[application]}
                        </MenuItem>
                      </Box>
                    ))}
                  </Menu>
                </>
              )}
            </Stack>
            <Stack direction="row" justifyContent="end">
              <LoadingButton
                disabled={!Object.keys(configData).length > 0}
                sx={{ mr: 2 }}
                loadingPosition="end"
                variant="contained"
                onClick={downloadFile}
                endIcon={<Iconify icon="charm:download" />}
              >
                Download
              </LoadingButton>
              <LoadingButton
                loading={isLoading}
                disabled={!Object.keys(configData).length > 0}
                loadingPosition="end"
                variant="contained"
                onClick={postServiceConfigs}
                endIcon={<Iconify icon="charm:arrow-right" />}
              >
                Test
              </LoadingButton>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default DebugService;
