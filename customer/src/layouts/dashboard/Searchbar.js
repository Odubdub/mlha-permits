import { useEffect, useRef, useState } from 'react';
// material
import { styled, alpha } from '@mui/material/styles';
import { Input, Slide, Button, IconButton, InputAdornment, ClickAwayListener, Typography, Stack } from '@mui/material';
// component

import { useNavigate } from 'react-router-dom';
import Iconify from 'src/bundle/Iconify'

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  top: 40,
  right: 'calc(10% / 2)',
  zIndex: 99,
  borderRadius: 20,
  width: '90%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

function Searchbar({}) {
  const [isOpen, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navigate = useNavigate()

  const path = useRef('')

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchForIt()
    }
  }

  const searchForIt = () => {

    navigate(`${path.current}?query=${query}`)
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Stack>
        {!isOpen && (
          <IconButton onClick={handleOpen} sx={{ml:3}}>
            <Iconify icon="eva:search-fill" width={20} height={20} />
          </IconButton>
        )}
        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
            <Input
              fullWidth
              disableUnderline
              placeholder="Search…"
              value={query}
              onKeyDown={handleKeyDown}
              onChange={e=>setQuery(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify
                    icon="eva:search-fill"
                    sx={{ color: 'text.disabled', width: 20, height: 20 }}
                  />
                </InputAdornment>
              }
              sx={{ mr: 1, fontWeight: 'fontWeightBold' }}
            />
            <Button variant="contained" type='submit' onClick={handleClose}>
              Search
            </Button>
          </SearchbarStyle>
        </Slide>
      </Stack>
    </ClickAwayListener>
  );
}

export default Searchbar