import React, { useContext, useState } from 'react';
import Section from './bundle/Section';
import {
  Box,
  TextField,
  FormControl,
  Select,
  Stack,
  InputLabel,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Tooltip
} from '@mui/material';
import { SectionMode } from './SectionMode';

export const ServiceDetails = ({
  data,
  error,
  editable,
  isUpdate,
  openable,
  onOpen,
  openSection,
  handleDataChange,
  isLoading,
  errors
}) => {
  const section = SectionMode.ServiceDetails;
  const isDisabled = !editable || isLoading;

  return (
    <Section
      error={error}
      title="Service Details"
      onOpen={() => onOpen(section)}
      open={section == openSection && openable}
      subtitle={`Information about this service`}
    >
      <FormControl fullWidth>
        <Box display="flex" flexDirection="row">
          <Tooltip
            title={
              data.serviceCode
                ? ''
                : data.code
                ? "Update to the 'Owner Details' section is required for this service to update to a Standardized Service Code"
                : ''
            }
          >
            <TextField
              id="outlined-basic"
              error={errors.code}
              onChange={(e) => handleDataChange(e)}
              disabled={true}
              name="code"
              value={data.serviceCode || data.code || ''}
              label="Code"
              placeholder="1Lkj29D3n3"
              sx={{
                mt: 1,
                ml: 4,
                textDecoration: data.serviceCode ? 'none' : data.code ? 'line-through' : 'none',
                textDecorationColor: 'error.main'
              }}
              variant="outlined"
            />
          </Tooltip>
          <TextField
            id="outlined-basic"
            error={errors.version}
            onChange={(e) => handleDataChange(e)}
            disabled={isDisabled}
            name="version"
            value={data.version || ''}
            label="Version"
            placeholder={data.SRVersion || '0.01'}
            sx={{ mt: 1, ml: 2 }}
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            error={errors.status}
            onChange={(e) => handleDataChange(e)}
            disabled={true}
            name="status"
            value={(data.status || '').length == 0 ? 'REGISTRATION' : data.status}
            label="Status"
            placeholder="Registered"
            sx={{ mt: 1, ml: 2, mr: 2 }}
            variant="outlined"
          />
        </Box>
        <TextField
          id="outlined-basic"
          error={errors.name}
          disabled={isDisabled}
          onChange={(e) => handleDataChange(e)}
          value={data.name || ''}
          name="name"
          label="Service Name"
          placeholder="NAME-OF-SERVICE"
          sx={{ mt: 1, mx: 4 }}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          error={errors.displayName}
          disabled={isDisabled}
          onChange={(e) => handleDataChange(e)}
          value={data.displayName || ''}
          name="displayName"
          label="Display Name"
          placeholder="Name of service"
          sx={{ mt: 1, mx: 4 }}
          variant="outlined"
        />
        <TextField
          id="outlined-basic"
          error={errors.description}
          disabled={isDisabled}
          multiline
          minRows={3}
          onChange={(e) => handleDataChange(e)}
          value={data.description || ''}
          name="description"
          label="Description"
          placeholder="Description of service"
          sx={{ mt: 1, mx: 4 }}
          variant="outlined"
        />
        <Box display="flex" flexDirection="row" mr={2}>
          <TextField
            id="outlined-basic"
            fullWidth
            error={errors.host}
            onChange={(e) => handleDataChange(e)}
            disabled={isDisabled}
            name="host"
            value={data.host || ''}
            label="Host"
            placeholder="1gov.gov.bw"
            sx={{ mt: 1, ml: 4 }}
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            error={errors.port}
            onChange={(e) => handleDataChange(e)}
            disabled={isDisabled}
            name="port"
            value={data.port || ''}
            label="Port"
            placeholder="3000"
            sx={{ mt: 1, width: 200, ml: 2 }}
            variant="outlined"
          />
          <Box sx={{ mt: 1, ml: 2, mr: 2, width: '300px' }}>
            <FormControl fullWidth>
              <InputLabel
                id="demo-multiple-checkbox-label"
                error={errors.office}
                mt={2}
                bgcolor="#fff"
                width={5}
              >
                Protocol
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={data.protocol ? [data.protocol] : []}
                disabled={isDisabled}
                name="protocol"
                error={errors.protocol}
                onChange={handleDataChange}
                input={<OutlinedInput label="Protocol" />}
              >
                {['http://', 'https://'].map((name) => (
                  <MenuItem key={name} value={name}>
                    <ListItemText ml={2} primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box display="flex" flexDirection="row" ml={2} mr={4} mb={1}>
          <TextField
            id="outlined-basic"
            error={errors.endpoint}
            onChange={(e) => handleDataChange(e)}
            disabled={isDisabled}
            name="endpoint"
            value={data.endpoint || ''}
            label="Endpoint"
            placeholder="path/subpath"
            sx={{ mt: 1, width: 500, ml: 2, flex: 1 }}
            variant="outlined"
          />
          <TextField
            id="outlined-basic"
            error={errors.validationEndpoint}
            onChange={(e) => handleDataChange(e)}
            disabled={isDisabled}
            name="validationEndpoint"
            value={data.validationEndpoint || ''}
            label="Validation Endpoint"
            placeholder="path/subpath"
            sx={{ mt: 1, width: 500, ml: 2, flex: 1 }}
            variant="outlined"
          />
          {/* <TextField id="outlined-basic" fullWidth error={errors.} onChange={e=>handleDataChange(e)} disabled={isDisabled} name='validationEndpoint' value={data.validationEndpoint || ''} label="Validate Endpoint" placeholder='path/subpath' sx={{mt: 1,width: 500, ml: 2, flex: 1}}  variant="outlined" /> */}
        </Box>
        <TextField
          id="outlined-basic"
          error={errors.notes}
          disabled={isLoading}
          multiline
          minRows={3}
          onChange={(e) => handleDataChange(e)}
          value={data.notes || ''}
          name="notes"
          label="Official Notes"
          placeholder="Notes about this service"
          sx={{ mx: 4 }}
          variant="outlined"
        />
      </FormControl>
    </Section>
  );
};
