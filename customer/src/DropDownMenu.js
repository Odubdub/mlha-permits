import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography, Stack, Divider } from '@mui/material';
// component
import { Box } from '@mui/system';
import Iconify from './bundle/Iconify';
import { LoadingButton } from '@mui/lab';

export default function DropDownMenu({
  options,
  title,
  endIcon,
  startIcon,
  selectedStatus,
  disabled,
  onSelected
}) {
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(
    (options.find((ele) => ele.raw === selectedStatus) || {}).value
  );

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSelect = (option) => {
    if (option.value !== selected) {
      setSelected(option.value);
      onSelected({ rawValue: option.raw, filter: options.filter });
    }

    handleClose();
  };

  return (
    <Box borderColor="" sx={{ opacity: disabled ? 0.3 : 1 }} mr={2} borderRadius={1}>
      <Box display="flex" flexDirection="column" textAlign="left">
        <LoadingButton
          onClick={handleOpen}
          disabled={disabled}
          endIcon={endIcon ? <Iconify icon={endIcon} /> : null}
          startIcon={startIcon ? <Iconify icon={startIcon} /> : null}
        >
          {title}
        </LoadingButton>
      </Box>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {options.map((option, i) => (
          <MenuItem
            key={i}
            selected={option.value === selected}
            onClick={() => handleSelect(option)}
            sx={{ typography: 'body2' }}
          >
            <Stack>
              <Typography>
                <Iconify sx={{ mr: 2 }} icon={option.icon} />
                {option.label}
              </Typography>
              {/* {i <= option.length && <Divider sx={{ width: '100%', alignSelf: 'stretch' }} />} */}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
