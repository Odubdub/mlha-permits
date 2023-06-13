import {
  Stack,
  Tab,
  Tabs,
  Typography,
  Box,
  Tooltip,
  Grid,
  List,
  Divider,
  colors,
  Chip,
  Modal
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Iconify from 'src/bundle/Iconify';
import { AuthContext } from 'src/AuthContext';
import { ServiceModal } from './ServiceModal';
import Calendar from 'react-calendar';
import './calendar.css';
import { LoadingButton } from '@mui/lab';
import TextTransition, { presets } from 'react-text-transition';
import { AllServices } from './services/services';
import NotificationDetails from 'src/layouts/dashboard/NotificationDetails';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export const Home = ({ notification, setNotification }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { userData, setUserData } = useContext(AuthContext);
  const [selectedService, setSelectedService] = React.useState(null);
  const [showServiceModal, setShowServiceModal] = React.useState(false);
  const [hoveredWidget, setHoveredWidget] = React.useState(null);
  const [value, onChange] = React.useState(new Date());
  const [shownIndex, setShownIndex] = useState(0);
  const [services, setServices] = useState(AllServices);

  const [titles, setTitles] = useState([
    'Welcome to our online portal! Experience convenient government service applications.',
    'Step into the future of government services! Apply effortlessly online.',
    'Smoothly transition to efficient online government services.',
    'Welcome aboard! Embrace convenience with our digital platform.',
    'Enjoy the digital revolution in government services.',
    'Say goodbye to paperwork and hello to online convenience.',
    'Welcome to our virtual gateway! Access government services with ease.',
    'Embrace the future of efficient government services.',
    'Welcome to digital empowerment! Apply for services anytime, anywhere.',
    'Enjoy streamlined online government services.'
  ]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
    if (newValue == 0) {
      setServices(AllServices);
    } else if (newValue == 1) {
      if (userData.idType == 'OMANG') {
        setServices(
          AllServices.filter((service) => service.category.toLowerCase() == 'recruitment')
        );
      } else {
        setServices(
          AllServices.filter((service) => service.category.toLowerCase() != 'recruitment')
        );
      }
    } else if (newValue == 2) {
      setServices(
        [...AllServices]
          .sort(function (a, b) {
            return a.trending_weight - b.trending_weight;
          })
          .slice(0, 15)
      );
    } else if (newValue == 3) {
      setServices(AllServices.filter((service) => service.favourite == true));
    } else {
      setServices(AllServices);
    }
  };

  const getCategoryColor = (category) => {
    return (
      {
        Citizenship: 'success.main',
        Immigration: 'secondary.main',
        Recruiters: 'warning.main',
        Visa: 'error.main',
        'Work Permit': 'purple',
        Recruitment: 'orange'
      }[category] || 'primary.main'
    );
  };

  const options = [
    {
      label: 'All Services',
      icon: 'material-symbols:category-rounded',
      tooltip: 'Government services by category',
      value: 0,
      color: 'primary.main',
      indicatorColor: 'red'
    },
    {
      label: 'Recommended',
      icon: 'fa-solid:thumbs-up',
      tooltip: 'Recommended services for you',
      value: 1,
      color: 'success.main',
      indicatorColor: 'red'
    },
    {
      label: 'Trending',
      icon: 'humbleicons:trending-up',
      tooltip: 'Trending services in your area',
      value: 2,
      color: 'warning.main',
      indicatorColor: 'red'
    },
    {
      label: 'Favourite',
      icon: 'material-symbols:favorite',
      tooltip: 'Your favourite services',
      value: 3,
      color: 'error.main',
      indicatorColor: 'red'
    },
    {
      label: 'Recent',
      icon: 'majesticons:clock',
      tooltip: 'Recently used services',
      value: 4,
      color: 'info.main',
      indicatorColor: 'red'
    },
    {
      label: 'New',
      icon: 'ph:star-fill',
      tooltip: 'Newly registered services',
      value: 5,
      color: 'secondary.main',
      indicatorColor: 'red'
    }
  ];

  const selectService = (service) => {
    setSelectedService(service);
    setShowServiceModal(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setShownIndex((shownIndex + 1) % titles.length);
    }, 4000);
  }, [shownIndex]);

  useEffect(() => {
    const cats = {};

    AllServices.forEach((service) => {
      if (!cats[service.category]) {
        cats[service.category] = [];
      }

      cats[service.category].push(service.serviceCode);
    });

    console.log(cats);
  }, []);

  const getTitle = (option, index) => {
    return (
      <Tab
        {...{
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
          color: selectedTab == option.value ? 'primary.main' : option.color
        }}
        key={index}
        sx={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        label={
          <Tooltip title={option.tooltip}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Iconify icon={option.icon} sx={{ color: option.color, fontSize: 20 }} />
              <Typography
                variant="subtitle"
                sx={{
                  fontWeight: selectedTab == index ? 'bold' : 'normal',
                  color: selectedTab == index ? option.color : null
                }}
                gutterBottom
              >
                {option.label}
              </Typography>
            </Stack>
          </Tooltip>
        }
      />
    );
  };

  console.log(notification);

  return (
    <Stack height="100vh" maxHeight="calc(100vh - 24px)" className="bounce-container">
      <Typography variant="h4" mt={9} fontWeight="normal" fontSize={18} ml={2} gutterBottom>
        Welcome back
        <span style={{ marginLeft: 7 }}>{((userData || {}).foreNames || '').split(' ')[0]}</span>!
      </Typography>
      <TextTransition
        style={{ color: '#414141', fontWeight: 'normal', fontSize: 18, marginLeft: 16 }}
        text={titles[shownIndex]}
        springConfig={presets.molasses}
      />
      <ServiceModal
        open={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        service={selectedService}
      />

      <Stack
        direction="row"
        flex={1}
        maxHeight="calc(100vh - 175px)"
        justifyContent="start"
        className="scroll-bounce"
      >
        <Stack>
          <Tabs
            TabIndicatorProps={{ style: { background: '#hex-color' } }}
            value={selectedTab}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {options.map((option, index) => getTitle(option, index))}
          </Tabs>
          <Box width="100%" bgcolor="#80808020" mr={2} height="0.5px" />
          <Stack flex={1} maxHeight="calc(100% - 48px)" px={2} sx={{ overflow: 'scroll' }}>
            <Grid container spacing={1.5} mt={2} pb={2}>
              {services.map((service, index) => {
                const isHovered = hoveredWidget == index;
                return (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                    <Stack
                      onClick={() => selectService(service)}
                      onMouseOver={() => setHoveredWidget(index)}
                      onMouseLeave={() => setHoveredWidget(-1)}
                      sx={{
                        borderRadius: 2,
                        boxShadow: 'rgba(0, 0, 0, 0.1) 1px 1px 5px;',
                        color: isHovered ? '#fff' : 'text.primary',
                        bgcolor: isHovered ? 'primary.main' : '#ffffff',
                        transform: isHovered ? 'scale(1.1)' : null,
                        transition: 'all ease 0.3s',
                        padding: 2
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          sx={{ width: 30, height: 30, borderRadius: 2, p: 1, bgcolor: '#e0e0e0' }}
                        >
                          <Iconify
                            icon={service.icon}
                            sx={{
                              color: '#fff',
                              fontSize: 26,
                              borderRadius: 2,
                              bgcolor: '#e0e0e0'
                            }}
                          />
                        </Stack>
                        <Typography component="subtitle" sx={{ fontWeight: 'bold' }} gutterBottom>
                          {service.shortName}
                        </Typography>
                      </Stack>
                      <Typography
                        component="subtitle"
                        sx={{
                          fontWeight: 'normal',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 3,
                          overflow: 'hidden',
                          lineHeight: '1.4',
                          maxHeight: '2.8rem'
                        }}
                        gutterBottom
                      >
                        {service.description.short}
                      </Typography>
                      {/* Add a rating field here */}
                      <Stack
                        direction="row"
                        width="100%"
                        alignItems="center"
                        justifyContent="space-between"
                        alignSelf="end"
                      >
                        <Stack
                          children={service.category}
                          color={isHovered ? getCategoryColor(service.category) : '#fff'}
                          sx={{ textTransform: 'uppercase', fontSize: 13 }}
                          py={0.2}
                          px={1}
                          borderRadius={2}
                          bgcolor={isHovered ? '#ffffff' : getCategoryColor(service.category)}
                          size="small"
                        />
                        <Box flex={1} />
                        <Typography
                          component="subtitle"
                          sx={{ fontWeight: 'normal', mb: 0, fontSize: 12 }}
                          gutterBottom
                        >
                          {service.serviceCode}
                        </Typography>
                        <Iconify icon="mdi:star" sx={{ color: '#fdd835', ml: 0.5, fontSize: 16 }} />
                      </Stack>
                      <Typography
                        component="subtitle"
                        mt={1}
                        sx={{
                          fontWeight: 'bold',
                          color: isHovered ? '#000000' : '#808080',
                          mb: 0,
                          fontSize: 11
                        }}
                        gutterBottom
                      >
                        {service.description.act}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Stack>
        <Stack minWidth={400} bgcolor="#ffffff" borderRadius={2} mb={2} mx={3} mt={8}>
          <Calendar onChange={onChange} value={value} />
          <Divider />
          <Typography
            textAlign="center"
            mt={1}
            variant="h6"
            color="primary.main"
            fontSize={12}
            ml={2}
            fontWeight={400}
          >
            Upcoming Appointments
          </Typography>
          <Stack justifyContent="center" alignItems="center" flex={1}>
            You have no upcoming appointments
          </Stack>
          <Stack justifySelf="bottom" px={10} pb={2}>
            <LoadingButton variant="contained" endIcon={<Iconify icon="majesticons:clock" />}>
              Make and Appointment
            </LoadingButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
