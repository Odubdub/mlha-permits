import React from 'react';
import { Stack, Collapse, IconButton, Tooltip, Grow } from '@mui/material';
import Iconify from './bundle/Iconify';

export const ToolBar = ({
  isHovered,
  dragging,
  openInsertIndex,
  isOpen,
  selectField,
  field,
  cancelEditMode,
  deleteField,
  fieldHasChanges,
  saveMetadata
}) => {
  return (
    <Grow orientation="horizontal" in={isHovered && !dragging && openInsertIndex == -1}>
      <Stack
        direction="row"
        bgcolor="#fff"
        mr={1.5}
        py={0.5}
        px={0.5}
        boxShadow="rgba(0, 0, 0, 0.1) 0px 2px 4px"
        borderRadius={2}
        alignItems="center"
      >
        {!isOpen ? (
          <>
            <Tooltip title={`Edit '${field.fieldLabel}' Field`}>
              <IconButton
                size="small"
                sx={{
                  height: 30,
                  bgcolor: '#80808010',
                  color: '#808080',
                  width: 30
                }}
                onClick={() => selectField(field)}
              >
                <Iconify icon="fluent:note-edit-24-filled" />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Duplicate '${field.fieldLabel}' Field`}>
              <IconButton
                size="small"
                sx={{
                  height: 30,
                  bgcolor: '#80808010',
                  color: '#808080',
                  width: 30,
                  ml: 1
                }}
              >
                <Iconify icon="heroicons:document-duplicate-solid" />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip title={`Cancel Editing`}>
              <IconButton
                size="small"
                onClick={cancelEditMode}
                sx={{
                  height: 30,
                  color: '#ff6000',
                  width: 30
                }}
              >
                <Iconify icon="material-symbols:cancel-rounded" />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Delete Field`}>
              <IconButton
                size="small"
                onClick={deleteField}
                sx={{
                  height: 30,
                  color: 'error.main',
                  width: 30
                }}
              >
                <Iconify icon="fluent:delete-16-filled" />
              </IconButton>
            </Tooltip>
            <Tooltip title={`Done`}>
              <IconButton
                size="small"
                disabled={!fieldHasChanges()}
                onClick={saveMetadata}
                sx={{
                  height: 30,
                  color: '#00D000',
                  width: 30
                }}
              >
                <Iconify icon="ion:checkmark-done-circle" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>
    </Grow>
  );
};
