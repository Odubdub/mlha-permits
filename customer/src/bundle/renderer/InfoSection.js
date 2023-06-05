import { CardHeader, ToggleButtonGroup, ToggleButton, Stack } from '@mui/material';
import { da } from 'date-fns/locale';
import React, { useEffect, useRef, useState } from 'react';
import useMeasure from 'react-use-measure';
import Field from './Field';

const InfoSection = ({
  primary = [],
  secondary = [],
  id,
  tertiary = [],
  data,
  rawData,
  primaryTitle = 'No Primary',
  secondaryTitle = 'No Secondary Title',
  tertiaryTitle = 'No Tertiary Title',
  title = 'No Title',
  subheader = 'No Subheader',
  onHeightChanged = null
}) => {
  const [allValues, setAllValues] = useState({});
  const [loaded, setLoaded] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [ref, { height }] = useMeasure();

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

  useEffect(() => {
    if (height) {
      onHeightChanged(id, height);
    }
  }, [height]);

  return (
    <Stack
      sx={{ pb: 2, ml: 2, mt: 2, borderRadius: 2, bgcolor: 'primary.lighter' }}
      ref={ref}
      key={selectedTitle}
    >
      <CardHeader
        title={title}
        sx={{ mb: 2 }}
        subheader={subheader}
        action={
          secondary.length > 0 && (
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
          )
        }
      />
      {loaded.map((i) => {
        const index = loaded.indexOf(i);
        return <Field key={index} info={i} rawData={rawData} data={data} />;
      })}
      {/* <DynamicTable /> */}
    </Stack>
  );
};

export default InfoSection;
