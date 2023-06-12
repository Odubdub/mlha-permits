import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material
import {
  Card,
  Table,
  Stack,
  Chip,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Box,
  Pagination,
  CircularProgress
} from '@mui/material';

export const asc = 1;
export const desc = -1;

// components
import Page from '../../components/Page';
import SearchNotFound from '../../components/SearchNotFound';
import { getFromServer } from 'src/ApiService';
import TableHeader from '../../components/TableHead';
import { fDate, fDateTime } from 'src/utils/formatTime';
import { SearchBar } from 'src/components/SearchBar';
import { getStatusColor, getStatusDescription, PermitRegState } from 'src/helper';
import { FiltersContext } from './FiltersContext';
import { AuthContext } from 'src/AuthContext';
import { drawerWidthClose, drawerWidthOpen } from 'src/layouts/dashboard/NewSidebar.js/Sidebar';
const TABLE_HEAD = [
  { id: 'name', label: 'Applicant/Reviewer', align: 'left', property: 'name' },
  { id: 'type', label: 'Application Type', align: 'center', property: 'type' },
  { id: 'status', label: 'Status', align: 'center', property: 'status' },
  { id: 'registered', label: 'Registered', align: 'center', property: 'createdAt' },
  { id: 'updated', label: 'Updated', align: 'center', property: 'updatedAt' }
];

export default function Applications({ title, applicationFilters = [] }) {
  const { filters, setFilters } = useContext(FiltersContext);
  const [filterOptions, setFilterOptions] = useState([]);
  const [fetchedData, setFetchedData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [orderBy, setOrderBy] = useState({ property: 'updatedAt', order: desc });
  const [isSearch, setIsSearch] = useState(false);

  const handleChangePage = (_, newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSortRequest = (property, order) => {
    setFilters({ ...filters, sort: property, order: order });
  };

  const fetch = () => {
    if (filters.search != '') {
      setIsSearch(true);
    }
    const path = `applications?query=${filters.search}&type=${filters.type}&page=${
      filters.page
    }&limit=${filters.limitPerPage}&status=${filters.status}&sort=${filters.sort}&order=${
      filters.order
    }&filters=${applicationFilters.join(',')}`;

    getFromServer({
      path: path,
      params: {},
      onComplete: (d) => {
        setFetchedData(d);
      },
      onError: (err) => {
        setFetchedData({
          results: [],
          pages: 1
        });
        console.log('Error ', err.message);
      }
    });
  };

  const reload = () => {
    setFilters({
      ...filters,
      limitPerPage: 17,
      search: '',
      page: 1,
      sort: 'updatedAt',
      order: desc,
      type: 'all',
      status: 'all'
    });
  };

  useEffect(() => {
    getFromServer({
      path: 'authority/services/user-services/',
      onComplete: (services) => {
        let options = services.map(({ code, shortName }) => {
          return { raw: code, value: shortName, label: shortName };
        });
        options = [{ raw: 'all', value: 'All Services', label: 'All Services' }, ...options];

        setFilterOptions([
          {
            title: 'Status',
            filter: 'status',
            width: 90,
            default: filters.status,
            options: [
              { raw: 'all', value: 'All Statuses', label: 'All Statuses' },
              { raw: PermitRegState.Pending, value: 'Pending', label: 'Pending' },
              { raw: PermitRegState.New, value: 'New', label: 'New' },
              {
                raw: PermitRegState.PaymentRequested,
                value: 'Pending Payment',
                label: 'Pending Payment'
              },
              { raw: PermitRegState.Returned, value: 'Returned', label: 'Returned' },
              {
                raw: PermitRegState.PendingIssuance,
                value: 'Pending Issuance',
                label: 'Pending Issuance'
              },
              { raw: PermitRegState.Approved, value: 'Issued', label: 'Issued' },
              { raw: PermitRegState.Revoked, value: 'Revoked', label: 'Revoked' },
              { raw: PermitRegState.Rejected, value: 'Rejected', label: 'Rejected' }
            ]
          },
          {
            title: 'Service Type',
            filter: 'type',
            width: 90,
            default: filters.type,
            options: options
          }
        ]);
      },
      onError: (err) => {
        console.log('Error ', err.message);
      }
    });
  }, [userData]);

  useEffect(() => {
    fetch();
    if (filters.search !== '') {
      setSearchQuery('');
      setIsSearch(false);
    }
  }, [filters]);

  useEffect(() => {
    fetch();
  }, [applicationFilters]);

  return (
    <Page title="MLHA Permits">
      <Container>
        <SearchBar
          setSearch={setSearchQuery}
          title={title}
          filters={filters}
          cancelSearch={() => setFilters({ ...filters, search: '', page: 1 })}
          onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })}
          search={searchQuery}
          isSearching={isSearch}
          onOpenApplications={(userId) => setFilters({ ...filters, search: userId })}
          sx={{
            position: 'fixed',
            bottom: 'auto',
            right: 25,
            top: 0,
            width: { drawerWidthOpen },
            left: {
              xs: drawerWidthClose + 25,
              md: drawerWidthOpen + 20
            },
            zIndex: 10
          }}
          query={filters.search}
          filterOptions={filterOptions}
          updateFilters={(f) => updateFilters(f)}
          onReload={() => reload()}
          status={filters.status}
        />
        <SearchBar
          isSearching={isSearch}
          filters={filters}
          cancelSearch={() => setFilters({ ...filters, search: '', page: 1 })}
          onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })}
          onOpenApplications={(userId) => setFilters({ ...filters, search: userId, page: 1 })}
          sx={{
            bottom: 'auto',
            right: 30,
            opacity: 0,
            pointerEvents: 'none',
            width: { drawerWidthOpen },
            left: {
              xs: drawerWidthClose + 30,
              md: drawerWidthOpen + 30
            }
          }}
          query={filters.search}
          filterOptions={filterOptions}
          updateFilters={(f) => updateFilters(f)}
          onReload={() => reload()}
          status={filters.status}
        />
        {fetchedData != null ? (
          <Card>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TableHeader
                  onRequestSort={handleSortRequest}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={fetchedData.results.length}
                />
                {fetchedData.results.length ? (
                  <TableBody>
                    {fetchedData.results.map((row) => {
                      const {
                        _id,
                        applicationOwner,
                        name,
                        status,
                        reviewStatus = {},
                        createdAt,
                        updatedAt
                      } = row;
                      const { reviewer } = reviewStatus;
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={_id}
                          onClick={() => navigate(`/applications/details?id=${_id}`)}
                          role="checkbox"
                          sx={{ cursor: 'pointer' }}
                          hover
                        >
                          <TableCell component="th" scope="row" padding="none">
                            <Stack mx={2} my={1.5}>
                              <Typography variant="subtitle3" fontWeight="600" noWrap>
                                {`${applicationOwner.foreNames} ${applicationOwner.lastName}`}
                              </Typography>
                              {reviewer && (
                                <Typography variant="caption" sx={{ mt: 0 }}>
                                  {reviewer.name}
                                </Typography>
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={2}
                            >
                              <Box sx={{ pt: 1, pb: 1 }}>
                                <Typography variant="subtitle3" textTransform="capitalize" noWrap>
                                  {name}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={2}
                            >
                              <Box sx={{ pt: 1, pb: 1 }}>
                                <Typography variant="subtitle3" textTransform="capitalize" noWrap>
                                  <Chip
                                    label={getStatusDescription(status)}
                                    size="small"
                                    color="primary"
                                    style={{ backgroundColor: getStatusColor(status) }}
                                  />
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle3" noWrap>
                                {fDate(createdAt)}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="center"
                              spacing={2}
                            >
                              <Typography variant="subtitle3" noWrap>
                                {fDateTime(updatedAt)}
                              </Typography>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <Box display="flex" flexDirection="row" justifyContent="end">
              <Pagination
                count={fetchedData.pages || 1}
                page={filters.page || 1}
                onChange={handleChangePage}
                sx={{ marginBottom: 1, marginTop: 1 }}
              />
            </Box>
          </Card>
        ) : (
          <Box
            width="100%"
            height="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        )}
      </Container>
    </Page>
  );
}
