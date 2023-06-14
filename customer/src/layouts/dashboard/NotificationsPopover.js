import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { styled } from '@mui/material/styles';

// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListItemButton,
  TextField,
  List,
  InputAdornment,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Badge
} from '@mui/material';

// utils
// components
import MenuPopover from './MenuPopover';
import Iconify from 'src/bundle/Iconify';
import { getRegistrations, post } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import { NotificationContext } from 'src/NotificationContext';

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {capitalize(notification.title)}
      <Typography component="span" ml={1} variant="body2" sx={{ color: 'text.secondary' }}>
        {notification.message || ''}
      </Typography>
    </Typography>
  );

  if (notification.type === 'order_placed') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic:baseline-bug-reporte.svg" />,
      title
    };
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_shipping.svg" />,
      title
    };
  }
  if (notification.type === 'mail') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_mail.svg" />,
      title
    };
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: <img alt={notification.title} src="/static/icons/ic_notification_chat.svg" />,
      title
    };
  }
  return {
    avatar: <img alt={notification.title} src={notification.avatar} />,
    title
  };
}

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired
};

const getIcon = (notification) => {
  if ((notification.attachments || []).length) {
    return 'fa-solid:file-pdf';
  } else if (notification.title == 'Submission') {
    return 'material-symbols:fact-check';
  } else if (notification.title.toLowerCase().includes('rejected')) {
    return 'heroicons:exclaimation-triangle-solid';
  }

  return 'clarity:notification-solid';
};

const getIconColor = (notification) => {
  if ((notification.attachments || []).length) {
    return '#0BE000';
  } else if (notification.title == 'Submission') {
    return '#00A6FF';
  } else if (notification.title.toLowerCase().includes('rejected')) {
    return '#ff0000';
  }

  return '#CAD400';
};

const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function NotificationItem({ notification, onClick, download }) {
  const { avatar, title, message } = renderContent(notification);

  return (
    <ListItemButton
      to="#"
      disableGutters
      component={RouterLink}
      onClick={onClick}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.read && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 30,
          height: 30,
          borderRadius: 2,
          p: 1,
          mr: 1,
          bgcolor: `${getIconColor(notification)}20`
        }}
      >
        <Iconify
          icon={getIcon(notification)}
          sx={{
            color: `${getIconColor(notification)}`,
            fontSize: 26
          }}
        />
      </Stack>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled'
            }}
          >
            <Stack direction="row" width={350} alignItems="center" justifyContent="start">
              <Iconify icon="eva:clock-fill" sx={{ mr: 0.5, width: 16, height: 16 }} />
              <Typography>{formatDistanceToNow(new Date(notification.createdAt))}</Typography>
              <Box flex={1} />
              {(notification.attachments || []).length && (
                <Stack direction="row" justifySelf="end" alignItems="center">
                  <Iconify
                    sx={{ mr: 1, fontSize: 21, color: 'green', mt: 0.25 }}
                    icon="line-md:download-loop"
                  />
                  <Typography color="green" variant="caption" fontStyle="italic">
                    Download Available
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { userData } = useContext(AuthContext);
  const { setNotification } = useContext(NotificationContext);

  const filters = [
    {
      value: 'action-required',
      name: 'Action Required'
    },
    {
      value: 'unread',
      name: 'Unread'
    },
    {
      value: 'read',
      name: 'Read'
    }
  ];

  const [selected, setSelectedFilter] = useState(filters[0].value);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `1px dashed ${theme.palette.primary.main}`,
      backgroundColor: `${open ? theme.palette.background.paper : theme.palette.primary.main}`,
      padding: '0 4px'
    }
  }));

  const openNotification = (notification) => {
    if (!notification.read) {
      post(`applications/${notification._id}/read-notification`)
        .then((res) => {
          fetch();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setNotification(notification);
    setOpen(false);
  };

  const fetch = () => {
    getRegistrations(`applications/${userData.idNo}/user-notifications`)
      .then((res) => {
        setNotifications(res);
      })
      .catch((err) => {
        console.log('Err: ', err);
      });
  };

  useEffect(() => {
    if (open) {
      fetch();
    }
  }, [open]);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => n.read == false).length);
  }, [notifications]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <StyledBadge badgeContent={unreadCount}>
          <Iconify icon="ion:notifications" width={20} height={20} />
        </StyledBadge>
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 450 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 2, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
            Notifications
          </Typography>
          <ToggleButtonGroup
            size="small"
            sx={{ mr: 1 }}
            color="primary"
            value={selected}
            exclusive
            onChange={(e, newValue) => setSelectedFilter(newValue)}
            aria-label="Platform"
          >
            {filters.map((filter, i) => (
              <ToggleButton key={i} value={filter.value}>
                {filter.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        <Box sx={{ px: 2, pb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search notification..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={20} height={20} />
                </InputAdornment>
              )
            }}
          />
        </Box>
        <Divider />

        {notifications.length > 0 ? (
          <List disablePadding sx={{ overflow: 'scroll', maxHeight: 'calc(100vh - 250px)' }}>
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                onClick={() => openNotification(notification)}
                notification={notification}
              />
            ))}
          </List>
        ) : (
          <Stack alignItems="center" justifyContent="center" width="100%" height={100}>
            <Typography>No Notifications</Typography>
          </Stack>
        )}
      </MenuPopover>
    </>
  );
}
