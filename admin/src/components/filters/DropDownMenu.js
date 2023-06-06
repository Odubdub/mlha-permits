import { useState } from 'react';
// material
import { Menu, Button, MenuItem, Typography } from '@mui/material';
// component
import Iconify from '../Iconify';
import { Box } from '@mui/system';

export default function DropDownMenu({data, filters, onSelected}) {

  const [open, setOpen] = useState(null)
  const [selected, setSelected] = useState(data.options.filter(ele=>ele.raw === data.default)[0].value)

  const handleOpen = (event) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleSelect = (option) => {

    if (option.value !== selected){

      setSelected(option.value)
      onSelected({rawValue: option.raw, filter: data.filter})
    }

    handleClose()
  }

  return (
    <Box borderColor='' bgcolor='#00000007' mr={2} borderRadius={1}>
        <Box display='flex' flexDirection='column' textAlign='left'>
          <Box>
            <Typography ml={1} component="span" variant="subtitle2">
              {` ${data.title}`}
            </Typography>
          </Box>
          <Button
            onClick={handleOpen}
            endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
            >
          <Typography component="span" variant="subtitle2" sx={{ textAlign:'left', width: data.width || 80,color: 'primary.main' }}>
              {selected}
            </Typography>
          </Button>
        </Box>
      <Menu
        keepMounted
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {data.options.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === selected}
            onClick={()=>handleSelect(option)}
            sx={{ typography: 'body2' }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
