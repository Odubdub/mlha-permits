import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { useContext } from 'react';
import { FiltersContext } from 'src/pages/Registrations/FiltersContext';
import FilterMenu from './filters/FilterMenu';
import Iconify from './Iconify';
import { useState, useEffect } from 'react';
import Threads from 'src/pages/RegDetails/RightSideDetails/Threads';
import { getFromServer } from 'src/ApiService';
import { getStatusColor } from 'src/helper';
import { isBlank } from 'src/helperFuntions';

const style = {
  borderRadius: '0px 0px 30px 30px',
  backdropFilter: 'blur(8px)',
  backgroundColor: 'rgba(256,256,256,0.5)',
  width: '100%',
  boxShadow: 1,
  fullWidth: true,
  padding: 2
};

export const SearchBar = (props) => {
  const { filters, setFilters } = useContext(FiltersContext);
  const [showHistory, setShowHistory] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const typeColor = filters.type == 'all' ? '#808080' : '#000000';

  const getStatusFilterDescription = () => {
    if (filters.status == 'all') {
      return 'All statuses';
    } else {
      return `${filters.fstatus}`;
    }
  };

  const getServiceFilterDescription = () => {
    if (filters.type == 'all') {
      return 'All services';
    } else {
      return `${filters.ftype}`;
    }
  };

  const getThreads = () => {
    getFromServer({
      path: 'queries',
      onComplete: (queries) => {
        const q = queries.filter((e) => !e.read);
        setNotifCount(q.length);
      },
      onError: (err) => {}
    });
  };

  useEffect(() => {
    getThreads();
    const interval = setInterval(() => {
      // getThreads();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (props.query.length) {
      setSearchQuery(props.query);
    }
  }, [props.query]);

  const search = () => {
    setFilters({ ...filters, search: searchQuery.trim() });
  };

  const cancelSearch = () => {
    setFilters({ ...filters, search: '' });
    setSearchQuery('');
  };

  const reset = () => {
    props.onReload();
    getThreads();
    setSearchQuery('');
  };

  useEffect(() => {
    setSearchQuery(filters.search);
  }, []);

  return (
    <Stack sx={{ ...style, ...(props.sx || {}) }}>
      <Stack direction="row" justifyContent="space-between">
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap'
          }}
        >
          <Stack direction="row">
            <Typography sx={{ mx: 1 }} variant="h4">
              {props.title || `Applications`}
            </Typography>
            <IconButton
              size="small"
              onClick={() => reset()}
              sx={{ mr: 1, width: 30, height: 30, mt: 0.5 }}
              children={<Iconify icon="uiw:reload" fontSize="small" />}
            />
            <Typography
              sx={{ textTransform: 'caption', fontSize: 14, fontWeight: 500, color: 'gray' }}
              variant="span"
            ></Typography>
          </Stack>
        </Box>
        {
          <Threads
            show={showHistory}
            onOpenApplications={props.onOpenApplications}
            onShow={() => setShowHistory(true)}
            onHide={() => setShowHistory(false)}
          />
        }
        <Stack direction="row" alignItems="center">
          <TextField
            fullWidth
            sx={{ flex: 1 }}
            size="small"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                props.onSearch(searchQuery.trim());
              }
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Tooltip title={props.isSearching ? 'Cancel Search' : 'Search'}>
                    {searchQuery == filters.search && !isBlank(filters.search) ? (
                      <IconButton
                        size="small"
                        onClick={cancelSearch}
                        sx={{ transform: 'translate(15px,0px)' }}
                      >
                        <Iconify icon={'material-symbols:close'} />
                      </IconButton>
                    ) : (
                      <IconButton
                        size="small"
                        onClick={search}
                        sx={{ transform: 'translate(15px,0px)' }}
                      >
                        <Iconify icon={'ic:round-search'} />
                      </IconButton>
                    )}
                  </Tooltip>
                </InputAdornment>
              )
            }}
            placeholder="Search by applicant"
            variant="outlined"
          />
          <Stack direction="row" alignItems="center" justifyContent="space-between" ml={2}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <FilterMenu
                filterOptions={props.filterOptions}
                filters={filters}
                onUpdateFilters={(f) => props.updateFilters(f)}
              />
              <Box ml={1} />
              <Button
                onClick={() => setShowHistory(true)}
                variant="outlined"
                // onClick={() => props.updateFilters({fstatus: "All Statuses",ftype: "All Services",status: "all",type: "all"})}
                endIcon={
                  notifCount > 0 && (
                    <Chip
                      size="small"
                      sx={{ bgcolor: notifCount == 0 ? 'primary.main' : 'red', color: '#fff' }}
                      label={notifCount}
                    />
                  )
                }
                sx={{
                  mr: 1,
                  borderColor: notifCount == 0 ? 'primary.main' : 'red',
                  color: notifCount == 0 ? 'primary.main' : 'red',
                  '&:hover': {
                    color: '#fff',
                    bgcolor: notifCount == 0 ? 'primary.main' : 'red',
                    borderColor: notifCount == 0 ? 'primary.main' : 'red'
                  }
                }}
              >
                <Typography
                  variant="span"
                  sx={{ display: { xs: 'none', sm: 'none', md: 'inline-flex', fontSize: 15 } }}
                >
                  Support
                </Typography>
              </Button>
              <Box ml={1} />
            </Box>
            <Box ml={1} />
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" mt={1}>
        <Typography mr={1}>
          {isBlank(filters.search) ? `Showing` : `Results for '${filters.search}' in `}
        </Typography>
        <Tooltip title="Click to reset and show all services">
          <Button
            disabled={filters.type == 'all'}
            sx={{ py: 0, px: 0, borderRadius: 3, color: typeColor }}
            onClick={() => setFilters({ ...filters, type: 'all' })}
          >
            <Chip
              size="small"
              sx={{
                bgcolor: '#fff',
                textTransform: 'uppercase',
                borderWidth: 1,
                borderStyle: 'dashed',
                borderColor: typeColor,
                boxShadow: `0 2px 4px ${typeColor}40`,
                color: typeColor,
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
              label={getServiceFilterDescription()}
            />
          </Button>
        </Tooltip>
        <Tooltip title="Click to reset and show all statuses">
          <Button
            disabled={filters.status == 'all'}
            sx={{
              py: 0,
              px: 0,
              borderRadius: 3,
              ml: 1,
              color: getStatusColor(filters.status)
            }}
            onClick={() => setFilters({ ...filters, status: 'all' })}
          >
            <Chip
              size="small"
              sx={{
                bgcolor: '#fff',
                borderWidth: 1,
                borderStyle: 'dashed',
                minWidth: 64,
                cursor: 'pointer',
                borderColor: getStatusColor(filters.status),
                boxShadow: `0 2px 4px ${getStatusColor(filters.status)}40`,
                color: getStatusColor(filters.status),
                fontWeight: 700,
                textTransform: 'uppercase'
              }}
              label={getStatusFilterDescription()}
            />
          </Button>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
