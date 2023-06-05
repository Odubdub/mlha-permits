import { Grid, Stack } from '@mui/material';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useState } from 'react';
import { render } from 'react-dom';
import { ref } from 'yup';
import { FieldTypes } from '../constants';
import {
  getDependancyValue,
  getDropdownValueLabel,
  getFieldValue,
  setValueToKey,
  sortArrayOfObjects
} from '../DataTransformer';
import { isNotValue } from '../validator';
import InfoSection from './InfoSection';

export const DetailsPage = ({ config, data, maxHeight, height, formSections }) => {
  const heightsRef = useRef({});
  const containerRef = useRef(null);
  const containerWidthRef = useRef(null);
  const [renderSingle, setRenderSingle] = useState(false);
  const modConfig = useRef([]);
  const [rendered, setRendered] = useState([[]]);
  const [renderKey, setRenderKey] = useState(0);
  const [formData, setFormData] = useState({});

  const splitArray = (nums) => {
    nums.sort((a, b) => b.height - a.height); // Sort the objects based on the height in descending order
    const array1 = [];
    const array2 = [];
    let sum1 = 0;
    let sum2 = 0;

    for (let { id, height } of nums) {
      if (sum1 <= sum2) {
        array1.push(id);
        sum1 += height;
      } else {
        array2.push(id);
        sum2 += height;
      }
    }

    return [array1, array2];
  };

  const setHeight = (id, height) => {
    if (Object.keys(heightsRef.current).length === config.length) return;

    heightsRef.current[id] = height;

    if (Object.keys(heightsRef.current).length === config.length) {
      const input = Object.entries(heightsRef.current).map(([id, height]) => ({ id, height }));
      const split = splitArray(Object.values(input));
      const newRendered = [];
      split.forEach((arr) => {
        const newArr = [];
        arr.forEach((id) => {
          const val = modConfig.current.find((conf) => conf.id == id);
          newArr.push(val);
        });
        newRendered.push(newArr);
      });

      // If id '1' i in the second array swap the arrays
      let reordered = newRendered;
      const firstSec = newRendered[0].find((sec) => sec.id == 0);
      if (!firstSec) {
        const first = sortArrayOfObjects(newRendered[1], 'id');
        const second = sortArrayOfObjects(newRendered[0], 'id');
        reordered = [first, second];
      } else {
        const first = sortArrayOfObjects(newRendered[0], 'id');
        const second = sortArrayOfObjects(newRendered[1], 'id');
        reordered = [first, second];
      }

      // console.log(reordered);

      if (containerWidthRef.current < 950) {
        setRenderSingle(true);
      }

      setRendered(reordered);
      setRenderKey(renderKey + 1);
    }
  };

  const resetParams = () => {
    const newConfig = [];
    config.forEach((obj, i) => {
      const newObj = { ...obj };
      newObj.id = i;
      newConfig.push(newObj);
    });

    // Reset the render logic
    modConfig.current = newConfig;
    heightsRef.current = {};
    setRendered([newConfig]);
    setRenderKey(0);
  };

  useLayoutEffect(() => {
    // If the component width is less than 950px, render all the sections in a single column
    if (!isNotValue(containerWidthRef.current)) {
      if (containerWidthRef.current < 950) {
        setRenderSingle(true);
      } else {
        setRenderSingle(false);
      }
    } else {
      containerWidthRef.current = (containerRef.current || {}).offsetWidth;
    }
  }, [containerRef.current]);

  useEffect(() => {
    resetParams();
  }, [formSections, containerWidthRef.current, config, data]);

  useEffect(() => {
    // Add an event listener to recalculate the rows when the component width changes
    const handleResize = () => {
      const componentWidth = (containerRef.current || {}).offsetWidth;
      containerWidthRef.current = componentWidth;
    };

    window.addEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let newData = JSON.parse(JSON.stringify(data));

    // Fix dropdown values to show the label instead of the value
    if (formSections) {
      formSections.forEach((section, i) => {
        section.fields.forEach((field) => {
          const value = getFieldValue({ data: data, path: field.fieldName });

          const options =
            getDependancyValue({
              property: 'options',
              value,
              data,
              dependancies: field.dependancies
            }) || field.options;

          if (!isNotValue(value)) {
            if (
              [
                FieldTypes.Dropdown,
                FieldTypes.DynamicDropdown,
                FieldTypes.DropdownWithOther,
                FieldTypes.DynamicDropDownSearch
              ].includes(field.fieldType)
            ) {
              const newValue = getDropdownValueLabel(value, options);
              newData = setValueToKey({ data: newData, path: field.fieldName, value: newValue });
            } else if (field.fieldType == FieldTypes.DropdownMulti) {
              const newValue = value.map((subvalue) => getDropdownValueLabel(subvalue, options));
              newData = setValueToKey({ data: newData, path: field.fieldName, value: newValue });
            }
          }
        });
      });
    }

    setFormData(newData);

    // Add an event listener to recalculate the rows when the component width changes
    const handleResize = () => {
      resetParams();
    };

    window.addEventListener('resize', handleResize);
  }, [data, formSections]);

  return (
    <Stack
      mr={2}
      key={renderKey}
      pb={2}
      maxHeight={maxHeight}
      height={height}
      ref={containerRef}
      width="calc(100vw - 482px)"
      direction="row"
      sx={{ overflow: 'auto', maxWidth: '100%' }}
    >
      {(renderSingle ? [modConfig.current] : rendered).map((side, i) => {
        return (
          <Stack
            key={i}
            mb={2}
            flex={1}
            maxWidth={renderSingle ? `calc(100% - 12px)` : `calc(50% - 12px)`}
          >
            {rendered.length > 0 &&
              (side || []).map((section, i) => {
                return (
                  <InfoSection
                    key={i}
                    title={section.title}
                    subheader={section.subtitle}
                    id={section.id}
                    data={formData}
                    rawData={data}
                    onHeightChanged={setHeight}
                    primary={section.fields}
                  />
                );
              })}
          </Stack>
        );
      })}
    </Stack>
  );
};
