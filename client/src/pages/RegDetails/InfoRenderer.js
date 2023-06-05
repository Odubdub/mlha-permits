import { Card, IconButton, CardHeader, ToggleButtonGroup, ToggleButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Iconify from 'src/components/Iconify';
import Field from './Field';

const InfoRenderer = ({
  primary = [],
  secondary = [],
  tertiary = [],
  data,
  primaryTitle = 'No Primary',
  secondaryTitle = 'No Secondary Title',
  tertiaryTitle = 'No Tertiary Title',
  title = 'No Title',
  subheader = 'No Subheader'
}) => {
  const [allValues, setAllValues] = useState({});
  const [loaded, setLoaded] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');

  const changeLoaded = (key) => {
    setLoaded(allValues[key]);
    setSelectedTitle(key);
  };

  useEffect(() => {
    const obj = {};

    if (primary.length > 0) {
      obj[primaryTitle] = primary;
    }

    if (tertiary.length > 0) {
      obj[tertiaryTitle] = tertiary;
    }

    if (secondary.length > 0) {
      obj[secondaryTitle] = secondary;
    }

    setAllValues(obj);
    setLoaded(Object.values(obj)[0] || []);
    setSelectedTitle(Object.keys(obj)[0] || '');
  }, []);

  return (
    <Card sx={{ pb: 2 }} key={selectedTitle}>
      <CardHeader
        title={title}
        sx={{ mb: 2 }}
        subheader={subheader}
        action={
          secondary.length > 0 ? (
            <ToggleButtonGroup size="small">
              {Object.keys(allValues).map((key, index) => {
                return (
                  <ToggleButton
                    key={index}
                    value={key}
                    disabled={loaded == allValues[key]}
                    onClick={() => {
                      changeLoaded(key);
                    }}
                  >
                    {key}
                  </ToggleButton>
                );
              })}
            </ToggleButtonGroup>
          ) : (
            <IconButton aria-label="settings">
              <Iconify icon="ion:refresh-circle" />
            </IconButton>
          )
        }
      />
      {loaded.map((i) => {
        const index = loaded.indexOf(i);
        return <Field key={index} info={i} data={data} />;
      })}
      {/* <DynamicTable /> */}
    </Card>
  );
};

export default InfoRenderer;
