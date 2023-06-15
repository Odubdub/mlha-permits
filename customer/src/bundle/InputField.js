import {
  FormControl,
  Box,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  OutlinedInput,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
  InputAdornment,
  Icon,
  Tooltip,
  Stack,
  CircularProgress,
  IconButton,
  Autocomplete
} from '@mui/material';
import axios from 'axios';
// import { isObject } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { generateDynamicURL } from './Api';
import { FieldTypes } from './constants';
import { deleteKeysFromObject, getDependancyValue, transformDataObject } from './DataTransformer';
import { ShortStringInputFields } from './FieldFormValidator';
import Iconify from './Iconify';
import { isBlank, isEqual, isNotValue, isObject, validateField } from './validator';

function getMimeType(fileExtensions) {
  const mimeTypes = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    json: 'application/JSON'
  };

  const extensions = fileExtensions.map((ext) => ext.toLowerCase());
  const validExtensions = extensions.filter((ext) => Object.keys(mimeTypes).includes(ext));

  if (validExtensions.length === 0) {
    return null;
  }

  const mimeType = mimeTypes[validExtensions[0]];

  return mimeType;
}

export default function InputField({
  field,
  onChange,
  errors = {},
  readOnly,
  fieldData,
  setFieldData,
  autoPopulated,
  setAutoPopulated,
  onValidate,
  onFieldBlur,
  getOverridableDependants,
  tableMode = false,
  outlined = true,
  toolBar,
  inputProps = {},
  onFieldFocus,
  smallSize = false,
  showDescription = true,
  isDisabled = false
}) {
  const fieldKey = field.fieldName || field['Column Key'];
  const fieldType = (tableMode ? field['Field Type'] : field.fieldType) || '';
  const [autofillValue, setAutofillValue] = useState({ loading: false, url: null });
  const [isAutofilled, setIsAutofilled] = useState(false);
  const options = useRef([]);
  const [secure, setSecure] = useState(field.secure || false);

  const valueBeforeEditing = useRef(null);

  const getValueFromDependancies = (property) => {
    return getDependancyValue({
      fieldKey,
      dependancies: field.dependancies,
      property,
      data: fieldData,
      value: getValue()
    });
  };

  const getIsMandatory = () => {
    const isMandatory = getValueFromDependancies('mandatory');

    if (isMandatory !== null) {
      return isMandatory;
    }
    return field.mandatory;
  };

  const getDisabled = () => {
    if (autofillValue.loading || isAutofilled) {
      return true;
    }

    // Disable dropdowns with empty options
    if ([FieldTypes.Dropdown, FieldTypes.DropdownMulti].includes(fieldType)) {
      if (!getOptions().length) {
        return true;
      }
    }

    const disabled = getValueFromDependancies('disabled');

    if (disabled !== null) {
      return disabled;
    }

    if (!isNotValue(field.disabled)) {
      return field.disabled;
    }

    return isDisabled || readOnly;
  };

  const getMimeTypes = () => {
    const mimeTypes = getValueFromDependancies('mimeTypes');
    if (mimeTypes !== null) {
      return mimeTypes;
    }
    return field.mimeTypes || [];
  };

  const getTransformer = () => {
    const transformer = getValueFromDependancies('transformer');

    if (transformer !== null) {
      return transformer;
    }

    return field.transformer;
  };

  const getEndpoint = () => {
    const endpoint = getValueFromDependancies('endpoint');

    if (endpoint !== null) {
      return endpoint;
    }

    return field.endpoint;
  };

  const getDescription = () => {
    const description = getValueFromDependancies('description');
    if (description !== null) {
      return description;
    }
    return field.description;
  };

  const getHint = () => {
    const hint = getValueFromDependancies('hint');
    if (hint !== null) {
      return hint;
    }
    return field.hint;
  };

  const getFieldLabel = () => {
    if (tableMode) {
      return '';
    }
    const label = getValueFromDependancies('fieldLabel');
    if (label !== null) {
      return label;
    }
    return field.fieldLabel;
  };

  const getToolTip = () => {
    const toolTip = getValueFromDependancies('tooltip');
    if (toolTip !== null) {
      return toolTip;
    }
    return field.tooltip;
  };

  const getOptions = () => {
    const fieldOptions = getValueFromDependancies('options') || field.options || field.Options;
    options.current = [];
    if (typeof fieldOptions == 'string') {
      if (fieldOptions.includes('*')) {
        options.current = fieldOptions.split('*');
      } else if (fieldOptions.includes('%')) {
        options.current = fieldOptions.split('%');
      } else {
        options.current = [fieldOptions];
      }
    } else if (Array.isArray(fieldOptions)) {
      options.current = fieldOptions;
    }

    return options.current;
  };

  const getType = () => {
    if (secure) {
      return 'password';
    }
    if ('Attachment' == fieldType) {
      return 'file';
    } else if ('Date' == fieldType) {
      return 'date';
    }
    return 'text';
  };

  const valueForKey = (data, key) => {
    const keys = key.split('.');
    let value = data;
    for (let i = 0; i < keys.length; i++) {
      value = value[keys[i]];
      if ([null, undefined].includes(value)) {
        return null;
      }
    }
    return value;
  };

  const getDropdownValue = (value) => {
    if (isObject(value)) {
      return value.key;
    }
    return value;
  };

  const getDropdownLabel = (key) => {
    const options = getOptions();
    const option = options.find((option) => option.key == key || option == key);

    if (isObject(option)) {
      return option.value || key;
    }

    return key;
  };

  const getValue = () => {
    let value;

    value = valueForKey(fieldData, fieldKey);

    if ([FieldTypes.Date, FieldTypes.Dropdown].includes(fieldType)) {
      if (value != 0) {
        value = value || '';
      }
    } else {
      value = value || (readOnly ? 'N/A' : '');
    }

    if (fieldType == FieldTypes.Date && typeof value == 'string' && value.includes('T00')) {
      value = value.split('T00')[0];
    }

    if (fieldType.toLowerCase().includes('multi')) {
      if (typeof value == 'string') {
        value = [];
      }
    }

    if (fieldType == FieldTypes.SingleCheckBox) {
      if (typeof value == 'string') {
        value = false;
      }
    }

    if (fieldType == FieldTypes.Attachment) {
      if (typeof value == 'string') {
        value = '';
      }

      if (!isBlank(value)) {
        value = 'Form.docx.pdf';
      }
    }

    return value;
  };

  const onInputChange = (e) => {
    if (!fieldKey) return;

    let value = e.target.value;

    // Restrict Input Here
    if (fieldType == FieldTypes.Number) {
      if (!isNumeric(value)) {
        return;
      } else {
        value = parseInt(value);
      }
    } else if (fieldType == FieldTypes.Float) {
      if (!isFloat(value)) {
        return;
      } else {
        value = parseFloat(value);
      }
    }

    //Manipulate time
    if (fieldType == FieldTypes.Date) {
      value = value.split('T00')[0];
    } else if (fieldType == FieldTypes.SingleCheckBox) {
      value = e.target.checked;
    }
    // Nested key support
    const keys = fieldKey.split('.');
    let obj = { ...fieldData };

    let ref = obj;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        ref[keys[i]] = value;
      } else {
        if (!ref[keys[i]]) {
          ref[keys[i]] = {};
        }
        ref = ref[keys[i]];
      }
    }

    const update = { ...obj };

    // console.log(update);
    if (fieldType == FieldTypes.Dropdown) {
      updateDependants({ update, value });
    } else {
      setFieldData(update);
    }

    if (onChange) onChange(e);
  };

  const updateDependants = ({ update, value }) => {
    // If this field is a dependancy to another field then we need to clear the dependant field and clear it if the value has changed
    // Clearing the dependant will only apply to ["options", "endpoint" and "mimeTypes"] targets
    if (!isEqual(valueBeforeEditing.current, value)) {
      // Value has changed so get dependant fields
      const dependantFields = getOverridableDependants(fieldKey);

      // Clear the dependant fields
      dependantFields.forEach((dFieldKey) => {
        if (update[dFieldKey]) {
          delete update[dFieldKey];
        }
      });
      setFieldData(update);

      // Update any changes to the dependant fields for validations
      onValidate(update);
    } else {
      // Value has not changed so maintain the state update
      setFieldData(update);
    }
  };

  const isMulti = () => {
    return fieldType.toLowerCase().includes('multi');
  };

  const hasStartAdornment = () => {
    return [
      'OmangNumber',
      'Email',
      'PhoneNumber',
      'Number',
      'Currency',
      'Time',
      'Hyperlink'
    ].includes(fieldType);
  };

  const getStartAdornment = () => {
    return {
      OmangNumber: 'teenyicons:id-solid',
      Email: 'ic:outline-alternate-email',
      PhoneNumber: 'ic:baseline-phone',
      Number: 'tabler:numbers',
      Currency: 'mdi:currency-usd',
      Time: 'mdi:clock-time-eight-outline',
      Hyperlink: 'mdi:link-variant'
    }[fieldType];
  };

  const hasToolTip = () => {
    return !isBlank(getToolTip());
  };

  const onBlur = () => {
    if (!fieldKey) return;

    const value = getValue();

    if (onFieldBlur) onFieldBlur();

    if (fieldType != FieldTypes.Dropdown) {
      updateDependants({ update: { ...fieldData }, value });
    }

    updateAutofillFields();
  };

  const onStartEdit = () => {
    valueBeforeEditing.current = getValue();

    if (onFieldFocus) {
      onFieldFocus();
    }
  };

  const isNumeric = (str) => {
    return /^\d+$/.test(str);
  };

  const isFloat = (str) => {
    return /^-?\d+(?:\.\d+)?$/.test(str);
  };

  const getSize = () => {
    return smallSize ? 'small' : 'medium';
  };

  const onReturnKey = (e) => {
    if (e.key == 'Enter' && ShortStringInputFields.includes(field.fieldType)) {
      // Enter pressed
      // updateAutofillFields();
      document.activeElement.blur();
    }
  };

  const getHelperText = () => {
    const type = typeof errors[fieldKey];
    if (errors[fieldKey] && type == 'string') {
      return errors[fieldKey];
    } else {
      return (getIsMandatory() ? 'Required. ' : 'Optional. ') + getDescription() || '';
    }
  };

  const getEndAdornemt = () => {
    return {
      endAdornment: field.secure ? (
        <InputAdornment sx={{ ml: 1 }} position="start">
          <Tooltip title="Show Password">
            <IconButton onClick={() => setSecure(!secure)}>
              <Iconify icon="ant-design:eye-filled" />
            </IconButton>
          </Tooltip>
        </InputAdornment>
      ) : hasToolTip() ? (
        <InputAdornment sx={{ ml: 1, transform: 'translate(10px,0px)' }} position="start">
          <Tooltip title={getToolTip()}>
            <Icon>
              <Iconify icon={'basil:info-circle-solid'} />
            </Icon>
          </Tooltip>
        </InputAdornment>
      ) : null
    };
  };

  const updateAutofillFields = () => {
    const isValid = validateField(field, fieldData);
    if (isValid) {
      // Dynamic values, use the endpoint to autofill required data
      const endpoint = getEndpoint();
      if (endpoint) {
        const url = generateDynamicURL(endpoint, fieldData);
        if (url && autofillValue.url != url) {
          const transformer = getTransformer();

          if (transformer && url != autofillValue.url) {
            setAutofillValue({ loading: true, transformer, url, fieldKey });
          }
        }
      }
    }
  };

  const clearAutoFilledFields = () => {
    const update = { ...fieldData };
    const newAutoPopulated = { ...autoPopulated };

    const transformer = JSON.parse(atob(autofillValue.transformer));

    const paths = transformer.map((value) => {
      const conf = Object.values(value)[0];
      if (typeof conf == 'string') {
        return conf;
      } else {
        return conf.path;
      }
    });

    // Clear from global autopopulated fields

    deleteKeysFromObject(paths, update);
    deleteKeysFromObject(paths, newAutoPopulated);

    setAutofillValue({ loading: false, url: null });

    setAutoPopulated(newAutoPopulated);
    setFieldData(update);
    onValidate(update);
  };

  useEffect(() => {
    if (autoPopulated) {
      const value = valueForKey(autoPopulated, fieldKey);
      setIsAutofilled(!isNotValue(value));
    }
  }, [autoPopulated]);

  useEffect(() => {
    if (autofillValue.loading && autofillValue.url) {
      axios
        .get(autofillValue.url)
        .then((res) => {
          const transformer = JSON.parse(atob(autofillValue.transformer));
          // const transformer = testConfig;
          const autofillData = transformDataObject(res.data, transformer);

          if (autofillData) {
            setTimeout(() => {
              setAutofillValue({
                ...autofillValue,
                loading: false,
                loaded: true,
                data: autofillData
              });
              const update = { ...fieldData, ...autofillData };

              setAutoPopulated({ ...autoPopulated, ...autofillData });
              setFieldData(update);
              onValidate(update);
            }, [1000]);
          } else {
            setAutofillValue({ loading: false, url: null });
          }
        })
        .catch((error) => {
          setAutofillValue({ ...autofillValue, loading: false });
        });
    }
  }, [autofillValue]);

  return (
    <Stack mt={1} id={fieldKey} sx={{ position: 'relative' }}>
      <Stack
        sx={{
          alignSelf: 'end',
          zIndex: 2,
          height: '100%',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'end',
          transform: 'translate(0px, -10px)'
        }}
      >
        {toolBar}
      </Stack>
      {(autofillValue.loading || autofillValue.loaded) && fieldKey == autofillValue.fieldKey && (
        <Stack
          sx={{
            alignSelf: 'end',
            zIndex: 2,
            height: '100%',
            width: 24,
            mt: 3.2,
            mr: 1,
            bgcolor: '#fff',
            borderRadius: 2,
            height: 24,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'end',
            transform: 'translate(0px, -10px)'
          }}
        >
          {autofillValue.loading ? (
            <CircularProgress size="small" sx={{ width: 24, height: 24, mr: 1 }} />
          ) : autofillValue.loaded ? (
            <Tooltip title="Clear autofilled fields">
              <IconButton size="small" onClick={clearAutoFilledFields}>
                <Iconify icon="gg:close" />
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </Stack>
      )}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        {fieldType.toLowerCase().includes('dropdown') && !readOnly ? (
          <FormControl fullWidth>
            {((outlined && getOptions().length > -1) ||
              fieldType.toLowerCase().includes('multi')) && (
              <InputLabel
                error={Object.keys(errors).includes(fieldKey)}
                mt={3}
                bgcolor="#fff"
                width={5}
              >
                {getFieldLabel()}
              </InputLabel>
            )}
            {/* {options.current.length > 10 && !fieldType.toLowerCase().includes('multi') ? (
              <Autocomplete
                options={options.current}
                autoHighlight
                
                value={options.current.find((opt) => getValue() == opt.key) || {}}
                getOptionLabel={(option) => option.value || ''}
                onChange={(e, newValue) => {
                  onInputChange({ target: { value: (newValue || {}).key || null } });
                }}
                renderOption={(props, option) => (
                  <Box
                    onClick={() => console.log({ target: { value: option.value } })}
                    component="li"
                    sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                    {...props}
                  >
                    {option.value}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={getFieldLabel()}
                    placeholder={getHint()}
                    error={Object.keys(errors).includes(fieldKey)}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password' // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            ) : (
              <Select
                variant={readOnly || !outlined ? 'standard' : 'outlined'}
                labelId="demo-multiple-checkbox-label"
                value={getValue()}
                size={getSize()}
                disabled={getDisabled()}
                onBlur={onBlur}
                onFocus={onStartEdit}
                name={fieldKey}
                error={Object.keys(errors).includes(fieldKey)}
                multiple={isMulti()}
                renderValue={
                  isMulti()
                    ? (selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {getValue().map((value, i) => (
                            <Chip key={i} label={getDropdownLabel(value)} />
                          ))}
                        </Box>
                      )
                    : null
                }
                sx={{
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#505050'
                  }
                }}
                onChange={(e) => onInputChange(e)}
                input={outlined && !readOnly && <OutlinedInput label={getFieldLabel()} />}
              >
                {options.current.map((option, i) => (
                  <MenuItem key={i} value={getDropdownValue(option)}>
                    <ListItemText ml={2} primary={getDropdownLabel(option)} />
                  </MenuItem>
                ))}
              </Select>
            )} */}
            <Select
              variant={readOnly || !outlined ? 'standard' : 'outlined'}
              labelId="demo-multiple-checkbox-label"
              value={getValue()}
              size={getSize()}
              label={getFieldLabel()}
              disabled={getDisabled()}
              onBlur={onBlur}
              onFocus={onStartEdit}
              name={fieldKey}
              error={Object.keys(errors).includes(fieldKey)}
              multiple={isMulti()}
              renderValue={
                isMulti()
                  ? (selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getValue().map((value, i) => (
                          <Chip key={i} label={getDropdownLabel(value)} />
                        ))}
                      </Box>
                    )
                  : null
              }
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#505050'
                }
              }}
              onChange={(e) => onInputChange(e)}
              input={outlined && !readOnly && <OutlinedInput label={getFieldLabel()} />}
            >
              {options.current.map((option, i) => (
                <MenuItem key={i} value={getDropdownValue(option)}>
                  <ListItemText ml={2} primary={getDropdownLabel(option)} />
                </MenuItem>
              ))}
            </Select>

            {outlined && !readOnly && (
              <FormHelperText>
                {(getIsMandatory() ? 'Required. ' : 'Optional. ') + getDescription() || ''}
              </FormHelperText>
            )}
          </FormControl>
        ) : fieldType == 'SingleCheckBox' ? (
          <FormControl sx={{ ml: 1.5 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size={getSize()}
                  onBlur={onBlur}
                  disabled={getDisabled()}
                  onFocus={onStartEdit}
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#505050'
                    }
                  }}
                  children={getFieldLabel()}
                  checked={getValue()}
                  onChange={onInputChange}
                />
              }
              label={getFieldLabel()}
            />
            {!readOnly && <FormHelperText>{getHelperText()}</FormHelperText>}
          </FormControl>
        ) : fieldType == 'Divider' ? (
          <Divider />
        ) : (
          <TextField
            variant={readOnly || !outlined ? 'standard' : 'outlined'}
            error={Object.keys(errors).includes(fieldKey)}
            size={getSize()}
            onKeyPress={onReturnKey}
            onChange={(e) => onInputChange(e)}
            disabled={getDisabled()}
            onBlur={onBlur}
            onFocus={onStartEdit}
            name={fieldKey}
            helperText={showDescription && !readOnly && !tableMode ? getHelperText() : ''}
            type={getType()}
            inputProps={getMimeTypes().length ? { accept: getMimeType(getMimeTypes()) } : {}}
            InputProps={{
              ...getEndAdornemt(),
              ...inputProps,
              startAdornment: hasStartAdornment() ? (
                <InputAdornment sx={{ ml: 1, transform: 'translate(-10px,0px)' }} position="start">
                  <Tooltip title={getToolTip()}>
                    <Icon>
                      <Iconify icon={getStartAdornment()} />
                    </Icon>
                  </Tooltip>
                </InputAdornment>
              ) : null
            }}
            InputLabelProps={['Attachment', 'Date'].includes(fieldType) ? { shrink: true } : null}
            fullWidth
            multiline={fieldType === 'LongText'}
            maxRows={readOnly ? 100 : 6}
            value={getValue()}
            label={getFieldLabel() || ''}
            placeholder={getHint() || 'Type something...'}
            sx={{
              mt: 0,
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: '#505050'
              }
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
