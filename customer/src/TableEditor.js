import { Box, Stack, Typography, IconButton, Tooltip, Collapse } from '@mui/material';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Iconify from './bundle/Iconify';
import InputField from './bundle/InputField';

export const TableEditor = ({
  field,
  onEdited,
  errors,
  setErrors,
  setDragging,
  dragging,
  onActiveField,
  handleOnDragEnd,
  onConfigured,
  onTableChange,
  onSelectedField,
  onDelete
}) => {
  const [fields, setFields] = useState([]);
  const [hoveredField, setHoveredField] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [metadata, setMetadata] = useState({});
  const [fieldData, setFieldData] = useState({});
  const [showToolBar, setShowToolBar] = useState(false);

  useEffect(() => {
    const newFields = [];
    Object.values(field.dataTableData.inputData).forEach((value, index) => {
      newFields.push({
        id: nanoid(16),
        ...value
      });
    });
    setFields(newFields);
  }, []);

  const validate = () => {
    fields.forEach(() => {});
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const newFields = Array.from(fields);
    const [reorderedField] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, reorderedField);

    setFields(newFields);
    setDragging(false);
  }

  const selectedIsLast = () => {
    const index = fields.findIndex((field) => field.id == selectedField);
    return index == fields.length - 1;
  };

  const selectedIsFirst = () => {
    const index = fields.findIndex((field) => field.id == selectedField);
    return index == 0;
  };

  const moveSelectedField = (direction) => {
    const index = fields.findIndex((field) => field.id == selectedField);
    const newFields = Array.from(fields);
    const [reorderedField] = newFields.splice(index, 1);
    newFields.splice(index + direction, 0, reorderedField);
    setFields(newFields);
  };

  const addColumn = () => {
    const newFields = Array.from(fields);
    newFields.push({
      id: nanoid(16),
      'Column Key': '',
      'Column Name': '',
      'Field Type': 'ShortText',
      Options: '',
      Endpoint: ''
    });
    setFields(newFields);
    setSelectedField(newFields[newFields.length - 1].id);
  };

  const onTableFieldChange = (field, value) => {
    const inputFields = {};
    fields.map((f, i) => {
      inputFields[i + 1] = {
        'Column Key': f.fieldName,
        'Column Name': f.fieldLabel,
        'Field Type': 'ShortText',
        Options: '',
        Endpoint: ''
      };
    });
  };

  useEffect(() => {
    if (selectedField) {
      onSelectedField(fields.find((field) => field.id == selectedField));
    }
  }, [selectedField]);

  return (
    <Stack
      direction="row"
      border="solid 1px #DFDFDF"
      overflow="hidden"
      borderRadius={1}
      mt={0.5}
      onMouseEnter={() => setShowToolBar(true)}
      onMouseLeave={() => setShowToolBar(false)}
      height={30}
    >
      {fields.map((field, index) => (
        <Stack
          key={index}
          onClick={() => {
            setSelectedField(field.id);
          }}
          flex={1}
          pt={0.2}
          bgcolor={
            selectedField == field.id
              ? 'primary.main'
              : index % 2 == 0
              ? '#80808020'
              : 'transparent'
          }
          color={selectedField == field.id ? '#fff' : 'text.primary'}
          px={1}
          sx={{}}
        >
          <Typography variant="subtitle" textOverflow="ellipsis">
            {field['Column Name']}
          </Typography>
        </Stack>
      ))}
      <Collapse orientation="horizontal" in={showToolBar}>
        <Stack
          direction="row"
          sx={{
            mr: 1.5,
            py: 0.5,
            px: 0.5,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px'
          }}
        >
          <Tooltip title="Add Column">
            <IconButton disabled={selected} onClick={addColumn} size="small">
              <Iconify icon="ic:round-add-circle" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Left">
            <IconButton
              disabled={selectedIsFirst() || !selectedField}
              onClick={() => moveSelectedField(-1)}
              size="small"
            >
              <Iconify icon="material-symbols:arrow-circle-left-rounded" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Right">
            <IconButton
              size="small"
              disabled={selectedIsLast() || !selectedField}
              onClick={() => moveSelectedField(1)}
            >
              <Iconify icon="material-symbols:arrow-circle-right-rounded" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Apply changes">
            <IconButton size="small" onClick={validate}>
              <Iconify icon="ion:checkmark-done-circle" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Table">
            <IconButton size="small" onClick={onDelete}>
              <Iconify icon="material-symbols:delete" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Collapse>
    </Stack>
  );
};
