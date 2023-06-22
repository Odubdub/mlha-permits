import React, { useContext, useRef, useState } from 'react';
import { Box, ListItemText, Typography, Button, Menu, MenuItem } from '@mui/material';
import { SelectorIcon } from 'src/components/Icons';
import { Authorities, AuthorityContext } from './AuthorityContext';

export const AuthorityTitle = () => {
  const ref = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authority, setAuthority } = useContext(AuthorityContext);
  const selectAuthority = (auth) => {
    setAuthority(auth);
    setIsMenuOpen(false);
  };

  return (
    <Box sx={{ marginTop: 2, mx: 2 }}>
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: '#FFFFFF92',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          pl: { xs: 1, sm: 1, md: 2 },
          py: '8px',
          borderRadius: 1
        }}
      >
        <div>
          <Box
            sx={{ display: 'flex', flexDirection: 'row', color: 'textColor', alignItems: 'center' }}
          >
            <authority.icon sx={{ marginRight: { xs: 0, sm: 0, md: 1 } }} />
            <Typography
              sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
              variant="subtitle1"
            >
              MLHA Service
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
            fontSize={14.5}
            color="textColor"
          >
            Management System
          </Typography>
        </div>
        <>
          <Button
            sx={{ minWidth: 20, height: 34 }}
            ref={ref}
            disabled
            onClick={() => setIsMenuOpen(true)}
          >
            <SelectorIcon
              sx={{
                color: 'textColor',
                width: 14,
                height: 14
              }}
            />
          </Button>
          <Menu
            open={isMenuOpen}
            anchorEl={ref.current}
            onClose={() => setIsMenuOpen(false)}
            PaperProps={{
              sx: { width: 150 }
            }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {Authorities.map((dept) => (
              <MenuItem
                sx={{
                  color:
                    authority.shortTitle === dept.shortTitle ? 'primary.main' : 'text.secondary'
                }}
                key={dept.shortTitle}
                onClick={() => selectAuthority(dept)}
              >
                <dept.icon sx={{ marginRight: 2 }} />
                <ListItemText
                  primary={dept.shortTitle}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </MenuItem>
            ))}
          </Menu>
        </>
      </Box>
    </Box>
  );
};
