import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Fade, IconButton, List, Modal, Stack, Typography } from '@mui/material';
import Iconify from '../Iconify';

export default function StaticTable({ open, onClose, title = 'Sometie', data, tableConfig }) {
  const [fields, setFields] = React.useState([]);

  React.useEffect(() => {
    tableConfig.rowCount;
    //Function that loops in 0 to tableConfig.rowCount to map objects to fields
    const newFields = [];
    for (let i = tableConfig.rowStart; i < tableConfig.rowLast + 1; i++) {
      const newRow = [];
      tableConfig.row.forEach((cell) => {
        newRow.push({ ...cell, key: `${cell.key}${i}` });
      });
      newFields.push(newRow);
    }
    // console.log(JSON.stringify(newFields, null, 2))

    setFields(newFields);
  }, []);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      BackdropProps={{
        timeout: 500
      }}
    >
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Fade in={open}>
          <Box bgcolor="#fff" borderRadius={2} py={2} px={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" pb={1}>
              <Typography variant="h6" gutterBottom>
                {title}
              </Typography>
              <IconButton onClick={onClose}>
                <Iconify icon="clarity:close-line" />
              </IconButton>
            </Stack>
            <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
              <List>
                <TableContainer mt={1} component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow bgcolor={'#D5D5D5'}>
                        {tableConfig.header.map((h, index) => {
                          return (
                            <TableCell
                              key={index}
                              align={
                                index == 0
                                  ? 'left'
                                  : index == tableConfig.header.length - 1
                                  ? 'right'
                                  : 'center'
                              }
                              component="th"
                              sx={{ padding: 1 }}
                              scope="row"
                              padding="none"
                            >
                              {h}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((subfields, index) => (
                        <TableRow
                          key={index}
                          bgcolor={index % 2 ? '#F0F0F0' : '#fff'}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {subfields.map((subfield, i) => {
                            const val = data.applicationDetails[subfield.key];
                            return (
                              <TableCell key={i} align={i == 0 ? 'left' : 'center'}>
                                {i == 0 ? tableConfig.defaults[subfield.key] : val}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </List>
            </Paper>
          </Box>
        </Fade>
      </Stack>
    </Modal>
  );
}
