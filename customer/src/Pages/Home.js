import { Stack, Tab, Tabs, Typography, Box, Tooltip, Grid } from '@mui/material'
import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import Iconify from 'src/bundle/Iconify'
import { AuthContext } from 'src/AuthContext'
import Services from './services.json'
import BasicDateCalendar from './Calender'

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
    value: PropTypes.number.isRequired,
  };
  
export const Home = () => {

    const [selectedTab, setSelectedTab] = React.useState(0);
    const { userData, setUsetrData } = useContext(AuthContext);
    const [hoveredWidget, setHoveredWidget] = React.useState(null);
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
      };
    
      const options = [
        {
            label: 'Categories',
            icon: 'material-symbols:category-rounded',
            tooltip: 'Government services by category',
            value: 0
        },
        {
            label: 'Recommended',
            icon: 'octicon:thumbsup-16',
            tooltip: 'Recommended services for you',
            value: 1
        },
        {
            label: 'Trending',
            icon: 'humbleicons:trending-up',
            tooltip: 'Trending services in your area',
            value: 2
        },
        {
            label: 'Favourite',
            icon: 'material-symbols:favorite',
            tooltip: 'Your favourite services',
            value: 3
        },
        {
            label: 'Recent',
            icon: 'humbleicons:trending-up',
            tooltip: 'Recently used services',
            value: 4
        },
        {
            label: 'New',
            icon: 'fluent:new-24-filled',
            tooltip: 'Newly registered services',
            value: 5
        }
      ]

const getTitle = (icon, title, tooltip, index) => {

    return (
        <Tab
        {...{
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        }}
        key={index}
        sx={{ borderTopLeftRadius: 10, borderTopRightRadius: 10}}
        label={
            <Tooltip title={tooltip}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Iconify icon={icon}/>
                    <Typography component="subtitle" sx={{fontWeight: selectedTab == index ? 'bold' : 'normal' }} gutterBottom>
                        {title}
                    </Typography>
                </Stack>
            </Tooltip>
        }
        />
    )

}
  return (
    <Stack height='100vh' maxHeight='100vh' className='bounce-container'>
        <Stack direction="row" mt={9} spacing={2} alignItems="center" className="scroll-bounce">
            <Stack>
                <Typography variant="h4" fontWeight='normal' fontSize={18} ml={2} mt={1} gutterBottom>
                    Welcome back<span style={{marginLeft: 7}}>{ userData.foreNames.split(' ')[0]}</span>!
                </Typography>                
                <Typography variant="caption" fontWeight='normal' fontSize={18} ml={2} gutterBottom>
                    What would you like to do today? Pick from the available services to get started
                </Typography>
                <Tabs value={selectedTab} onChange={handleChange} aria-label="basic tabs example">
                    {options.map((option, index) => getTitle(option.icon, option.label, option.tooltip, index))}
                </Tabs>
                <Grid container spacing={2} mt={2}>
                    {
                        Services.map((service, index) => {
                            const isHovered = hoveredWidget == index;
                            return (<Grid item xs={12} sm={6} md={4} lg={4}>
                            <Stack onMouseOver={()=>setHoveredWidget(index)} sx={{borderRadius: 2, border: '1px solid #e0e0e0', color: isHovered ? '#fff' :'text.primary', bgcolor: isHovered ? 'primary.main' : 'transparent', transition:'ease 0.5s',padding: 2, }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Stack alignItems='center' justifyContent='center' sx={{width: 30, height: 30, borderRadius: 2, p: 1, bgcolor: '#e0e0e0'}}>
                                        <Iconify icon={service.icon} sx={{color: '#fff', fontSize: 26, borderRadius: 2, bgcolor: '#e0e0e0'}}/>
                                    </Stack>
                                    <Typography component="subtitle" sx={{fontWeight: 'bold' }} gutterBottom>
                                        {service.shortName}
                                    </Typography>
                                    
                                </Stack>
                                <Typography component="subtitle" sx={{fontWeight: 'normal',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 3,
                                    overflow: 'hidden',
                                    lineHeight: '1.4',
                                    maxHeight: '2.8rem'}} gutterBottom>
                                    {service.description.short}
                                </Typography>
                                {/* Add a rating field here */}
                                <Stack direction="row" width='100%' alignItems="center" justifyContent='space-between' alignSelf='end'>
                                    <Typography component="subtitle" sx={{fontWeight: 'bold', color: '#808080', mb: 0, fontSize: 11 }} gutterBottom>
                                        {service.description.act}
                                    </Typography>
                                    <Box flex={1}/>
                                    <Typography component="subtitle" sx={{fontWeight: 'normal', mb: 0 }} gutterBottom>
                                        {service.rating}
                                    </Typography>
                                    <Iconify icon='mdi:star' sx={{color: '#fdd835', ml: 0.5, fontSize: 16}}/>
                                </Stack>
                            </Stack>

                        </Grid>)
                        })
                    }
                </Grid>
            </Stack>
            <Stack direction="row" minWidth={500} height={500} bgcolor='red' spacing={2} alignItems="center">
                <BasicDateCalendar/>
            </Stack>
        </Stack>

    </Stack>
  )
}
