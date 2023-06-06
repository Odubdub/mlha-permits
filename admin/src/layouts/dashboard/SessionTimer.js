import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import Countdown from 'react-countdown';
import { AuthContext } from 'src/AuthContext';
import { clearToken } from 'src/pages/Auth/AuthService';

const SessionTimer = ({ show = true }) => {
  const { userData, setUserData } = useContext(AuthContext);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a complete state
      if (userData != null) {
        clearToken();
        setUserData(null);
      }
      return <span>Logout</span>;
    } else {
      // Render a countdown
      return (
        <Typography>
          {show
            ? `Logout  ・  ${`${hours}`.padStart(2, '0')}:${`${minutes}`.padStart(
                2,
                '0'
              )}:${`${seconds}`.padStart(2, '0')}`
            : ''}
        </Typography>
      );
    }
  };

  return <Countdown date={new Date(userData.exp * 1000)} renderer={renderer} />;
};

export default SessionTimer;
