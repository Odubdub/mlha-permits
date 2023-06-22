import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Checkbox, Collapse, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import InputField from './InputField';
import { LoadingButton } from '@mui/lab';
import Iconify from './Iconify';
import { nanoid } from 'nanoid';
import { Box } from '@mui/system';
import { getDependancyField } from './FieldFormValidator';
import { validateField } from './validator';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {},
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

export default function TableFieldViewer({
  field,
  errors = {},
  readOnly,
  data,
  setData,
  files,
  setFiles,
  autoPopulated,
  setAutoPopulated,
  // onValidate,
  onFieldBlur,
  // showToolBar,
  // toolBar,
  onFieldFocus,
  // form,
  // setForm,
  getOverridableDependants,
  setErrors,
  // editMode = false,
  isEditorField = false, //Is this field in the editor
  editingState,
  // onDelete,
  // isOpen,
  // onCancel,
  // selectedColumn = {},
  // onSelectedSubfield,
  editor = {}
}) {
  // 'dataTableData.isLimited',
  // 'dataTableData.description',
  // 'dataTableData.limit'

  // console.log(data[field.fieldName]);

  const {
    showToolBar,
    selectedColumn = {},
    onSelectedSubfield,
    editMode = false,
    onValidate,
    isOpen,
    setForm,
    form,
    isHovered,
    onCancel,
    onDelete,
    toolBar
  } = editor;

  const { description = '', fieldLabel = '', fieldName, isLimited, limit } = field;

  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [rows, setRows] = useState(data[fieldName] || []);
  const [tableErrors, setTableErrors] = useState([]);
  const fields = field.fields || [];

  const [fieldBeforeEdits, setFieldBeforeEdits] = useState(null);

  const toggleSeletedIndexes = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const selectAll = () => {
    if (selectedIndexes.length == rows.length) {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(rows.map((r, i) => i));
    }
  };

  const addRow = () => {
    setRows([...rows, {}]);
  };

  const deleteRows = () => {
    const newRows = rows.filter((r, i) => !selectedIndexes.includes(i));

    if (newRows.length == 0) {
      addRow();
    } else {
      setData({ ...data, [fieldName]: newRows });
      setSelectedIndexes([]);
    }
  };

  const selectedIsLast = () => {
    if (!selectedColumn || !Object.keys(selectedColumn).length) return false;
    const index = fields.findIndex((field) => field.id == selectedColumn.id);
    return index == fields.length - 1;
  };

  const selectedIsFirst = () => {
    if (!selectedColumn || !Object.keys(selectedColumn).length) return false;
    const index = fields.findIndex((field) => field.id == selectedColumn.id);
    return index == 0;
  };

  const moveSelectedField = (direction) => {
    const newForm = [...form];
    const index = newForm.findIndex((f) => f.id == field.id);
    const subfields = newForm[index].fields;

    const subfieldIndex = subfields.findIndex((sf) => sf.id == selectedColumn.id);

    swapItems(subfields, direction, subfieldIndex);

    setForm(newForm);
  };

  const swapItems = (array, direction, index) => {
    if (direction === -1 && index > 0) {
      [array[index], array[index - 1]] = [array[index - 1], array[index]];
    } else if (direction === 1 && index < array.length - 1) {
      [array[index], array[index + 1]] = [array[index + 1], array[index]];
    }
  };

  const addColumn = () => {
    const newForm = [...form];
    const index = newForm.findIndex((f) => f.id == field.id);
    const newField = {
      id: nanoid(16),
      'Column Key': `Column ${newForm[index].fields.length + 1}`,
      'Column Label': `Column ${newForm[index].fields.length + 1}`,
      'Column Type': 'ShortText',
      'Column Mandatory': false
    };
    newForm[index].fields.push(newField);
    setForm(newForm);
    onSelectedSubfield(newField);
  };

  const deleteColumn = () => {
    const newForm = [...form];
    const fieldIndex = newForm.findIndex((f) => f.id == field.id);
    console.log(newForm[fieldIndex]);
    // console.log(newForm[fieldIndex].fields.length);

    newForm[fieldIndex].fields = fields.filter((f) => f.id != selectedColumn.id);
    console.log(newForm[fieldIndex].fields.length);
    setForm(newForm);
  };

  const validate = () => {
    fields.forEach(() => {});
  };

  const selectField = (subField) => {
    if (isOpen) {
      onSelectedSubfield(subField);
    }
  };

  const getSubfield = (subfield, rowData) => {
    if (isEditorField && field.fieldName == 'dependancies') {
      return getDependancyField({ subfield, rowData, editingState, dependancies: rows });
    } else {
      return subfield;
    }
  };

  const cancelEditing = () => {
    const newForm = [...form];
    let thisFieldIndex = newForm.findIndex((f) => f.id == field.id);
    newForm.splice(thisFieldIndex, 1, fieldBeforeEdits);

    setForm(newForm);
    onCancel();
  };

  const validateTable = () => {
    const tableErrs = [];
    rows.forEach((row) => {
      const validation = validateRow(row);
      tableErrs.push(validation);
    });

    setTableErrors(tableErrs);
  };

  const validateRow = (row) => {
    const errs = {};
    fields.forEach((field) => {
      // Validate field based on dependencies
      const validity = validateField(field, row);
      if (!validity.isValid) {
        errs[field.fieldName] = true;
      } else {
        errs[field.fieldName] = false;
      }
    });

    return errs;
  };

  const updateRowValidity = (rowData, rowIndex) => {
    let newRow = { ...rowData };
    const validity = validateRow(newRow);

    const tableErrs = [...tableErrors];
    tableErrs[rowIndex] = validity;

    setTableErrors(tableErrs);
  };

  const onSubfieldBlur = (rowIndex) => {
    const rowData = rows[rowIndex];
    updateRowValidity(rowData, rowIndex);
    onValidate();
  };

  const setDataForIndex = (row, index, fieldName) => {
    const newRows = [...rows];
    let newRow = { ...row };

    // Override this if this is the dependancy editor
    if (isEditorField) {
      if (fieldName == 'field') {
        newRow = {};
        newRow['field'] = row.field;
      } else if (fieldName == 'target' && newRow.targetValue) {
        delete newRow.targetValue;
      }
    }

    newRows[index] = newRow;
    setRows(newRows);
  };

  const getUpdatedFormDataWithRows = (newRows) => {
    const keys = field.fieldName.split('.');
    let obj = { ...data };
    let ref = obj;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        ref[keys[i]] = newRows;
      } else {
        if (!ref[keys[i]]) {
          ref[keys[i]] = {};
        }
        ref = ref[keys[i]];
      }
    }

    return ref;
  };

  useEffect(() => {
    if (rows.length == 0 && field.mandatory) {
      addRow();
    }
    validateTable();
  }, [rows.length]);

  useEffect(() => {
    const hasSelectedColumn = fields.some((subField) => subField.id == selectedColumn.id);
    if (isOpen && !hasSelectedColumn) {
      if (fields.length > 0) {
        onSelectedSubfield(fields[0]);
      }
    }
  }, [isOpen, fields]);

  useEffect(() => {
    if (isOpen) {
      setFieldBeforeEdits({
        ...field,
        fields: [...field.fields],
        dataTableData: { ...field.dataTableData }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const update = getUpdatedFormDataWithRows(rows);
    setData(update);
  }, [rows]);

  return (
    <Stack mb={1} sx={{ position: 'relative' }}>
      {editMode && (
        <Collapse
          sx={{
            alignSelf: 'end',
            marginTop: 2,
            zIndex: 2,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'end',
            transform: 'translate(0px, -10px)'
          }}
          in={showToolBar || isOpen}
          orientation="horizontal"
        >
          {isOpen ? (
            <Stack
              direction="row"
              sx={{
                mr: 0,
                py: 0.5,
                px: 0.5,
                ml: 0.5,
                bgcolor: '#fff',
                borderRadius: 2,
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px'
              }}
            >
              <Tooltip title="Add Column">
                <IconButton
                  onClick={addColumn}
                  size="small"
                  sx={{
                    height: 30,
                    bgcolor: '#80808010',
                    color: '#808080',
                    width: 30
                  }}
                >
                  <Iconify icon="ic:round-add-circle" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Left">
                <IconButton
                  disabled={selectedIsFirst()}
                  onClick={() => moveSelectedField(-1)}
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: '#808080',
                    width: 30
                  }}
                >
                  <Iconify icon="material-symbols:arrow-circle-left-rounded" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Right">
                <IconButton
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: '#808080',
                    width: 30
                  }}
                  disabled={selectedIsLast()}
                  onClick={() => moveSelectedField(1)}
                >
                  <Iconify icon="material-symbols:arrow-circle-right-rounded" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Apply changes">
                <IconButton
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: '#808080',
                    width: 30
                  }}
                  onClick={validate}
                >
                  <Iconify icon="ion:checkmark-done-circle" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel Editing">
                <IconButton
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: 'error.main',
                    width: 30
                  }}
                  onClick={cancelEditing}
                >
                  <Iconify icon="material-symbols:cancel-rounded" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Column">
                <IconButton
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: 'error.main',
                    width: 30
                  }}
                  onClick={deleteColumn}
                >
                  <Iconify icon="material-symbols:delete" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Field">
                <IconButton
                  size="small"
                  sx={{
                    height: 30,
                    ml: 0.5,
                    bgcolor: '#80808010',
                    color: 'error.main',
                    width: 30
                  }}
                  onClick={onDelete}
                >
                  <Iconify icon="material-symbols:delete" />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            toolBar
          )}
        </Collapse>
      )}
      <Stack
        sx={{
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box>
          <Typography
            sx={{
              ml: 1,
              px: 0.5,
              color: '#808080',
              transform: 'translate(0,10px)',
              alignSelf: 'left',
              borderRadius: 0.7,
              fontSize: 12,
              display: 'inline-block',
              bgcolor: '#fff'
            }}
          >
            {fieldLabel}
          </Typography>
        </Box>
        <Stack
          border={`1px solid ${errors[field.fieldName] ? 'red' : '#80808040'}`}
          borderRadius={1}
        >
          <TableContainer component={Paper}>
            <Table aria-label="customized table">
              <caption style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption">{description}</Typography>
                  {(!field.dataTableData.isLimited ||
                    (field.dataTableData.isLimited && rows.length < field.dataTableData.limit)) && (
                    <Tooltip title="Add row">
                      <IconButton size="medium" onClick={addRow}>
                        <Iconify icon="ic:baseline-add" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </caption>
              <TableHead>
                <TableRow>
                  {!editMode && !isOpen && (
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        onClick={() => selectAll()}
                        checked={selectedIndexes.length == rows.length}
                        inputProps={{}}
                      />
                    </StyledTableCell>
                  )}
                  {fields.map((subfield, i) => {
                    const isSelectedColumn = subfield.id == selectedColumn.id;

                    return (
                      <StyledTableCell
                        onClick={() => selectField(subfield)}
                        key={i}
                        sx={{
                          border: 0,
                          px: 1,
                          py: 1,
                          bgcolor: isSelectedColumn
                            ? 'primary.main'
                            : i % 2 == 0
                            ? '#fff'
                            : '#80808020',
                          color: isSelectedColumn ? '#fff' : 'text.primary'
                        }}
                        align={'left'}
                      >
                        {subfield['Column Name']}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <StyledTableRow sx={{ border: 0, px: 0, py: 0 }} key={rowIndex}>
                    {!editMode && !isOpen && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          onClick={() => toggleSeletedIndexes(rowIndex)}
                          checked={selectedIndexes.includes(rowIndex)}
                          inputProps={{}}
                        />
                      </TableCell>
                    )}
                    {fields.map((subfield, index) => {
                      const isSelectedColumn = subfield.id == selectedColumn.id;
                      const subField = getSubfield(subfield, rows[rowIndex]);

                      return (
                        <StyledTableCell
                          key={index}
                          sx={{ border: 0, px: 1, py: 0 }}
                          align={'left'}
                        >
                          <InputField
                            field={subField}
                            errors={tableErrors[rowIndex]}
                            outlined={false}
                            autoPopulated={{}}
                            setAutoPopulated={setAutoPopulated}
                            getOverridableDependants={getOverridableDependants}
                            smallSize={true}
                            readOnly={readOnly}
                            onValidate={(rowData) => updateRowValidity(rowData, rowIndex)}
                            isDisabled={isOpen ? !isSelectedColumn : false}
                            opacity={isOpen && !isSelectedColumn ? 0.3 : 1}
                            tableMode={true}
                            onFieldBlur={() => onSubfieldBlur(index)}
                            onFieldFocus={onFieldFocus}
                            fieldData={row}
                            setErrors={setErrors}
                            setFieldData={(rowData) =>
                              setDataForIndex(rowData, rowIndex, subfield.fieldName)
                            }
                          />
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        {selectedIndexes.length > 0 && (
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="caption">{selectedIndexes.length} rows selected</Typography>

            <Stack direction="row">
              <LoadingButton startIcon={<Iconify icon="ic:round-close" />}>Clear</LoadingButton>
              {data[fieldName].length > 1 && rows.length != selectedIndexes.length && (
                <LoadingButton
                  color="error"
                  onClick={deleteRows}
                  startIcon={<Iconify icon="material-symbols:delete-outline" />}
                >
                  Delete
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
