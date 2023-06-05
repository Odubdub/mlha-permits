import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

Logo.propTypes = {
  sx: PropTypes.object
};

export default function Logo({ sx, isMini = false }) {
  return (
    <RouterLink to="/dashboard">
      <Box component="img" src="/static/logo.png" sx={{ width: isMini ? 100 : 120, ...sx}} />
    </RouterLink>
  );
}
