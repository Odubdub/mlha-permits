import { Button, Container, Grid, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFromServer } from 'src/ApiService';
import { AuthContext } from 'src/AuthContext';
import Iconify from 'src/components/Iconify';
import Page from '../../components/Page';
import Conditions from './conditions/Conditions';
import { capitalize, replaceAllUnderscores } from './format';
import Roles from './roles/Roles';
import Users from './user/Users';

export default function Config() {
  const [usersKey, setUsersKey] = useState(1);
  const { userData } = useContext(AuthContext);
  const [department, setDepartment] = useState(null);
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const departmentRef = useRef(null);

  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [services, setServices] = useState([]);
  const serviceRef = useRef(null);
  const [departmentServices, setDepartmentServices] = useState([]);

  const selectDepartment = (department) => {
    setDepartment(department);
    setDepartmentMenuOpen(false);
  };

  const selectService = (service) => {
    setService(service);
    setServiceMenuOpen(false);
  };

  useEffect(() => {
    if (userData != null) {
      if (userData.type == 'developer') {
        getFromServer({
          path: 'authority/departments',
          onComplete: (data) => {
            setDepartments(data);
            setDepartment(data[0]);

            //
            getFromServer({
              path: 'authority/services',
              onComplete: (srvcs) => {
                setServices(srvcs);
                const deptServices = srvcs.filter((s) => s.department == data[0]._id);
                setDepartmentServices(deptServices);
                setService(deptServices[0]);
              },
              onError: (err) => {}
            });
          },
          onError: (error) => {}
        });
      } else {
        setDepartment(userData.department);
        //
        getFromServer({
          path: 'authority/services',
          onComplete: (srvcs) => {
            setServices(srvcs);
            const deptServices = srvcs.filter((s) => s.department == userData.department._id);
            setDepartmentServices(deptServices);
            console.log(deptServices);
            setService(deptServices[0]);
            console.log(deptServices[0]);
          },
          onError: (err) => {}
        });
      }
    }
  }, [userData]);

  useEffect(() => {
    if (department) {
      const deptServices = services.filter((s) => s.department == department._id);
      setDepartmentServices(deptServices);
      setService(deptServices[0]);
    }
  }, [department]);

  return (
    <Page title="Access | Central Permits">
      <div id="configContatiner" />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {`System Configuration`}
          </Typography>
          <Stack alignItems="end">
            {userData.type == 'developer' && department != null && (
              <Button
                color="primary"
                ref={departmentRef}
                sx={{ color: 'primary' }}
                onClick={() => setDepartmentMenuOpen(true)}
                endIcon={<Iconify sx={{ p: 0.5 }} icon="bxs:down-arrow" />}
              >
                {department.name}
              </Button>
            )}
            <Menu
              open={departmentMenuOpen}
              anchorEl={departmentRef.current}
              onClose={() => setDepartmentMenuOpen(false)}
              PaperProps={{
                sx: { maxWidth: '100%', px: 1.6 }
              }}
              sx={{ pb: 0 }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {departments.map((department, index) => (
                <MenuItem color="primary" key={index} onClick={() => selectDepartment(department)}>
                  {department.name}
                </MenuItem>
              ))}
            </Menu>
            {service != null && (
              <>
                <Button
                  color="primary"
                  ref={serviceRef}
                  sx={{ color: 'primary' }}
                  onClick={() => setServiceMenuOpen(true)}
                  endIcon={<Iconify sx={{ p: 0.5 }} icon="bxs:down-arrow" />}
                >
                  {capitalize(replaceAllUnderscores(service.name))}
                </Button>
                <Menu
                  open={serviceMenuOpen}
                  anchorEl={serviceRef.current}
                  onClose={() => setServiceMenuOpen(false)}
                  PaperProps={{
                    sx: { maxWidth: '100%', px: 1.6 }
                  }}
                  sx={{ pb: 0 }}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {departmentServices.map((s, index) => (
                    <MenuItem color="primary" key={index} onClick={() => selectService(s)}>
                      {capitalize(replaceAllUnderscores(s.name))}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <Users key={usersKey} department={department} service={service} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Roles
              onRefreshRoles={() => setUsersKey(usersKey + 1)}
              department={department}
              service={service}
            />
          </Grid>
        </Grid>
        {![undefined, null].includes(service) && (
          <Conditions department={department} service={service} />
        )}
      </Container>
    </Page>
  );
}
