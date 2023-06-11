//Create a new component called RequestForm that has a multipart form
import { Stack, Paper, List } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { format } from 'date-fns';
import Section from './Section';
import { validateField } from './validator';
import { flattenObject, getDependancyValue } from './DataTransformer';

export const fDateTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy・HH:mm');
};

export const storageHost = 'http://reg-ui-acc.gov.bw:8080/';

// let sections = [];
// console.log(sections);
export const pluralize = (noun, count) => {
  return count === 1 ? `${count} ${noun}` : `${count} ${noun}s`;
};

//function that limits the length of a filename if it has more than 10 characters and maintains the extension
export const limitFileName = (name, length = 20) => {
  if (name.length > length) {
    const extension = name.split('.').pop();
    const fileName = name.split('.').slice(0, -1).join('.');
    return fileName.substring(0, length) + '...' + extension;
  } else {
    return name;
  }
};

export const limitTextLength = (text, length) => {
  if (text.length > length + 3) {
    return text.substring(0, length) + '...';
  } else {
    return text;
  }
};

export const isBlank = (field) => {
  //if type of field is array
  if (Array.isArray(field)) {
    return field.length == 0;
  }
  return (field || '').trim().length == 0;
};

export const FieldViewer = forwardRef((props, ref) => {
  const {
    sectionErrors,
    setSectionErrors,
    errors,
    setErrors,
    sections,
    data,
    minHeight,
    maxHeight,
    setData,
    openSection,
    width=null,
    setOpenSection,
    editor
  } = props;
  const [validated, setValidated] = useState(false);
  const [hiddenFields, setHiddenFields] = useState([]);
  const [autoPopulated, setAutoPopulated] = useState({});
  const [changes, setChanges] = useState([]);
  const initialData = useRef({ ...data });
  const [singleSection, setSingleSection] = useState(false);

  useImperativeHandle(ref, () => ({
    getChanges: getChanges
  }));

  const validate = (validateData) => {
    const errs = {};
    const sectionErrs = {};
    const newHiddenFields = [];

    const fieldData = validateData || data;

    sections.forEach((section, sectionIndex) => {
      section.fields.forEach((field) => {
        // Validate field based on dependencies
        const validity = validateField(field, fieldData);
        const mandatory = validity.mandatory;
        if (!validity.isValid) {
          errs[field.fieldName] = true;
          if (sectionErrs[sectionIndex] === undefined) {
            sectionErrs[sectionIndex] = 1;
          } else {
            sectionErrs[sectionIndex] += 1;
          }
        } else {
          if (sectionErrs[sectionIndex] === undefined) {
            sectionErrs[sectionIndex] = 0;
          }
        }

        // Hide fields which are disabled and not mandatory
        if (!mandatory) {
          let disabled = getDependancyValue({
            dependancies: field.dependancies,
            data: fieldData,
            property: 'disabled'
          });

          if (disabled == null) {
            disabled = field.disabled || false;
          }

          if (disabled && !mandatory) {
            newHiddenFields.push(field.fieldName);
          }
        }
      });
    });

    setHiddenFields(newHiddenFields);
    setValidated(true);
    setErrors(errs);
    setSectionErrors(sectionErrs);
    return Object.keys(errs).length === 0;
  };

  const getOverridableDependants = (fieldName) => {
    const dependants = [];
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        const overridableProperties = ['options', 'mimeTypes', 'endpoint'];
        const dependancies = (field.dependancies || []).filter(
          (dependancy) =>
            dependancy.field == fieldName && overridableProperties.includes(dependancy.target)
        );
        dependancies.forEach((dependancy) => {
          dependants.push(field.fieldName);
        });
      });
    });

    return dependants;
  };

  const getChanges = () => {
    if (!initialData.current) return {};

    const changes = {};

    const findChanges = (dataObj, initialDataObj, path = '') => {
      if (!dataObj || !initialDataObj) {
        return;
      }

      Object.keys(dataObj).forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (typeof dataObj[key] === 'object' && typeof initialDataObj[key] === 'object') {
          findChanges(dataObj[key], initialDataObj[key], currentPath);
        } else {
          if (dataObj[key] !== initialDataObj[key]) {
            changes[currentPath] = dataObj[key];
          }
        }
      });
    };

    findChanges(data, initialData.current);

    const flattanedChanges = flattenObject(changes);
    return flattanedChanges;
  };

  const onFieldBlur = (section) => {
    setChanges(getChanges());
    validate();
  };

  const onFieldFocus = (i) => {
    setOpenSection(i);
    if (Object.keys(errors).length) {
      validate();
    }
  };

  console.log('hehe')
  useEffect(() => {
    // For the editor this will be updated everytime the edit button is clicked
    // Initial Validation
    validate();
    setSingleSection(sections.length == 1);
    initialData.current = JSON.parse(JSON.stringify(data));
  }, [sections, data._id]);

  return (
    <Stack
      sx={{
        flex: 1,
        width,
        minHeight: minHeight,
        maxHeight: maxHeight
      }}
    >
      <Stack
        style={{ overflow: 'auto', height: '100%', bgcolor: 'green' }}
      >
        <List mb={4} sx={{bgcolor: '#ffffff10'}}>
          {sections.map((section, i) => (
            <Section
              index={i}
              singleSection={singleSection}
              key={i}
              isLast={i == sections.length - 1}
              title={section.title}
              getOverridableDependants={getOverridableDependants}
              subtitle={section.subtitle}
              description={section.description}
              viewAll={false}
              hasErrors={sectionErrors[i]}
              open={i == openSection}
              validated={validated}
              onValidate={validate}
              onOpen={() => setOpenSection(i)}
              isActiveSection={i == openSection}
              hiddenFields={hiddenFields}
              onNext={() => setOpenSection(i + 1)}
              fields={section.fields}
              readOnly={false}
              onFieldBlur={() => onFieldBlur(i)}
              onFieldFocus={() => onFieldFocus(i)}
              sectionErrors={sectionErrors}
              errors={errors}
              setErrors={setErrors}
              setData={setData}
              data={data}
              autoPopulated={autoPopulated}
              setAutoPopulated={setAutoPopulated}
              {...editor}
            />
          ))}
        </List>
      </Stack>
    </Stack>
  );
});
