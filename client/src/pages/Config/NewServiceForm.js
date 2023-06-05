import { Stack } from '@mui/material';
import React from 'react';
import DynamicField from '../RegDetails/Issuance.js/DynamicField';

export const NewServiceForm = ({ data, setData }) => {
  const [errors, setErrors] = React.useState({});

  const validate = (field, value) => {
    // setData({...data, [field]: value});
  };

  return (
    <Stack>
      <DynamicField
        field={{
          fieldName: 'registryRef',
          fieldLabel: 'Registry Reference',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'registryId',
          defaultValue: '',
          fieldLabel: 'Registry Identification',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'departmentName',
          defaultValue: '',
          fieldLabel: 'Department Name',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      
      <DynamicField
        field={{
          fieldName: 'departmentCode',
          defaultValue: '',
          fieldLabel: 'Department Code',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'ministry',
          defaultValue: '',
          fieldLabel: 'Ministry ',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'ministryCode',
          defaultValue: '',
          fieldLabel: 'Ministry Code',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'code',
          defaultValue: '',
          fieldLabel: 'Code',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'shortName',
          defaultValue: '',
          fieldLabel: 'Short Name',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'type',
          defaultValue: '',
          fieldLabel: 'Type',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'serviceName',
          defaultValue: '',
          fieldLabel: 'ServiceName',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'version',
          defaultValue: '',
          fieldLabel: 'Version',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'issuanceFee',
          defaultValue: '',
          fieldLabel: 'Issuance Fee',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: false
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'issuanceFeeType',
          defaultValue: '',
          fieldLabel: 'Issuance Fee Type',
          placeholder: '',
          enabled: false,
          fieldType: 'DropDown',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />
      <DynamicField
        field={{
          fieldName: 'applicationfee',
          defaultValue: '',
          fieldLabel: 'Application Fee',
          placeholder: '',
          enabled: false,
          fieldType: 'shortText',
          fieldDescription: '',
          options: [],
          mandatory: false
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />

      <DynamicField
        field={{
          fieldName: 'issuanceFeeService',
          defaultValue: '',
          fieldLabel: 'Issuance Fee Service',
          placeholder: '',
          enabled: false,
          fieldType: 'ShortText',
          fieldDescription: '',
          options: [],
          mandatory: true
        }}
        fieldData={data}
        errors={errors}
        onChange={validate}
        setFieldData={setData}
        isDisabled={true}
      />

    </Stack>
    
    
  );
};
