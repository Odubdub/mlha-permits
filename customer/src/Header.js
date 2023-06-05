import { Stack, Typography, Box, Divider, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import { useContext } from 'react';
import { FieldEditorContext } from './FieldEditorContext';
import { LoadingButton } from '@mui/lab';
import Iconify from './bundle/Iconify';

export const Header = () => {
  const {
    readOnlyForm,
    startEdit,
    form,
    sections,
    setSections,
    viewAll,
    setViewAll,
    previewForm,
    setPreviewForm
  } = useContext(FieldEditorContext);

  const showForm = () => {
    setPreviewForm(true);
  };

  const editForm = () => {
    setPreviewForm(false);
  };

  return (
    <Stack px={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" pb={1}>
        <Typography variant="h6" children={'Proper Form Builder'} mb={0} gutterBottom />
        <Tooltip sx={{ ml: 2 }} title="Undo">
          <IconButton size="small">
            <Iconify icon="majesticons:undo" />
          </IconButton>
        </Tooltip>
        <Tooltip sx={{ ml: 1 }} title="Redo">
          <IconButton size="small">
            <Iconify icon="majesticons:redo" />
          </IconButton>
        </Tooltip>

        <Box flex={1} />
        {!readOnlyForm && (
          <LoadingButton
            onClick={() => setViewAll(!viewAll)}
            startIcon={
              <Iconify
                sx={{ ml: 1 }}
                icon={viewAll ? 'uis:window-section' : 'ic:round-clear-all'}
              />
            }
          >
            {' View ' + (viewAll ? 'Sectioned' : 'All')}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => {}}
          startIcon={<Iconify sx={{ ml: 1 }} icon={'ic:round-notifications'} />}
        >
          Notifications
        </LoadingButton>
        <LoadingButton
          onClick={previewForm ? editForm : showForm}
          startIcon={
            <Iconify
              sx={{ ml: 1 }}
              icon={previewForm ? 'akar-icons:edit' : 'ic:baseline-remove-red-eye'}
            />
          }
        >
          {previewForm ? 'Edit Form' : 'Preview Form'}
        </LoadingButton>
        <LoadingButton
          onClick={startEdit}
          startIcon={<Iconify sx={{ ml: 1 }} icon="material-symbols:file-copy-rounded" />}
        >
          {'New Form'}
        </LoadingButton>
      </Stack>
      <Divider sx={{ mt: 1, mb: 0 }} />
    </Stack>
  );
};
