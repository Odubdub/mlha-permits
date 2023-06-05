import React, { useState } from 'react';
import Section from './bundle/Section';
import {
  Box,
  Button,
  FormControl,
  Select,
  InputLabel,
  OutlinedInput,
  MenuItem,
  ListItemText,
  Divider,
  Grid,
  Stack
} from '@mui/material';
import { SectionMode } from './SectionMode';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export const ServiceDebug = ({
  data,
  editable,
  openable,
  error,
  setData,
  fields = {},
  setFields,
  onOpen,
  handleCheckChange,
  openSection,
  handleDataChange,
  isLoading,
  errors
}) => {
  const section = SectionMode.Delivery;
  const isDisabled = !editable || isLoading;

  return (
    <Section title="Delivery" error={error} open={true}>
      <FormControl fullWidth>
        <Box display="flex" flexDirection="row" mx={4} my={2}>
          <Stack direction="row" mr={1} flex={1}>
            <Stack flex={1} ml={1}>
              <FormControl>
                <InputLabel
                  id="demo-multiple-checkbox-label"
                  error={errors.tag}
                  mt={2}
                  bgcolor="#fff"
                  width={5}
                ></InputLabel>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={data.tag ? [data.tag] : []}
                  disabled={isDisabled}
                  name="tag"
                  error={errors.tag}
                  onChange={handleDataChange}
                  input={<OutlinedInput label="tag" />}
                >
                  {['cpms'].map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText ml={2} primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Box ml={2}>
              <Button
                disabled={isDisabled || data._id == null}
                sx={{ bgcolor: 'primary.main', color: '#fff' }}
                target="blank"
                href={`https://formbuilder-demo-18ead.web.app/?id=${data._id}`}
              >
                Clone
              </Button>
            </Box>
          </Stack>
        </Box>
      </FormControl>
    </Section>
  );
};
