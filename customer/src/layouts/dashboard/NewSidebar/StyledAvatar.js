import * as React from 'react';
import { styled, Avatar, Badge, Box} from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function StyledAvatar({name}) {

  //function that gets initials from name
  const getInitials = () => {
    const nameArray = name.split(' ')
    const initials = nameArray[0].charAt(0) + nameArray[1].charAt(0)
    return initials
  }

  return (
    <Box>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt="Remy Sharp" sx={{ width: '32px', height: '32px', fontSize:'14px' }}>
          {getInitials()}
        </Avatar>
      </StyledBadge>
    </Box>
  );
}
