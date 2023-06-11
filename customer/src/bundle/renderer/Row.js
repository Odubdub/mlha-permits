import {
  Box,
  Checkbox,
  Chip,
  Divider,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import React, { useContext } from 'react';
import Iconify from '../Iconify';
import { CorrectionsContext } from './CorrectionsContext';
import { DetailFieldsType } from './DetailsFieldsType';

export default function Row({
  desc,
  detail,
  detailFontSize=16,
  center,
  detailFontWeight=null,
  mx,
  title = null,
  isCorrectable = true,
  link,
  missing = [],
  fieldKey,
  rightComponent = null,
  altDetColor,
  type
}) {
  const { corrections, correctionMode, setCorrections } = useContext(CorrectionsContext);
  const hasErrors = missing.includes(fieldKey);
  let isChecked = false;

  if (corrections[fieldKey] != null) {
    isChecked = corrections[fieldKey].checked;
  }

  const toggleCorrectionField = (key) => {
    setCorrections({
      ...corrections,
      [key]: { ...corrections[key], checked: !corrections[key].checked }
    });
  };

  const truncateValue = (input) => {
    if (input.length > 20) {
      return input.substring(0, 17) + '...';
    }
    return input;
  };

  return title != null ? (
    <Box mt={0.5} mb={1}>
      <Typography
        variant="h6"
        sx={{ fontSize: 14, marginLeft: 3, mt: 2, color: hasErrors ? 'red' : '#808080' }}
        noWrap
      >
        {title}
      </Typography>
      <Divider />
    </Box>
  ) : (
    <Box
      sx={{
        ml: mx || 3,
        mr: correctionMode ? 0 : mx || 3,
        mt: isChecked ? 0.2 : 0,
        mb: 0.2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: isChecked || center ? 'center' : 'start'
      }}
      dir="ltr"
    >
      <Box minWidth={160} mt={0.5}>
        <Typography
          variant="body1"
          sx={{ fontSize: 14, color: hasErrors ? 'red' : '#808080' }}
          noWrap
        >
          {desc || 'None'}
        </Typography>
      </Box>
      <Stack direction="row" flex="1">
        {isChecked && correctionMode ? (
          <Box mr={1} flex="1">
            <TextField
              id="outlined-basic"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Checkbox
                      onChange={(e) =>
                        setCorrections({
                          ...corrections,
                          [fieldKey]: { ...corrections[fieldKey], checked: e.target.checked }
                        })
                      }
                      sx={{
                        width: 30,
                        transform: 'translateX(20px)',
                        height: 30,
                        marginRight: 1,
                        bgcolor: 'transparent',
                        opacity: isCorrectable ? 1 : 0
                      }}
                      checked={isChecked}
                      icon={<Iconify icon="ep:close-bold" />}
                      checkedIcon={
                        <Iconify
                          color={isChecked ? 'red' : 'gray'}
                          sx={{ '&:hover': { color: '#fff' } }}
                          icon="ep:close-bold"
                        />
                      }
                    />
                  </InputAdornment>
                )
              }}
              error={corrections[fieldKey].messageError}
              onChange={(e) =>
                setCorrections({
                  ...corrections,
                  [fieldKey]: { ...corrections[fieldKey], message: e.target.value }
                })
              }
              value={corrections[fieldKey].message || ''}
              label={truncateValue(detail)}
              name={fieldKey}
              placeholder="Correction description"
              sx={{ mt: 1 }}
              variant="outlined"
            />
          </Box>
        ) : rightComponent != null ? (
          rightComponent
        ) : (
          <Box flex="1" display="flex" flexDirection="row">
            <Box flex="1">
              {type == DetailFieldsType.Chip ? (
                <Chip
                  label={detail}
                  color={getColor(detail)}
                  size="small"
                  sx={{ height: 'auto', ml: 2 }}
                />
              ) : type == DetailFieldsType.Link ? (
                <Link sx={{ textDecoration: 'none' }} href={link} target="_blank" rel="noreferrer">
                  <Typography variant="body1" sx={{ fontSize: 14 }} noWrap>
                    printout.pdf
                  </Typography>
                </Link>
              ) : (
                <Box
                  mt={0.5}
                  px={2}
                  mr={1}
                  py={altDetColor != null ? 0.3 : 0}
                  ml={altDetColor != null ? 2 : 0}
                  borderRadius={1}
                  bgcolor={altDetColor != null ? '#eee' : 'transparent'}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontSize: detailFontSize, fontWeight: detailFontWeight, color: isChecked ? 'red' : altDetColor || '#000' }}
                  >
                    {detail}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              {correctionMode && isCorrectable && (
                <Checkbox
                  onChange={(e) => toggleCorrectionField(fieldKey)}
                  sx={{
                    width: 30,
                    height: 30,
                    marginRight: '9px',
                    bgcolor: isChecked ? '#ff000020' : 'transparent',
                    '&:hover': { bgcolor: '#ff000020', color: 'red' },
                    opacity: isCorrectable ? 1 : 0
                  }}
                  checked={isChecked}
                  icon={<Iconify color="red" icon="fxemoji:heavyexclaimationmarksymbol" />}
                  checkedIcon={
                    <Iconify
                      color={isChecked ? 'red' : 'gray'}
                      sx={{ '&:hover': { color: '#fff' } }}
                      icon="ep:close-bold"
                    />
                  }
                />
              )}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

const getColor = (type) => {
  if ((type || '').toLowerCase().includes('pending')) {
    return 'error';
  } else if ((type || '').toLowerCase().includes('success')) {
    return 'primary';
  } else if ((type || '').toLowerCase().includes('approved')) {
    return 'success';
  }
  return 'primary';
};
