import {
  Box,
  Divider,
  IconButton,
  List,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { getFromServer, postToServer } from 'src/ApiService';
import Iconify from 'src/components/Iconify';
import { fDate, fTime, fToNow } from 'src/utils/formatTime';

const style = {
  margin: 0,
  top: 1,
  right: 0,
  bottom: 1,
  width: 550,
  borderRadius: 2,
  zIndex: 200,
  position: 'fixed',
  backdropFilter: 'blur(20px)',
  backgroundColor: 'rgba(256,256,256)',
  borderStyle: 'dotted',
  borderWidth: '1px',
  boxShadow: 24,
  margin: 1,
  padding: 1,
  transition: 'all ease 0.3s'
};

function Messages({ author, show, onThreadUnread, onHide }) {
  const [message, setMessage] = useState('');

  const [refresh, setRefresh] = useState(0);
  const [selectedThread, setSelecetedThread] = useState(null);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleClick = (e) => {
    getNewMessages();
    e.stopPropagation();
  };

  const getNewMessages = () => {
    getFromServer({
      path: `queries/thread-by-user/${author.idNo}`,
      onComplete: (response) => {
        if ((response.thread || {}).read == false) {
          onThreadUnread(true);
        } else {
          onThreadUnread(false);
        }
        //
        setSelecetedThread({ ...response.thread, messages: response.messages });
        if ((response.messages || []).length && !selectedMessage) {
          setSelectedMessage(response.messages[response.messages.length - 1]._id);
        }
      },
      onError: (err) => {}
    });
  };

  const sendMessage = () => {
    const lastMessage = selectedThread.messages[selectedThread.messages.length - 1];
    postToServer({
      path: `queries/threads/${selectedThread._id}`,
      params: {
        messageId: lastMessage.messageId,
        subject: lastMessage.subject,
        message: message,
        status: 0,
        label: lastMessage.label,
        category: 'Query'
      },
      onComplete: (d) => {
        setMessage('');
      }
    });
  };

  useEffect(() => {
    getNewMessages();

    const interval = setInterval(() => {
      getNewMessages();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stack
      sx={{ ...style, height: show ? 'calc(100vh - 20px)' : '55px', right: show ? 5 : -600 }}
      flex={1}
      onClick={handleClick}
    >
      {
        <Stack
          direction={'row'}
          onClick={() => setRefresh(refresh + 1)}
          alignItems="center"
          justifyContent="start"
        >
          <Tooltip title="Close Support">
            <IconButton onClick={() => onHide()}>
              <Iconify icon="material-symbols:close-rounded" />
            </IconButton>
          </Tooltip>
          <Typography alignSelf="start" fontWeight={900} mt={0.5} fontSize={20}>
            {`${author.foreNames} ${author.lastName}'s queries`}
          </Typography>
          <Box flex={1} />
        </Stack>
      }
      <Divider />
      {selectedThread && (selectedThread.messages || []).length ? (
        <Stack flex="1">
          <Stack flex="1">
            <Paper style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
              <List mb={4}>
                <Stack mb={8}>
                  {selectedThread.messages.map((message, i) => (
                    <Stack
                      onClick={() => setSelectedMessage(message._id)}
                      key={i}
                      direction="row"
                      mx={1}
                      mt={0.5}
                    >
                      {message.sender && <Box flex={1} />}
                      <Stack alignItems={!message.sender ? 'start' : 'end'}>
                        <Stack direction="row" alignItems="center">
                          <Typography
                            sx={{
                              bgcolor: !message.sender ? '#8080805F' : 'primary.main',
                              borderRadius: 1.5,
                              px: 2,
                              py: 0.5
                            }}
                          >
                            {message.message}
                          </Typography>
                          <Typography ml={1} variant="caption">
                            {fTime(message.updatedAt)}
                          </Typography>
                        </Stack>
                        <Stack
                          sx={{
                            maxHeight: selectedMessage == message._id ? 60 : 0,
                            overflow: 'hidden',
                            transition: 'all ease 0.5s'
                          }}
                        >
                          {message.sender ? (
                            <Stack direction="row" mt={1} justifyContent="end" mr={5}>
                              <Stack alignItems="end">
                                <Typography
                                  variant="subtitle"
                                  sx={{ fontSize: 12, fontWeight: 600 }}
                                >
                                  {message.sender.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: 12, fontWeight: 400 }}
                                >
                                  {`${fDate(message.createdAt)}・${fToNow(message.createdAt)}`}
                                </Typography>
                              </Stack>
                              <Box
                                height="40px"
                                ml={1}
                                bgcolor={'primary.main'}
                                sx={{ width: 4, borderRadius: 2 }}
                              />
                            </Stack>
                          ) : (
                            <Stack direction="row" mt={1} justifyContent="start">
                              <Box
                                height="40px"
                                mr={1}
                                bgcolor={'primary.main'}
                                sx={{ width: 4, borderRadius: 2 }}
                              />
                              <Stack>
                                <Typography
                                  variant="subtitle"
                                  sx={{ fontSize: 12, fontWeight: 600 }}
                                >
                                  {message.category.toUpperCase()}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ fontSize: 12, fontWeight: 400 }}
                                >
                                  {`${fDate(message.createdAt)}・${fToNow(message.createdAt)}`}
                                </Typography>
                              </Stack>
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                      {!message.sender && <Box flex={1} />}
                    </Stack>
                  ))}
                </Stack>
              </List>
            </Paper>
          </Stack>
          <Stack direction="row">
            <TextField
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              maxRows={3}
              fullWidth
            />
            <IconButton
              size="medium"
              sx={{ color: 'primary.main' }}
              onClick={sendMessage}
              disabled={message.length == 0}
            >
              <Iconify icon="ic:round-send" />
            </IconButton>
          </Stack>
        </Stack>
      ) : (
        <Stack flex={1} justifyContent={'center'}>
          <Stack alignItems="center" justifyContent="center">
            <Typography variant="h6">No Queries or Complaints</Typography>
            <Typography variant="h6" color="#808080">
              {'From ' + author.foreNames}
            </Typography>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

export default Messages;
