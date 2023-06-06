import { LoadingButton } from '@mui/lab';

import {
  Box,
  Chip,
  Divider,
  IconButton,
  List,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useState, useRef, useEffect } from 'react';
import { getFromServer, patch, postToServer, socket } from 'src/ApiService';
import Iconify from 'src/components/Iconify';
import { fDateTime, fDate, fTime, fToNow } from 'src/utils/formatTime';

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
  boxShadow: 24,
  margin: 1,
  padding: 1,
  transition: 'all ease 0.3s'
};

function Threads({ show, onShow, onOpenApplications, onHide }) {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const thredRef = useRef(null);

  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [refresh, setRefresh] = useState(0);
  const [selectedThread, setSelectedThread] = useState(null);
  const handleClick = (e) => {
    onShow();
    e.stopPropagation();
  };

  const handleHide = (e) => {
    onHide();
    e.stopPropagation();
  };

  const getThreads = () => {
    getFromServer({
      path: 'queries',
      onComplete: (queries) => {
        // console.log(queries)
        setThreads(queries);
      },
      onError: (err) => {}
    });
  };

  const sendMessage = () => {
    const lastMessage = messages[messages.length - 1];
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

  const onOpenApplicationsByApplicant = () => {
    if (selectedThread.userId) {
      onOpenApplications(selectedThread.userId);
      setMenuOpen(false);
    }
  };

  const close = () => {
    patch({
      path: `queries/threads/${selectedThread._id}/close`,
      params: {},
      onComplete: (_) => {
        setSelectedThread(null);
      },
      onError: (err) => console.log(err)
    });
  };

  const limit = (str = '') => {
    if (str.length > 50) {
      return str.slice(0, 50);
    }

    return str;
  };

  var isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);

  useEffect(() => {
    const setThrds = (thrds) => {
      setThreads(thrds);
      console.log('threads', thrds);
    };
    socket.on('threads', setThrds);

    return () => {
      socket.off('threads', setThrds);
    };
  }, []);

  useEffect(() => {
    // Add listener to channel
    const setMsgs = (msgs) => {
      if (!selectedThread) {
        console.log('cleared messages');
        selectedMessage(null);
        setMessages([]);
        thredRef.current = null;
      } else {
        // selectedThread && messages.length && msgs.length != messages.length
        setMessages(msgs);
        console.log('selected messages');
        thredRef.current = selectedThread._id;
        if (!selectedMessage) {
          setSelectedMessage(msgs[messages.length - 1]._id);
        }
      }
    };

    if (selectedThread) {
      socket.on(selectedThread._id, setMsgs);
    } else {
      socket.off(thredRef.current, setMsgs);
    }

    // Remove listener from channel when component unmounts
    return () => {
      socket.off(thredRef.current, setMsgs);
    };
  }, [selectedThread]);

  return (
    <Stack
      sx={{ ...style, height: show ? 'calc(100vh - 20px)' : '55px', right: show ? -20 : -600 }}
      flex={1}
      onClick={handleClick}
    >
      {!selectedThread ? (
        <Stack
          direction={'row'}
          onClick={() => setRefresh(refresh + 1)}
          alignItems="center"
          justifyContent="start"
        >
          {!show ? (
            <Tooltip title="Show application messages">
              <IconButton onClick={handleClick}>
                <Iconify icon="fluent:history-24-filled" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Close Support">
              <IconButton onClick={handleHide}>
                <Iconify icon="ic:round-close" />
              </IconButton>
            </Tooltip>
          )}
          <Typography alignSelf="start" fontWeight={900} mt={0.5} fontSize={20}>
            Support
          </Typography>
          <Box flex="1" />
        </Stack>
      ) : (
        <Stack
          direction={'row'}
          onClick={() => setRefresh(refresh + 1)}
          alignItems="center"
          justifyContent="start"
        >
          <Tooltip title="Close Support">
            <IconButton onClick={(_) => setSelectedThread(null)}>
              <Iconify icon="material-symbols:arrow-back-rounded" />
            </IconButton>
          </Tooltip>
          <Typography alignSelf="start" fontWeight={900} mt={0.5} fontSize={20}>
            {selectedThread.name}
          </Typography>
          <Box flex={1} />
          <IconButton ref={menuRef} onClick={() => setMenuOpen(true)}>
            <Iconify icon="carbon:overflow-menu-vertical" />
          </IconButton>

          <Menu
            keepMounted
            anchorEl={menuRef.current}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {selectedThread.open && (
              <Box>
                <MenuItem
                  onClick={() => close()}
                  sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
                >
                  <Iconify icon="ic:round-close" mr={1} />
                  Close query
                </MenuItem>
                <Divider />
              </Box>
            )}
            <MenuItem
              onClick={() => onOpenApplicationsByApplicant()}
              sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
            >
              <Iconify icon="material-symbols:format-list-numbered-rounded" mr={1} />
              View Customer Applications
            </MenuItem>
            <MenuItem
              onClick={() => onOpenApplicationsByApplicant()}
              sx={{ typography: 'body2', minWidth: 120, textAlign: 'center' }}
            >
              <Iconify icon="material-symbols:format-list-numbered-rounded" mr={1} />
              Reload
            </MenuItem>
          </Menu>
        </Stack>
      )}
      <Divider />
      {!selectedThread ? (
        <Stack flex="1">
          <Paper style={{ maxHeight: '100%', overflow: 'auto' }}>
            <List mb={4}>
              <Stack mb={8}>
                {threads.map((thread, i) => (
                  <Stack
                    key={i}
                    direction="row"
                    justifyContent="space-between"
                    onClick={(_) => setSelectedThread(thread)}
                    sx={{
                      '&:hover': {
                        color: '#fff',
                        transform: 'scale(1.02)',
                        bgcolor: 'primary.main'
                      },
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      bgcolor: thread.read ? '#80808020' : '#00DDFF54',
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      px: 2,
                      py: 1
                    }}
                  >
                    <Stack>
                      <Typography variant="subtitle" fontWeight="600">
                        {thread.name}
                      </Typography>
                      <Typography variant="caption" sx={{ maxLength: 5 }}>
                        {limit(thread.lastMessage)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                      <Stack>
                        <Typography variant="caption" fontSize={12}>
                          {fDateTime(thread.updatedAt)}
                        </Typography>
                        <Tooltip
                          title={thread.open ? 'This query is still open' : 'This query was closed'}
                        >
                          <Chip
                            size="small"
                            sx={{}}
                            label={thread.read ? 'CLOSED' : 'OPEN QUERY'}
                          />
                        </Tooltip>
                      </Stack>
                      <Stack ml={1}>
                        <Iconify icon="ph:caret-right-bold" />
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </List>
          </Paper>
        </Stack>
      ) : (
        <Stack flex="1">
          <Stack flex="1">
            <Paper style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'auto' }}>
              <List mb={4}>
                <Stack mb={8}>
                  {messages.map((message, i) => (
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
                          {isHTML(message.message) ? (
                            <Stack sx={{ borderRadius: 2, bgcolor: '#20202020', py: 1, px: 2 }}>
                              <div dangerouslySetInnerHTML={{ __html: message.message }} />
                            </Stack>
                          ) : (
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
                          )}
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
      )}
    </Stack>
  );
}

export default Threads;
