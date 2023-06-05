import { Button, Chip, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import InputField from './bundle/InputField';

export const SectionEditor = ({ selectedSection, sections, setSections, setSelectedSection }) => {
  const [open, setOpen] = useState(false);
  const [sectionData, setSectionData] = useState({});

  const fields = [
    {
      fieldName: 'title',
      fieldLabel: '',
      disabled: true,
      default: ``,
      fieldType: 'ShortText',
      endpoint_parameter: false,
      description: '',
      tooltip: '',
      hint: `Title of the section`,
      options: '',
      breakpoints: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4
      },
      dataTableData: '{}',
      endpoint: '',
      mandatory: false,
      mimeTypes: []
    },
    {
      fieldName: 'subtitle',
      fieldLabel: '',
      disabled: true,
      default: '',
      fieldType: 'ShortText',
      endpoint_parameter: false,
      description: '',
      hint: 'A description of this field',
      tooltip: '',
      options: '',
      breakpoints: {
        xs: 12,
        sm: 6,
        md: 4,
        lg: 4
      },
      dataTableData: '{}',
      endpoint: '',
      mandatory: false,
      mimeTypes: []
    }
  ];

  const setData = () => {
    const newSections = [...sections];
    newSections[selectedSection] = sectionData;
    setSections(newSections);
  };

  const selectSection = (index) => {
    setSelectedSection(index);
  };

  const insertSection = () => {
    const newSections = [...sections];
    newSections.splice(selectedSection + 1, 0, {
      title: '',
      subtitle: '',
      fields: []
    });
    setSections(newSections);
    setSelectedSection(selectedSection + 1);
  };

  useEffect(() => {
    if (sections.length > 0) {
      setSectionData(sections[selectedSection]);
    }
  }, [selectedSection]);

  useEffect(() => {
    const newSections = [...sections];
    Object.keys(sectionData).forEach((key) => {
      newSections[selectedSection][key] = sectionData[key];
    });
  }, [sectionData]);

  return (
    <Stack bgcolor="#80808010" px={1} pb={0.5} mx={1} mt={1} borderRadius={1}>
      <Stack direction="row" mt={1}>
        {sections.map((err, i) => {
          const isSelected = selectedSection == i;

          return (
            <Tooltip key={i} title={`Section ${i + 1}: ${sections[i].title}`}>
              <IconButton
                children={i + 1}
                sx={{
                  mr: 1,
                  width: 30,
                  height: 30,
                  fontSize: 12,
                  padding: 0,
                  bgcolor: isSelected ? 'primary.main' : '#4C4C4C10',
                  color: isSelected ? '#fff' : null,
                  fontWeight: isSelected ? 'bold' : null,
                  '&:hover': {
                    bgcolor: isSelected ? 'primary.main' : '#4C4C4C',
                    color: '#fff'
                  }
                }}
                onClick={() => selectSection(i)}
                key={i}
              />
            </Tooltip>
          );
        })}
        <Tooltip title={`Add Section @ ${selectedSection + 1}`}>
          <IconButton
            children={'+'}
            sx={{
              mr: 1,
              width: 30,
              height: 30,
              fontSize: 12,
              padding: 0,
              bgcolor: 'primary.main',
              color: '#fff',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#4C4C4C',
                color: '#fff'
              }
            }}
            onClick={() => insertSection()}
          />
        </Tooltip>
      </Stack>
      <Stack mx={1} overflow="hidden" justifyContent="space-between">
        <Stack sx={{ transform: 'translate(0px,1px)' }}>
          {fields.map((field, index) => (
            <InputField
              key={index}
              field={field}
              index={index}
              readOnly={false}
              outlined={false}
              smallSize={true}
              inputProps={{
                style: { fontWeight: index == 0 ? 'bold' : null }
              }}
              showDescription={false}
              data={sectionData}
              fieldData={sectionData}
              setFieldData={setSectionData}
              validated={false}
              onFieldChange={() => {}}
              onFieldFocus={() => {}}
              errors={{}}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};
