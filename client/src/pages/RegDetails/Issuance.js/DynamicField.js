import {
  FormControl,
  Box,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  OutlinedInput
} from '@mui/material';
import React from 'react';

export default function DynamicField({
  field,
  onChange,
  errors,
  fieldData,
  setFieldData,
  files,
  setFiles,
  isDisabled = false
}) {
  const getType = () => {
    if ('Attachment' == field.fieldType) {
      return 'file';
    }
    return 'text';
  };

  const onInputChange = (e) => {
    // If file is attachment
    console.log();
    if (field.fieldName.includes('Att')) {
      setFiles({ ...files, [field.fieldName]: e.target.files[0] });
    }

    setFieldData({ ...fieldData, [field.fieldName]: e.target.value });

    if (onChange) onChange(e);
  };

  return (
    <Box mt={1} id={field.fieldName}>
      {['dropdown'].includes(field.fieldType.toLowerCase()) ? (
        <FormControl fullWidth>
          <InputLabel error={errors[field.fieldName]} mt={3} bgcolor="#fff" width={5}>
            {field.fieldLabel}
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            value={fieldData[field.fieldName] || ''}
            disabled={isDisabled}
            name={field.fieldName}
            error={errors[field.fieldName]}
            onChange={(e) => onInputChange(e)}
            input={<OutlinedInput label={field.fieldLabel} />}
          >
            {(field.options || []).map((option, i) => (
              <MenuItem key={i} value={option}>
                <ListItemText ml={2} primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <TextField
          error={errors[field.fieldName]}
          onChange={(e) => onInputChange(e)}
          disabled={isDisabled}
          name={field.fieldName}
          type={getType()}
          inputProps={field.accept ? { accept: field.accept } : {}}
          InputLabelProps={['Attachment'].includes(field.fieldType) ? { shrink: true } : null}
          fullWidth
          multiline={field.fieldType === 'LongText'}
          maxRows={6}
          value={fieldData[field.fieldName] || ''}
          label={field.fieldLabel || ''}
          placeholder={field.placeholder || 'Type something...'}
          sx={{ mt: 1 }}
          variant="outlined"
        />
      )}
    </Box>
  );
}
