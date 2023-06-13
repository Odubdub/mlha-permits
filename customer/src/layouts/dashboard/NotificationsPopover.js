import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { set, sub, formatDistanceToNow } from 'date-fns';
import { styled } from '@mui/material/styles';

// material
import { alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Avatar,
  Divider,
  IconButton,
  Typography,
  ListItemText,
  ListItemAvatar,
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

const NOTIFICATIONS = [
  {
    id: faker.datatype.uuid(),
    title: 'Residence Permit application received',
    description: 'Thanks for your application. We will get back to you soon.',
    avatar: null,
    type: 'order_placed',
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    isUnRead: true
  },
  {
    id: faker.datatype.uuid(),
    title: 'Application for exemption by commisioner',
    description: 'answered to your comment on the Minimal',
    avatar: '',
    type: 'friend_interactive',
    createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
    isUnRead: true
  },
  {
    id: faker.datatype.uuid(),
    title: 'Work permit approved',
    description: 'Your work permit has been approved. Click this to view and download it.',
    avatar: null,
    type: 'chat_message',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Emeregency work permit application received',
    description:
      'Your emergency work permit application has been received. We will get back to you soon.',
    avatar: null,
    type: 'mail',
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Citizenship application received',
    description: 'Your citizenship application has been received. We will get back to you soon.',
    avatar: null,
    type: 'order_shipped',
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Work permit approved',
    description: 'Your work permit has been approved. Click this to view and download it.',
    avatar: null,
    type: 'chat_message',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Work permit approved',
    description: 'Your work permit has been approved. Click this to view and download it.',
    avatar: null,
    type: 'chat_message',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Emeregency work permit application received',
    description:
      'Your emergency work permit application has been received. We will get back to you soon.',
    avatar: null,
    type: 'mail',
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Citizenship application received',
    description: 'Your citizenship application has been received. We will get back to you soon.',
    avatar: null,
    type: 'order_shipped',
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Emeregency work permit application received',
    description:
      'Your emergency work permit application has been received. We will get back to you soon.',
    avatar: null,
    type: 'mail',
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false
  },
  {
    id: faker.datatype.uuid(),
    title: 'Citizenship application received',
    description: 'Your citizenship application has been received. We will get back to you soon.',
    avatar: null,
    type: 'order_shipped',
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false
  }
];

function renderContent(notification) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {noCase(notification.description)}
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

function NotificationItem({ notification }) {
  const { avatar, title } = renderContent(notification);

  return (
    <ListItemButton
      to="#"
      disableGutters
      component={RouterLink}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected'
        })
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
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
            <Iconify icon="eva:clock-fill" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {formatDistanceToNow(new Date(notification.createdAt))}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

export default function NotificationsPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

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

  useEffect(() => {}, [open]);

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
        <StyledBadge badgeContent={2}>
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

        <List disablePadding sx={{ overflow: 'scroll', maxHeight: 'calc(100vh - 250px)' }}>
          {NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </List>
      </MenuPopover>
    </>
  );
}
