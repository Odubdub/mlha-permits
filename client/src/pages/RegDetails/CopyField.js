import { LoadingButton } from '@mui/lab';
import { IconButton, Stack, Typography, Tooltip } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import Iconify from 'src/components/Iconify';
import { CopyContext } from './CopyContext';

function CopyField({ text, title }) {
  const { copiedText, setCopiedText } = useContext(CopyContext);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
  };
  useEffect(() => {
    // Check if the clipboard text has changed
    navigator.clipboard.readText().then((text) => {
      if (text !== copiedText) {
        setCopiedText(text);
      } else {
      }
    });
  }, [copiedText]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        border: 'dashed 1px',
        px: 1,
        py: 0.3,
        borderRadius: 1,
        borderColor: '#D2D2D2'
      }}
    >
      <Typography variant="h6" fontWeight={400} color="text" mr={2}>
        {text}
      </Typography>
      <Tooltip title={`Copy '${title}'`}>
        <IconButton size="medium" sx={{}} onClick={copy}>
          <Iconify
            icon={
              text == copiedText
                ? 'fluent:clipboard-checkmark-20-filled'
                : 'material-symbols:content-copy-rounded'
            }
          />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default CopyField;
