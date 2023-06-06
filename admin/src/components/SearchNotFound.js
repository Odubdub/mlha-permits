import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound() {
  return (
    <Paper>
      <Typography gutterBottom align="center" variant="subtitle1">
        Not found
      </Typography>
    </Paper>
  );
}
