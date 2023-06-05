//Create a new component called RequestForm that has a multipart form
import { Stack, Typography, TextField, Button, Collapse } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { RequestContext } from './RequestContext';
import { Box } from '@mui/system';
import InputField from './bundle/InputField';
import { nanoid } from 'nanoid';
import { validateField } from './bundle/validator';
import { FieldEditorContext } from './FieldEditorContext';
import TableFieldViewer from './bundle/TableFieldViewer';
import { ToolBar } from './ToolBar';
import { FieldTypes, Formatters } from './bundle/constants';
import { sanitizeForm } from './bundle/sanitize';
import { SectionEditor } from './SectionEditor';
import { getDependancyValue } from './bundle/DataTransformer';
import { FieldViewer } from './bundle/FieldViewer';

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy・HH:mm');
}

export const matchComplex = (array, targetValue) => {
  let res = false;
  array.forEach((value) => {
    if (targetValue.toLowerCase().includes(value.toLowerCase())) {
      res = true;
    }
  });

  return res;
};

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

  if (typeof field == 'number') {
    return !isNaN(field);
  }

  return (field || '').trim().length == 0;
};

export const editorSections = [
  // {
  //   id: 'table',
  //   title: 'Table details',
  //   subtitle: 'Edit details about this table',
  //   fields: [
  //     {
  //       fieldName: 'fieldType',
  //       defaultValue: '',
  //       fieldLabel: 'Field Type',
  //       enabled: true,
  //       fieldType: 'Dropdown',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       fieldDescription: 'The type of field you want to add to your form.',
  //       options: Object.values(FieldTypes),
  //       mandatory: true
  //     },
  //     {
  //       fieldName: 'fieldName',
  //       defaultValue: '',
  //       fieldLabel: 'Field Key',
  //       enabled: true,
  //       fieldType: 'ShotText',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       fieldDescription: 'The key for this field',
  //       default: 'ShortText',
  //       options: [],
  //       mandatory: true
  //     },
  //     {
  //       fieldName: 'isLimited',
  //       defaultValue: '',
  //       fieldLabel: 'Column Name',
  //       enabled: true,
  //       fieldType: 'SingleCheckBox',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       fieldDescription: 'Limit columns',
  //       default: '',
  //       options: [],
  //       mandatory: true
  //     },
  //     {
  //       fieldName: 'fieldLabel',
  //       defaultValue: '',
  //       fieldLabel: 'Field Label',
  //       enabled: true,
  //       placeholder: 'Label of Field',
  //       fieldDescription: 'The label of this field.',
  //       fieldType: 'ShortText',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       options: [],
  //       mandatory: true
  //     },
  //     {
  //       fieldName: 'description',
  //       defaultValue: '',
  //       placeholder: 'An example of a short description',
  //       fieldLabel: 'Description',
  //       enabled: true,
  //       fieldType: 'ShortText',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       fieldDescription: 'A short description for this field',
  //       options: [],
  //       mandatory: false
  //     },
  //     {
  //       fieldName: 'mandatory',
  //       defaultValue: '',
  //       fieldLabel: 'Is this field required?',
  //       breakpoints: {
  //         xs: 12,
  //         sm: 12,
  //         md: 6,
  //         lg: 6
  //       },
  //       enabled: true,
  //       fieldType: 'SingleCheckBox',
  //       fieldDescription: '',
  //       options: [],
  //       mandatory: false
  //     }
  //   ]
  // },
  {
    id: 'field',
    title: 'Field details',
    subtitle: 'Edit details about this field',
    fields: [
      {
        fieldName: 'Field Type',
        defaultValue: '',
        fieldLabel: 'Column Type',
        enabled: true,
        fieldType: 'Dropdown',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        fieldDescription: 'The type of field you want to add to your form.',
        options: Object.values(FieldTypes),
        mandatory: true
      },
      {
        fieldName: 'fieldType',
        defaultValue: '',
        fieldLabel: 'Field Type',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Dropdown',
        fieldDescription: 'The type of field you want to add to your form.',
        options: Object.values(FieldTypes),
        mandatory: true
      },
      {
        fieldName: 'fieldName',
        defaultValue: '',
        fieldLabel: 'Field Key',
        enabled: true,
        fieldType: 'ShotText',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        fieldDescription: 'The key for this field',
        default: 'ShortText',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'Column Key',
        defaultValue: '',
        fieldLabel: 'Column Key',
        enabled: true,
        fieldType: 'ShotText',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        fieldDescription: 'The key for this column',
        default: 'ShortText',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'Column Name',
        defaultValue: '',
        fieldLabel: 'Column Name',
        enabled: true,
        fieldType: 'ShotText',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        fieldDescription: 'The key for this column',
        default: 'ShortText',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'fieldLabel',
        defaultValue: '',
        fieldLabel: 'Field Label',
        enabled: true,
        placeholder: 'Label of Field',
        fieldDescription: 'The label of this field.',
        fieldType: 'ShortText',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        options: [],
        mandatory: true
      },
      {
        fieldName: 'options',
        defaultValue: '',
        fieldLabel: 'Options for this field',
        enabled: true,
        fieldType: 'ShortText',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        placeholder: 'Male*Female',
        fieldDescription: "Separate the options by '*' or add them one at a time",
        options: [],
        mandatory: true
      },
      {
        fieldName: 'description',
        defaultValue: '',
        placeholder: 'An example of a short description',
        fieldLabel: 'Description',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShortText',
        fieldDescription: 'A short description for this field',
        options: [],
        mandatory: false
      },
      {
        fieldName: 'tooltip',
        defaultValue: '',
        placeholder: 'This will be the tool tip to this field',
        fieldLabel: 'Tooltip',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShortText',
        fieldDescription: 'A description shown on hovering of this field',
        options: [],
        mandatory: false
      },
      {
        fieldName: 'hint',
        defaultValue: '',
        fieldLabel: 'Hint',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShortText',
        fieldDescription: '',
        options: [],
        mandatory: false
      },
      {
        fieldName: 'endpoint',
        defaultValue: '',
        fieldLabel: 'Endpoint',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShortText',
        fieldDescription: '',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'endpoint_parameter',
        defaultValue: '',
        fieldLabel: 'Endpoint Parameter',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'SingleCheckBox',
        fieldDescription: '',
        options: [],
        mandatory: false
      },
      {
        fieldName: 'mimeTypes',
        defaultValue: '',
        fieldLabel: 'Suported File Formats',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'DropdownMulti',
        fieldDescription: '',
        options: ['Pdf', 'Doc', 'Docx', 'Xls', 'Xlsx', 'Png', 'Jpg', 'Jpeg'],
        mandatory: true
      }
    ]
  },
  {
    id: 'validation',
    title: 'Validation',
    subtitle: 'Configure validation for this field',
    fields: [
      {
        fieldName: 'regex',
        defaultValue: '',
        fieldLabel: 'Regex',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShortText',
        hint: '^\\d{4}[1-2]\\d{4}$',
        fieldDescription: 'The regular expression used to validate this field',
        options: [],
        mandatory: false
      },
      {
        fieldName: 'mandatory',
        defaultValue: false,
        fieldLabel: 'Is this field required?',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'SingleCheckBox',
        fieldDescription: '',
        options: [],
        mandatory: false
      }
    ]
  },
  {
    id: 'render',
    title: 'Render',
    subtitle: 'Configure How this field should render',
    fields: [
      {
        fieldName: 'name',
        defaultValue: '',
        fieldLabel: 'Render name',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShotText',
        fieldDescription: 'The key for this field',
        default: 'ShortText',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'descInfo',
        defaultValue: '',
        fieldLabel: 'Tooltip',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'ShotText',
        fieldDescription: '',
        default: '',
        options: [],
        mandatory: true
      },
      {
        fieldName: 'formatter',
        defaultValue: '',
        fieldLabel: 'Formatter',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        placeholder: 'Label of Field',
        fieldDescription: 'The formatter for this field.',
        fieldType: FieldTypes.Dropdown,
        options: Formatters,
        mandatory: true
      },
      {
        fieldName: 'defaultValue',
        defaultValue: '',
        fieldLabel: 'Default value',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Shorttext',
        fieldDescription: '',
        options: [],
        mandatory: false
      }
    ]
  },
  {
    id: 'size',
    title: 'Field Size',
    subtitle: 'Configure the size for this field for responsive behaviour',
    fields: [
      {
        fieldName: 'breakpoints.xs',
        defaultValue: 12,
        fieldLabel: 'Small Mobile',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Dropdown',
        fieldDescription: 'The type of field you want to add to your form.',
        options: [
          {
            value: 'Full',
            key: 12
          }
        ],
        mandatory: true
      },
      {
        fieldName: 'breakpoints.sm',
        defaultValue: '',
        fieldLabel: 'Mobile',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Dropdown',
        fieldDescription: 'The type of field you want to add to your form.',
        options: [
          {
            value: 'Third',
            key: 4
          },
          {
            value: 'Half',
            key: 6
          },
          {
            value: 'Full',
            key: 12
          }
        ],
        mandatory: true
      },
      {
        fieldName: 'breakpoints.md',
        defaultValue: '',
        fieldLabel: 'Tablet',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Dropdown',
        fieldDescription: 'The type of field you want to add to your form.',
        options: [
          {
            value: 'Twelveth',
            key: 1
          },
          {
            value: 'Sixth',
            key: 2
          },
          {
            value: 'Quarter',
            key: 3
          },
          {
            value: 'Third',
            key: 4
          },
          {
            value: 'Half',
            key: 6
          },
          {
            value: 'Full',
            key: 12
          }
        ],
        mandatory: true
      },
      {
        fieldName: 'breakpoints.lg',
        defaultValue: '',
        fieldLabel: 'Desktop',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 6,
          lg: 6
        },
        enabled: true,
        fieldType: 'Dropdown',
        fieldDescription: 'The type of field you want to add to your form.',
        options: [
          {
            value: 'Twelveth',
            key: 1
          },
          {
            value: 'Sixth',
            key: 2
          },
          {
            value: 'Quarter',
            key: 3
          },
          {
            value: 'Third',
            key: 4
          },
          {
            value: 'Half',
            key: 6
          },
          {
            value: 'Full',
            key: 12
          }
        ]
      }
    ]
  },
  {
    id: 'dependancy',
    title: 'Dependancies',
    subtitle: 'Configure relations between different fields values',
    fields: [
      {
        fieldName: 'dependancies',
        fieldLabel: 'Add a list of dependancies',
        hint: '',
        fieldType: 'DataTable',
        endpoint_parameter: false,
        description: 'Configure all dependancies that this field has',
        tooltip: '',
        options: '',
        breakpoints: {
          xs: 12,
          sm: 12,
          md: 12,
          lg: 12
        },
        dataTableData: {
          isLimited: false,
          description: 'Configure all dependancies that this field has',
          limit: 100,
          inputData: {
            0: {
              'Column Key': 'field',
              'Column Name': 'Field',
              'Field Type': 'Dropdown',
              hint: '',
              Options: [],
              Endpoint: ''
            },
            1: {
              'Column Key': 'condition',
              'Column Name': 'Condition',
              'Field Type': 'Dropdown',
              hint: '',
              Options: [],
              Endpoint: ''
            },
            2: {
              'Column Key': 'value',
              'Column Name': 'Comparative',
              'Field Type': 'ShortText',
              hint: 'Comparative',
              Options: '',
              Endpoint: ''
            },
            3: {
              'Column Key': 'target',
              'Column Name': 'Target',
              'Field Type': 'Dropdown',
              hint: '',
              Options: [],
              Endpoint: ''
            },
            4: {
              'Column Key': 'targetValue',
              'Column Name': 'Set',
              'Field Type': 'ShortText',
              hint: '',
              Options: '',
              Endpoint: ''
            }
          }
        },
        endpoint: '',
        mandatory: false,
        mimeTypes: []
      }
    ]
  }
];

export const FieldForm = ({ data, setData, editingForm }) => {
  const [openSection, setOpenSection] = useState(0);
  const [errors, setErrors] = useState({});
  const [validated, setValidated] = useState(false);
  const [hiddenFields, setHiddenFields] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [sectionErrors, setSectionErrors] = useState({});
  const [autoPopulated, setAutoPopulated] = useState({});
  const { form, setForm, sections, setSections, selectedSection, setSelectedSection } =
    useContext(FieldEditorContext);
  const [fieldTypeEditorSections, setFilteredSections] = useState([]);
  const [hoveredField, setHoveredField] = useState(null);

  // The metadata of the editing field
  const [metadata, setMetadata] = useState({});
  const [subMetadata, setSubMetadata] = useState({});

  const { currentRequest, readOnlyForm, viewAll } = useContext(RequestContext);

  const getChanges = () => {
    if (!currentRequest) return {};

    const chnges = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== currentRequest[key]) {
        chnges[key] = data[key];
      }
    });

    return chnges;
  };

  const onFieldBlur = () => {};

  const onFieldFocus = (i) => {};

  const selectField = (field) => {
    setMetadata({ ...field });
  };

  const selectSubField = (field) => {
    setSubMetadata({ ...field });
  };

  const fieldHasChanges = () => {
    const field = form.find((f) => f.id == metadata.id);
    return field && JSON.stringify(field) !== JSON.stringify(metadata);
  };

  const saveMetadata = (field) => {
    if (Object.keys(errors).length == 0) {
      const fields = [...form];
      const formFieldIndex = fields.findIndex((f) => f.id == field.id);
      fields.splice(formFieldIndex, 1, { ...metadata });

      // Replace the value in the form with
      setForm(fields);
    }
  };

  useEffect(() => {
    let allRequired = ['fieldName', 'fieldType', 'fieldLabel'];
    let shownFields = ['description', 'mandatory', 'tooltip'];
    let shownSections = ['general', 'table', 'columns'];

    if (metadata.fieldType) {
      if (metadata.fieldType == FieldTypes.DataTable) {
        allRequired = ['Column Key', 'Column Name', 'Field Type'];
      }

      if (matchComplex(['dropdown', 'phonenumber', 'currency'], metadata.fieldType)) {
        allRequired = [...allRequired, 'options'];
      }

      if (matchComplex(['attachment'], metadata.fieldType)) {
        allRequired = [...allRequired, 'mimeTypes'];
      }

      if (matchComplex(['dynamic'], metadata.fieldType)) {
        allRequired = [...allRequired, 'endpoint', 'endpoint_parameter'];
      }

      if (
        matchComplex(
          ['text', 'email', 'phone', 'currency', 'hyperlink', 'number'],
          metadata.fieldType
        )
      ) {
        allRequired = [...allRequired, 'hint'];
      }
    } else {
      setErrors({ ...errors, fieldType: 'This field is required for control' });
    }

    // All fields to be shown
    shownFields = [...allRequired, ...shownFields];

    // setRequiredFields(allRequired);

    // Set if field is required for validation
    const basicSection = { ...editorSections[0] };
    let newFields = [];
    editorSections[0].fields.forEach((field) => {
      if (shownFields.includes(field.fieldName)) {
        newFields.push(field);
      }
    });

    newFields.forEach((field) => {
      if (allRequired.includes(field.fieldName)) {
        field.mandatory = true;
      } else {
        field.mandatory = false;
      }
    });

    basicSection.fields = newFields;

    // TODO: Manage Smart Fields here for the second section

    // Append all changes to the main array
    const newSections = [...editorSections];
    newSections.shift();
    newSections.unshift(basicSection);

    // Sanitize these sections
    newSections.forEach((section) => {
      section.fields = sanitizeForm(section.fields);
    });

    // Replace the default section with fieldType specific one
    setFilteredSections(newSections);
  }, [metadata.fieldType, subMetadata['Column Type']]);

  // Set section errors
  useEffect(() => {
    const errs = {};
    fieldTypeEditorSections.forEach((section, i) => {
      section.fields.forEach((field) => {
        if (errors[field.fieldName]) {
          errs[i] = true;
        }
      });
    });

    setSectionErrors(errs);
  }, [errors]);

  useEffect(() => {
    // set a unique field id for each field in the sample form
    if (editingForm) {
      let modifiedForm = sanitizeForm(editingForm);
      setForm(modifiedForm);
    }
  }, [editingForm]);

  const hoveredIndex = useRef(null);
  const [openInsertIndex, setOpenInsertIndex] = useState(-1);

  const setHoveredIndex = (i) => {
    hoveredIndex.current = i;
    setTimeout(() => {
      if (hoveredIndex.current !== null) {
        setOpenInsertIndex(hoveredIndex.current);
      }
    }, [150]);
  };

  const resetHoveredIndex = (i) => {
    hoveredIndex.current = null;
    setOpenInsertIndex(-1);
  };

  const AddFieldAt = (i) => {
    console.log('AddFieldAt', i);
    const newForm = [...form];
    newForm.splice(i, 0, {
      id: nanoid(16),
      fieldName: '',
      fieldType: '',
      fieldLabel: '',
      description: '',
      mandatory: false,
      tooltip: '',
      options: [],
      mimeTypes: [],
      endpoint: '',
      endpoint_parameter: '',
      hint: ''
    });
    setForm(newForm);
    setOpenInsertIndex(-1);
  };

  const deleteField = () => {
    const newForm = [...form];
    const index = newForm.findIndex((f) => f.id == metadata.id);
    newForm.splice(index, 1);
    setForm(newForm);
    setMetadata({});
  };

  const cancelEditMode = () => {
    setMetadata({});
    setSubMetadata({});
  };

  const getAddFieldWidget = (i, hovered) => {
    const isSelected = i == openInsertIndex;
    return (
      <Collapse in={hovered}>
        <Stack
          px={1}
          py={0.5}
          mt={i == 0 ? 1 : 0}
          borderRadius={2}
          bgcolor={isSelected ? 'transparent' : '#f5f5f5'}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={resetHoveredIndex}
        >
          <Collapse in={isSelected}>
            <Button
              variant="outlined"
              onClick={() => AddFieldAt(i)}
              fullWidth
              sx={{
                color: 'primary.main',
                borderRadius: 1,
                textAlign: 'center',
                fontSize: 12,
                py: 1,
                border: '1px dotted #32c5ff'
              }}
            >
              Add New Field Here
            </Button>
          </Collapse>
        </Stack>
      </Collapse>
    );
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const newForm = Array.from(form);
    const [reorderedField] = newForm.splice(result.source.index, 1);
    newForm.splice(result.destination.index, 0, reorderedField);

    setForm(newForm);
    setDragging(false);
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
            disabled = field.mandatory || false;
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

  const getToolBar = (field, isHovered, isOpen) => {
    return (
      <ToolBar
        cancelEditMode={cancelEditMode}
        deleteField={deleteField}
        isOpen={isOpen}
        isHovered={isHovered}
        dragging={dragging}
        field={field}
        fieldHasChanges={fieldHasChanges}
        selectField={selectField}
        openInsertIndex={openInsertIndex}
        saveMetadata={saveMetadata}
      />
    );
  };

  return (
    <Stack direction="row" maxHeight="100%" minHeight="100%">
      <Stack flex={2} maxHeight="100%" minHeight="100%">
        <SectionEditor
          sections={sections}
          setSelectedSection={setSelectedSection}
          selectedSection={selectedSection}
          setSections={setSections}
        />
        {form.length == 0 && getAddFieldWidget(0, true)}

        <DragDropContext onDragEnd={handleOnDragEnd} onBeforeDragStart={() => setDragging(true)}>
          <Droppable droppableId="fields">
            {(provided) => (
              <Stack
                {...provided.droppableProps}
                overflow="scroll"
                ref={provided.innerRef}
                className="fields scollable"
                mb={4}
                mx={2}
              >
                {form.map((field, i) => {
                  const isOpen = field.id == metadata.id;
                  const isHovered = hoveredField == field.id;
                  return (
                    <Draggable key={field.id} draggableId={field.id} index={i}>
                      {(provided) => (
                        <Stack
                          flex={1}
                          mt={i == 0 || isOpen ? 1 : 0}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {Object.keys(metadata).length == 0 &&
                            !dragging &&
                            getAddFieldWidget(i, isHovered)}
                          <Stack
                            key={field.id}
                            onMouseEnter={() => setHoveredField(field.id)}
                            sx={{
                              bgcolor: isOpen ? '#80808010' : isHovered ? '#fff' : 'transparent',
                              px: isOpen ? 1 : 0,
                              borderRadius: 1,
                              border: isOpen ? '1px dotted #32c5ff' : 'none'
                            }}
                          >
                            <Stack direction="row" alignItems="center">
                              <Box flex={1}>
                                {field.fieldType === FieldTypes.DataTable ? (
                                  <TableFieldViewer
                                    field={field}
                                    errors={errors}
                                    onFieldBlur={onFieldBlur}
                                    editor={{
                                      showToolBar: isHovered,
                                      selectedColumn: subMetadata,
                                      onSelectedSubfield: selectSubField,
                                      editMode: true,
                                      isOpen,
                                      setForm,
                                      form,
                                      isHovered,
                                      onCancel: cancelEditMode,
                                      onDelete: deleteField,
                                      toolBar: getToolBar(field, isHovered, isOpen)
                                    }}
                                    onFieldFocus={onFieldFocus}
                                    data={data}
                                    setData={setData}
                                    setErrors={setErrors}
                                    onValidate={validate}
                                    getOverridableDependants={getOverridableDependants}
                                  />
                                ) : (
                                  <InputField
                                    onOpenField={() => setHoveredField(field.id)}
                                    setDragging={setDragging}
                                    showToolBar={isHovered}
                                    dragging={dragging}
                                    field={isOpen ? metadata : field}
                                    autoPopulated={autoPopulated}
                                    setAutoPopulated={setAutoPopulated}
                                    onValidate={validate}
                                    fieldData={data}
                                    getOverridableDependants={getOverridableDependants}
                                    setFieldData={setData}
                                    errors={errors}
                                    setErrors={setErrors}
                                    toolBar={getToolBar(field, isHovered, isOpen)}
                                  />
                                )}
                              </Box>
                            </Stack>
                            <Collapse in={isOpen}>
                              <Stack pb={1} pl={1}>
                                <FieldViewer
                                  data={metadata}
                                  errors={errors}
                                  sectionErrors={sectionErrors}
                                  setErrors={setErrors}
                                  sections={fieldTypeEditorSections}
                                  setData={setMetadata}
                                  setOpenSection={setOpenSection}
                                  openSection={openSection}
                                  setSectionErrors={setSectionErrors}
                                  editor={{
                                    hideLeftBar: false,
                                    showDetailed: true,
                                    hiddenFields: hiddenFields,
                                    isEditorSection: true,
                                    editingState: { metadata, subMetadata, sections },
                                    hasNestSectionErrors: sectionErrors[i + 1],
                                    setData: setMetadata
                                  }}
                                />
                              </Stack>
                            </Collapse>
                          </Stack>
                          {!dragging &&
                            Object.keys(metadata).length == 0 &&
                            getAddFieldWidget(i + 1, isHovered)}
                        </Stack>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>

      <Stack ml={2} flex={1} overflow="scroll">
        <Typography variant="h6" children="Field Metadata" mb={1} gutterBottom />
        <TextField
          disabled
          multiline
          sx={{
            mt: 0,
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000'
            }
          }}
          value={JSON.stringify(metadata, null, 2)}
        />

        <Typography variant="h6" children="Field Output" mt={3} gutterBottom />
        <TextField
          disabled
          multiline
          sx={{
            mt: 0,
            fontSize: 10,
            '& .MuiInputBase-input.Mui-disabled': {
              WebkitTextFillColor: '#000000'
            }
          }}
          value={JSON.stringify(data, null, 2)}
        />
      </Stack>
    </Stack>
  );
};
