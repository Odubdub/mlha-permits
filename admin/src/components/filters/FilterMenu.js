import {
  Box,
  Button,
  Tooltip,
  createStyles,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  styled,
  Stack,
  Typography
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Iconify from '../Iconify';
import { tooltipClasses } from '@mui/material/Tooltip';
import { FiltersContext } from 'src/pages/Registrations/FiltersContext';
function FilterMenu({ filterOptions, onUpdateFilters }) {
  const ref = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { filters } = useContext(FiltersContext);
  const [activeFilters, setActiveFilters] = useState(filters);
  const [currentFilters, setCurrentFilters] = useState(filters);

  useEffect(() => {
    if (filters) {
      setActiveFilters(filters);
      setCurrentFilters(filters);
    }
  }, [filters]);

  const SubMenu = styled(({ className, ...props }) => (
    <Tooltip placement="right-end" {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      padding: 0,
      color: 'rgba(0, 0, 0)',
      boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
      fontSize: 11
    }
  }));

  const editFilters = (filter, raw, full) => {
    const cf = { ...currentFilters };
    cf[filter] = raw;
    cf[`f${filter}`] = full;

    setCurrentFilters(cf);
  };

  const applyFilters = () => {
    onUpdateFilters(currentFilters);
    setIsMenuOpen(false);
  };

  return (
    <Stack direction="row" alignItems="center">
      <Button
        ref={ref}
        color="primary"
        variant="contained"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        startIcon={<Iconify icon="charm:filter" fontSize="medium" />}
        endIcon={
          <Iconify
            icon={isMenuOpen ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'}
            fontSize="medium"
          />
        }
      >
        <Typography
          variant="span"
          sx={{ display: { xs: 'none', sm: 'inline-flex', md: 'inline-flex' } }}
        >
          Filter
        </Typography>
      </Button>
      {/* Main Menu */}
      <Menu
        open={isMenuOpen}
        anchorEl={ref.current}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: { maxWidth: '100%', px: 1.6 }
        }}
        sx={{ pb: 0 }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <SubMenu title="">
          <Box />
        </SubMenu>
        {filterOptions.map((e) => {
          return (
            <SubMenu
              key={e.title}
              title={e.options.map((s, i) => {
                const isLast = s.label === e.options[e.options.length - 1].label;
                return (
                  <Box key={i} onClick={() => editFilters(e.filter, s.raw, s.label)}>
                    <MenuItem
                      key={s.label}
                      sx={{
                        mx: 2,
                        color:
                          activeFilters[e.filter] != currentFilters[e.filter] &&
                          currentFilters[e.filter] === s.raw
                            ? '#32C5FF'
                            : 'text.secondary',
                        borderBottom: isLast ? '' : `solid 0.5px #80808020`
                      }}
                    >
                      <ListItemText
                        primary={s.label}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                      {activeFilters[e.filter] === s.raw && (
                        <Iconify icon="bi:check" ml={2} width={16} height={16} />
                      )}
                    </MenuItem>
                  </Box>
                );
              })}
            >
              <MenuItem
                sx={{
                  px: 0.5,
                  color:
                    activeFilters[e.filter] != currentFilters[e.filter]
                      ? '#32C5FF'
                      : 'text.secondary',
                  margin: 0,
                  borderBottom: `solid 0.5px #80808020`
                }}
              >
                <ListItemText primary={e.title} primaryTypographyProps={{ variant: 'body2' }} />
                <Iconify icon="akar-icons:chevron-right" ml={1} width={16} height={16} />
              </MenuItem>
            </SubMenu>
          );
        })}
        <MenuItem
          disabled={
            activeFilters.status === currentFilters.status &&
            activeFilters.type === currentFilters.type
          }
          onClick={() => applyFilters()}
          sx={{
            color: '#32C5FF',
            mt: 1,
            '&:hover': {
              backgroundColor: '#32C5FF',
              borderRadius: 1,
              color: '#fff'
            }
          }}
        >
          <Iconify icon="mdi:filter-check-outline" mr={1} width={24} height={24} />
          <ListItemText
            primary="Apply Filters"
            sx={{ fontWeight: 'bold' }}
            primaryTypographyProps={{ variant: 'body2' }}
          />
        </MenuItem>
      </Menu>
    </Stack>
  );
}

export default FilterMenu;
