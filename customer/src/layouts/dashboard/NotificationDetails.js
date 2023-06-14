import { Card, Stack, Box, IconButton, Typography, Link, Tooltip, Divider } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import Iconify from 'src/bundle/Iconify';
import { NotificationContext } from 'src/NotificationContext';
import { storageHost } from 'src/ApiService';
import { LoadingButton } from '@mui/lab';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const NotificationDetails = ({ setDocUrl }) => {
  const { notification, setNotification } = useContext(NotificationContext);
  const [atttachment, setAttachment] = useState(null);

  const previewAtt = () => {
    setDocUrl(`${storageHost}download/${atttachment.bucket}/${atttachment.key}`);
    setNotification(null);
  };

  useEffect(() => {
    if (notification && notification.attachments && notification.attachments.length) {
      setAttachment(notification.attachments[0]);
    } else {
      setAttachment(null);
    }
  }, [notification]);

  return (
    <Stack
      height="100%"
      width="100%"
      left={0}
      top={0}
      bgcolor="#ffffffcc"
      alignItems="center"
      justifyContent="center"
      zIndex={10000}
      display={notification == null ? 'none' : null}
      position="fixed"
    >
      {notification && (
        <Card sx={{ width: 500, border: '0.5px dashed #808080', height: 450 }}>
          <Stack height={'100%'} width="100%">
            <Stack alignSelf="center" justifyContent="start" width={'100%'} flex={1}>
              <Stack mx={3} py={0.5} borderRadius={1} mb={2}>
                <Stack direction="row" mt={1.5} alignItems="center">
                  <Iconify
                    sx={{ fontSize: 24 }}
                    icon="solar:notification-unread-lines-bold-duotone"
                  />
                  <Typography fontWeight={700} fontSize={24} ml={1}>
                    Notification Details
                  </Typography>
                  <Box flex={1} />
                  <IconButton onClick={() => setNotification(null)}>
                    <Iconify icon="ic:round-close" />
                  </IconButton>
                </Stack>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <ReactMarkdown
                  children={notification.rich_text_message}
                  remarkPlugins={[remarkGfm]}
                />
              </Stack>
              <Stack px={4} mx={3}>
                {''}
              </Stack>
            </Stack>
            {atttachment && (
              <Stack
                direction="row"
                height={60}
                bgcolor="#C4C4C420"
                width={'100%'}
                justifyContent="space-between"
                position="relative"
                justifySelf="end"
                alignItems="center"
              >
                <Iconify
                  icon="heroicons:document-text-solid"
                  sx={{ transform: 'scale(1.2)', mt: 0.5, ml: 2, mr: 2 }}
                />
                <Typography>Available File</Typography>
                <Box flex={1} />
                <LoadingButton
                  onClick={previewAtt}
                  endIcon={<Iconify sx={{ color: 'primary.main' }} icon="mdi:eye" />}
                  sx={{ height: 40, mr: 1 }}
                >
                  Preview
                </LoadingButton>
                <Tooltip title={`Download this file`}>
                  <Link
                    sx={{ textDecoration: 'none', color: '#808080', fontSize: 24 }}
                    href={`${storageHost}download/${atttachment.bucket}/${atttachment.key}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LoadingButton
                      endIcon={
                        <Iconify sx={{ color: 'primary.main' }} icon="line-md:download-loop" />
                      }
                      sx={{ height: 40, mr: 1 }}
                    >
                      Download
                    </LoadingButton>
                  </Link>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};

export default NotificationDetails;
