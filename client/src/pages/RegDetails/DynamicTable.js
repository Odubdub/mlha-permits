import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import lodash from 'lodash';
import { Box, Chip, Fade, IconButton, List, Modal, Stack, Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';

export default function DynamicTable({ open, onClose, title = 'Title', rows, tableConfig }) {
  const [counterValues, setCounterValues] = useState([]);

  const data = typeof rows == 'string' ? JSON.parse(rows) : rows;

  if (tableConfig.counters && counterValues.length == 0 && data.length > 0) {
    const keys = tableConfig.columns.map((c) => c.key);

    let counters = [];
    tableConfig.counters.forEach((counter) => {
      if (Object.values(tableConfig.columns.map((e) => e.key)).includes(counter.key)) {
        let sum = 0;

        //Check type of Limit
        if (counter.type == 'sum') {
          //Sum type of Limit
          sum = data
            .map((e) => Number(extractDigits(e[counter.key])))
            .reduce((sum, el) => sum + extractDigits(el));
        } else if (counter.type == 'count') {
          //Counter type of limit
          sum = lodash.uniq(data.map((e) => e[counter.key])).length;
        }

        counters.push({
          key: counter.key,
          sum: `${sum} ${counter.unit}`,
          isValid: counter.limit >= sum,
          index: keys.indexOf(counter.key)
        });
      }
    });

    setCounterValues(counters);
  }

  function extractDigits(str) {
    if (typeof str == 'number') return str;
    if (typeof str != 'string') return null;
    // Use a regular expression to match any sequence of digits
    const matches = str.match(/\d+/);
    // If no matches were found, return null
    if (!matches) {
      return null;
    }
    // Otherwise, convert the first match to a number and return it
    return parseInt(matches[0], 10);
  }

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
                              align={'center'}
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
                      {data.map((row, index) => (
                        <TableRow
                          key={index}
                          bgcolor={index % 2 ? '#F0F0F0' : '#fff'}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          {tableConfig.columns.map((column, i) => {
                            return (
                              <TableCell key={i} align="center">
                                {row[column.key]}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                      {counterValues.length > 0 &&
                        tableConfig.columns.map((column, i) => {
                          const counter = counterValues.find((cV) => cV.index == i);
                          return (
                            <TableCell key={i} align="center">
                              {counter && (
                                <Chip
                                  sx={{
                                    bgcolor: counter.isValid ? '#00E000' : 'red',
                                    color: '#ffffff',
                                    borderRadius: 2,
                                    mx: 1
                                  }}
                                  label={counter.sum}
                                />
                              )}
                            </TableCell>
                          );
                        })}
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
