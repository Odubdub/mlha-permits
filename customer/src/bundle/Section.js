import { Box, Collapse, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FieldTypes } from './constants';
import { getFieldValue } from './DataTransformer';
import Iconify from './Iconify';
import InputField from './InputField';
import { sanitizeForm } from './sanitize';
import SectionMiddleIndexBg from './SectionMiddleIndex';
import SectionIndexTop from './SectionTopIndex';
import TableFieldViewer from './TableFieldViewer';

const Section = ({
  singleSection = false,
  index = 0,
  error = false,
  readOnly = false,
  data,
  isLast,
  sectionErrors = {},
  hideLeftBar = false,
  showDetailed = true,
  getOverridableDependants,
  setData,
  autoPopulated,
  setAutoPopulated,
  fields = [],
  isEditorSection,
  onFieldBlur,
  onFieldFocus,
  editingState,
  onValidate,
  hiddenFields = [],
  editor = {},
  errors,
  setErrors,
  hasErrors = false,
  onNext,
  open = true,
  onOpen,
  title,
  subtitle,
  description
}) => {
  const sectionRef = useRef(null);
  const [rows, setRows] = useState([]);
  const fieldsContainerRef = useRef(null);

  // const [hasErrors, setHasErrors] = useState(false);
  const [hover, setHover] = useState(false);
  const diameter = 40;

  const openForm = () => {
    if (!open) {
      onOpen();
    }
  };

  const generateGridRows = (fields, componentWidth) => {
    const rows = [];
    let currentRow = [];
    let currentRowSize = 0;
    let maxRowSize = 12;
    let maxFieldsPerRow = 6;

    fields.forEach((field) => {
      if (componentWidth < 500) {
        field.renderedSize = getFieldValue({
          data: field,
          path: 'breakpoints.xs',
          defaultValue: 12
        });
      } else if (componentWidth < 700) {
        field.renderedSize = getFieldValue({
          data: field,
          path: 'breakpoints.sm',
          defaultValue: 12
        });
      } else if (componentWidth < 900) {
        field.renderedSize = getFieldValue({
          data: field,
          path: 'breakpoints.md',
          defaultValue: 6
        });
      } else {
        field.renderedSize = getFieldValue({
          data: field,
          path: 'breakpoints.lg',
          defaultValue: 6
        });
      }
    });

    // Loop through each field metadata
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      const fieldSize = getFieldSize(field);

      // If adding this field to the current row would exceed the max row size,
      // start a new row and add the current field to it
      if (currentRowSize + fieldSize > maxRowSize || currentRow.length === maxFieldsPerRow) {
        if (currentRowSize < maxRowSize && currentRow.length < maxFieldsPerRow) {
          const remainingSize = maxRowSize - currentRowSize;

          // If there is a previous field, add the remaining size to it
          if (currentRow[currentRow.length - 1]) {
            currentRow[currentRow.length - 1].renderedSize += remainingSize;
          }
          // Otherwise, add the remaining size to the current field
          else {
            field.renderedSize += remainingSize;
          }
        }
        rows.push(currentRow);
        currentRow = [field];
        currentRowSize = fieldSize;
      }
      // Otherwise, add the current field to the current row
      else {
        currentRow.push(field);
        currentRowSize += fieldSize;
      }
    }

    // Add the final row to the rows array
    if (currentRow.length > 0) {
      const remainingSize = maxRowSize - currentRowSize;
      // If there is a previous field, add the remaining size to it
      if (currentRow[currentRow.length - 1]) {
        currentRow[currentRow.length - 1].renderedSize += remainingSize;
      }
      // Otherwise, add the remaining size to the current field
      else {
        currentRow[currentRow.length - 1].renderedSize += remainingSize;
      }
      rows.push(currentRow);
    }

    return rows;
  };

  const getFieldSize = (field) => {
    // Determine the size of the field based on its metadata
    if (field.fieldType == FieldTypes.DataTable) {
      return 12;
    }

    // You can customize this function to fit your specific requirements
    if (field.renderedSize && field.renderedSize > 0 && field.renderedSize <= 12) {
      return field.renderedSize;
    }

    return 6; // default size is 6
  };

  const getMinFieldsHeight = () => {
    return (fieldsContainerRef.current || {}).offsetWidth || '100%';
  };

  useEffect(() => {
    if (!open) return;

    // Call the generateRows function with the current component width
    const componentWidth = sectionRef.current.offsetWidth;
    const sanitizedFields = sanitizeForm(fields);
    const fieldsToShow = sanitizedFields.filter((field) => !hiddenFields.includes(field.fieldName));
    const rows = generateGridRows(fieldsToShow, componentWidth);
    setRows(rows);

    // Add an event listener to recalculate the rows when the component width changes
    const handleResize = () => {
      const componentWidth = (sectionRef.current || {}).offsetWidth;
      // console.log('componentWidth', componentWidth);
      const rows = generateGridRows(fieldsToShow, componentWidth);
      setRows(rows);
    };

    window.addEventListener('resize', handleResize);

    // Remove the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [fields, hiddenFields, open]);

  const red = '#FF0000';
  const blue = '#00E0FF';

  const getHoverColor = () => {
    if (hasErrors && open) {
      return 'error.dark';
    } else if (open) {
      return 'primary.dark';
    } else if (hover) {
      return hasErrors ? red + 'cc' : blue + 'cc';
    } else {
      return hasErrors ? red + 20 : blue + 20;
    }
  };

  const getTextColor = () => {
    return hasErrors ? red : blue;
  };

  const getTitleTextColor = () => {
    if (open && hasErrors) {
      return '#fff';
    } else if (open) {
      return '#fff';
    } else if (hasErrors) {
      return 'error.main';
    }

    return 'text.primary';
  };

  const getIndexTextColor = () => {
    if (!open) {
      return '#fff';
    } else if (hasErrors) {
      return 'error.main';
    }

    return 'primary.main';
  };

  const getBgGrad = () => {
    return `linear-gradient(${hasErrors ? red : blue}, ${sectionErrors[index + 1] ? red : blue})`;
  };

  return (
    <Stack px={2} ref={sectionRef} onClick={() => openForm()}>
      {

        !singleSection &&
        <Stack
        children={
          <Stack
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            direction="row"
            height={diameter}
            borderRadius={diameter}
            sx={{
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              backgroundColor: getHoverColor(),
              color: hover ? '#fff' : 'text.primary'
            }}
            alignItems="center"
            children={
              <>
                {!readOnly && !hideLeftBar && (
                  <Stack
                    alignItems="center"
                    position="relative"
                    alignSelf="stretch"
                    ml={0.6}
                    maxHeight={42}
                    width={30}
                  >
                    <Stack sx={{ mt: index == 0 ? 0.6 : 0 }}>
                      {index == 0 ? (
                        <SectionIndexTop color={getTextColor()} />
                      ) : (
                        <SectionMiddleIndexBg color={getTextColor()} />
                      )}
                      <Typography
                        sx={{
                          zIndex: 100,
                          position: 'absolute',
                          width: 24,
                          height: 24,
                          mt: index == 0 ? 0.37 : 1.1,
                          ml: 0.39,
                          pt: 0.4,
                          borderRadius: 20,
                          bgcolor: open ? '#fff' : 'transparent',
                          color: getIndexTextColor(),
                          fontSize: 12,
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
                {showDetailed && (
                  <Typography
                    sx={{
                      ml: readOnly ? 2 : hideLeftBar ? 1 : 1,
                      transition: 'all 0.3s ease-in-out',
                      color: hover ? '#fff' : getTitleTextColor(),
                      fontSize: readOnly ? 16 : open ? 17 : 16,
                      fontWeight: open ? 800 : 600
                    }}
                  >
                    {title}
                  </Typography>
                )}
                <Box flex={1} />
                {open && !readOnly && (
                  <Tooltip title="Go to next section">
                    <IconButton
                      sx={{ color: getTitleTextColor() }}
                      aria-label="settings"
                      onClick={() => onNext()}
                    >
                      <Iconify icon={'material-symbols:skip-next-rounded'} />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            }
          />
        }
        sx={{ px: 0, pt: 0 }}
      />
      }

      <Stack direction="row">
        {
          !singleSection &&
          <Stack width={36} minHeight={40}>
          <Box
            alignSelf="stretch"
            width={4}
            height="100%"
            ml={2.2}
            sx={{ backgroundImage: getBgGrad(), borderRadius: isLast ? '0px 0px 5px 5px' : null }}
          />
        </Stack>}
        <Stack direction="row" flex={1}>
          <Stack flex={1}>
            {(subtitle || description) && !readOnly && showDetailed && (
              <Typography
                sx={{
                  ml: 1,
                  mt: 1,
                  color: error || hasErrors ? 'error.main' : open ? '#000' : '#808080',
                  fontSize: 14,
                  fontWeight: 400
                }}
              >
                {subtitle || description}
              </Typography>
            )}
            <Collapse
              in={true}
              sx={{
                flex: 1,
                ml: 0,
                maxHeight: open ? 1000 : 0,
                transition: 'all 0.3s ease-in-out',
                overflow: 'hidden'
              }}
            >
              <Stack ref={fieldsContainerRef} pr={4} pb={2}>
                {open && (
                  <>
                    {rows.length == 0 ? (
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: 14,
                          width: '100%',
                          fontWeight: 400,
                          ml: 4,
                          mb: 2
                        }}
                      >
                        No fields to display
                      </Typography>
                    ) : (
                      <>
                        {rows.map((row, i) => (
                          // Use the first field as a key
                          <Grid key={i} container spacing={1} mr={2} mt={0.8} ml={0}>
                            {
                              // Render each field in the row
                              row.map((field, j) => {
                                return (
                                  <Grid
                                    key={field.fieldName}
                                    item
                                    xs={field.renderedSize}
                                    sm={field.renderedSize}
                                    md={field.renderedSize}
                                    lg={field.renderedSize}
                                  >
                                    {field.fieldType == FieldTypes.DataTable ? (
                                      <TableFieldViewer
                                        field={field}
                                        errors={errors}
                                        readOnly={readOnly}
                                        isEditorField={isEditorSection}
                                        editingState={editingState}
                                        autoPopulated={autoPopulated}
                                        setAutoPopulated={setAutoPopulated}
                                        editor={editor}
                                        setErrors={setErrors}
                                        onFieldBlur={onFieldBlur}
                                        onFieldFocus={onFieldFocus}
                                        onValidate={onValidate}
                                        getOverridableDependants={getOverridableDependants}
                                        data={data}
                                        setData={setData}
                                      />
                                    ) : (
                                      <InputField
                                        field={field}
                                        errors={errors}
                                        editingState={editingState}
                                        editor={editor}
                                        onFieldBlur={onFieldBlur}
                                        autoPopulated={autoPopulated}
                                        setAutoPopulated={setAutoPopulated}
                                        onFieldFocus={onFieldFocus}
                                        readOnly={readOnly}
                                        onValidate={onValidate}
                                        isEditorField={isEditorSection}
                                        getOverridableDependants={getOverridableDependants}
                                        setErrors={setErrors}
                                        fieldData={data}
                                        setFieldData={setData}
                                      />
                                    )}
                                  </Grid>
                                );
                              })
                            }
                          </Grid>
                        ))}
                      </>
                    )}
                  </>
                )}
              </Stack>
            </Collapse>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Section;

