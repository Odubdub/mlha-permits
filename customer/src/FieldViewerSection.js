import {
  Card,
  Collapse,
  Stack,
  IconButton,
  CardHeader,
  Box,
  Typography,
  Chip,
  filledInputClasses,
  Grid,
  Tooltip,
  Divider
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import InputField from './bundle/InputField';
import Iconify from './bundle/Iconify';
import { RequestContext } from './RequestContext';
import { LoadingButton } from '@mui/lab';

const Section = ({
  children,
  index = 0,
  error = false,
  readOnly = false,
  data,
  validated,
  isLast,
  onFieldChange,
  setData,
  viewAll,
  fields = [],
  onFieldFocus,
  errors,
  onNext,
  open = true,
  isActiveSection,
  onOpen,
  title,
  subtitle
}) => {
  const [rows, setRows] = useState([]);
  const [hasErrors, setHasErrors] = useState(false);
  const [hover, setHover] = useState(false);
  const { readOnlyForm } = useContext(RequestContext);
  const openForm = () => {
    if (!open) {
      onOpen();
    }
  };

  useEffect(() => {
    const newRows = [];
    let fieldIndex = 0;

    while (fieldIndex < fields.length) {
      const { size = 6 } = fields[fieldIndex];
      let nextFieldIndex = fieldIndex + 1;

      if (nextFieldIndex < fields.length) {
        //There is not the last field
        const { nextSize = 6 } = fields[nextFieldIndex];
        if (nextSize + size <= 12) {
          newRows.push([fields[fieldIndex], fields[nextFieldIndex]]);
          fieldIndex += 1;
        } else {
          newRows.push([fields[fieldIndex]]);
        }
      } else {
        //Last field
        newRows.push([fields[fieldIndex]]);
      }

      fieldIndex++;
    }

    setRows(newRows);
  }, [fields]);

  useEffect(() => {
    const fieldKeys = fields.map((field) => field.fieldName);
    let hasSectionErrors = false;
    Object.keys(errors).forEach((key) => {
      if (fieldKeys.includes(key)) {
        hasSectionErrors = true;
      }
    });
    setHasErrors(hasSectionErrors);
  }, [errors]);

  const getField = (field) => {
    return (
      <InputField
        field={field}
        errors={errors}
        readOnly={readOnly}
        onFieldChange={onFieldChange}
        onFieldFocus={onFieldFocus}
        fieldData={data}
        setFieldData={setData}
      />
    );
  };

  return (
    <Stack
      onClick={() => openForm()}
      bgcolor={
        readOnlyForm
          ? 'transparent'
          : viewAll && isActiveSection
          ? '#F6F6F6'
          : open && !viewAll
          ? '#f5f5f5'
          : '#fff'
      }
      sx={{
        borderRadius: 2.2,
        overflow: 'hidden',
        pr: 1
      }}
    >
      <Stack
        children={
          <Stack
            direction="row"
            height={34}
            borderRadius={2}
            sx={{
              '&:hover': { bgcolor: '#80808017' },
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer'
            }}
            onMouseEnter={() => {
              if (!readOnly) {
                setHover(true);
              }
            }}
            onMouseLeave={() => {
              if (!readOnly) {
                setHover(false);
              }
            }}
            alignItems="center"
            children={
              <>
                {!readOnly && (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: 34,
                      height: 34,
                      mr: 2,
                      borderRadius: 3,
                      bgcolor: hasErrors ? 'error.main' : 'primary.main',
                      color: '#fff'
                    }}
                    children={
                      !validated || hasErrors ? (
                        <Typography fontSize={14}>{index + 1}</Typography>
                      ) : (
                        <Iconify icon="charm:tick" />
                      )
                    }
                  />
                )}
                <Typography
                  sx={{
                    ml: readOnly ? 2 : 0,
                    color: error || hasErrors ? 'error.main' : open ? '#000' : '#808080',
                    fontSize: readOnly ? 16 : open ? 19 : 16,
                    fontWeight: 800
                  }}
                >
                  {title}
                </Typography>
                <Box flex={1} />
                {open && !readOnly && !isLast && !viewAll && (
                  <Tooltip title="Go to next section">
                    <LoadingButton
                      size="small"
                      mr={1}
                      endIcon={<Iconify icon={'material-symbols:skip-next-rounded'} />}
                      sx={{ color: 'primary.main' }}
                      aria-label="settings"
                      onClick={() => onNext()}
                    >
                      Next Section
                    </LoadingButton>
                  </Tooltip>
                )}
              </>
            }
          />
        }
        sx={{ px: 0, pt: 0 }}
      />
      <Stack direction="row">
        {!isLast && !readOnly && (
          <Box
            bgcolor={hasErrors ? 'error.main' : 'primary.main'}
            alignSelf="stretch"
            minHeight={20}
            width={4}
            ml={1.8}
          />
        )}
        <Collapse in={open} sx={{ flex: 1 }}>
          <Stack pr={4} pb={2}>
            {subtitle && !readOnly && (
              <Typography
                sx={{
                  ml: 4,
                  mb: 2,
                  color: error || hasErrors ? 'error.main' : open ? '#000' : '#808080',
                  fontSize: 14,
                  fontWeight: 400
                }}
              >
                {subtitle}
              </Typography>
            )}
            {rows.map((row, i) => {
              return row.length > 1 ? (
                <Grid key={i} container spacing={1} mx={2}>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    {getField(row[0])}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    {getField(row[1])}
                  </Grid>
                </Grid>
              ) : (
                <Grid key={i} container spacing={1} mx={2}>
                  <Grid key={i} item xs={12} sm={12} md={12} lg={12}>
                    {getField(row[0])}
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
        </Collapse>
      </Stack>
    </Stack>
  );
};

export default Section;
