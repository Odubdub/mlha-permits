import { LoadingButton } from '@mui/lab';
import {
  Box,
  Checkbox,
  Tooltip,
  Divider,
  InputAdornment,
  IconButton,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  Zoom
} from '@mui/material';
import React, { useContext, useState } from 'react';
import { WidgetType } from '../constants';
import Iconify from '../Iconify';
import { getFieldInfo, getFieldValue } from './DataSource';
import { formatText } from './Formatters';
import DynamicTable from './DynamicTable';
import { CorrectionsContext } from './CorrectionsContext';
// import StaticTable from './StaticTable';
import MoreInfo from './MoreInfo';
import Doc from './Doc';
import CopyField from './CopyField';
import { getAllPropertyValues } from '../DataTransformer';

export default function Field({ info, data, storageHost, rawData }) {
  const {
    desc,
    source,
    tableAction: tableTitle,
    descInfo,
    blame,
    table,
    reportServices = [data.serviceCode],
    formatter,
    mx,
    toolTipInfo,
    infoType,
    title = null,
    correctable = true,
    link,
    missing = [],
    key,
    altDetColor,
    path,
    field,
    style = {}
  } = info;
  const [showTable, setShowTable] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [moreInfo, setMoreInfo] = useState({
    show: false,
    info: [],
    title: 'No Title',
    subtitle: 'Subtitle',
    infoType
  });
  const [showReport, setShowReport] = useState(false);

  //The field Value
  let value;
  if (path) {
    value = getFieldValue({ data, path });
  } else {
    value = getFieldInfo({ data, key, source: source });
  }
  //The formatted Value
  let detail = formatText({ value, formatter, field, info });

  //
  const {
    corrections,
    correctionMode,
    applicationFixes = {},
    setCorrections
  } = useContext(CorrectionsContext);

  const correction = ((data.applicationFixes || {}).allFixes || []).find((f) => f.key == key);

  const returned = (applicationFixes.fieldsToFix || []).includes(key);
  const missingField =
    [undefined, 'undefined', null, 'null', ''].includes(value) && field != WidgetType.staticTable;

  const hasErrors = missing.includes(key);

  let isChecked = false;

  if (corrections[key] != null) {
    isChecked = corrections[key].checked;
  }

  const buttonStyle = {
    color: returned ? 'red' : undefined,
    transform: 'translate(0px,-3px)',
    '&:hover': { bgcolor: returned ? '#ff000020' : undefined }
  };

  const toggleCorrectionField = (key) => {
    setCorrections({
      ...corrections,
      [key]: { ...corrections[key], checked: !corrections[key].checked }
    });
  };

  const truncateValue = (input) => {
    if (input.length > 20) {
      return input.substring(0, 30) + '...';
    }

    return input;
  };

  const isObject = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Object]';
  };

  const getAlignment = (isChecked) => {
    if (
      isChecked ||
      [
        WidgetType.copyfield,
        WidgetType.moreInfo,
        WidgetType.chip,
        WidgetType.squareChip,
        WidgetType.attachment,
        WidgetType.staticTable,
        WidgetType.table
      ].includes(field)
    ) {
      return 'center';
    } else {
      return 'start';
    }
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
  ) : field == WidgetType.notes ? (
    <>
      <Stack
        direction="row"
        sx={{
          color: hasErrors || returned ? 'red' : '#808080',
          mx: mx || 3
        }}
        alignItems="center"
      >
        <Typography variant="caption" sx={{ fontSize: 14, mt: 0.5 }}>
          <span style={{ fontWeight: 'bold', color: '#000', minWidth: 160 }}>{`${desc}: `}</span>
          <span style={{ marginLeft: 10 }}>{` '${detail}'`}</span>
        </Typography>
      </Stack>
    </>
  ) : (
    <Box
      sx={{
        ml: mx || 3,
        mr: correctionMode ? 0 : mx || 3,
        mt: isChecked ? 0.2 : 0,
        mb: 0.2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: getAlignment(isChecked)
      }}
      dir="ltr"
    >
      <Stack direction="row" alignItems="center" minWidth={160} mt={0.5}>
        <Tooltip
          title={
            missingField ? `Information missing${descInfo ? ` | ${descInfo}` : ''}` : descInfo || ``
          }
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              color: hasErrors || returned || missingField ? '#808080' : '#808080'
            }}
            noWrap
          >
            {desc}
          </Typography>
        </Tooltip>
      </Stack>
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
                          [key]: { ...corrections[key], checked: e.target.checked }
                        })
                      }
                      sx={{
                        width: 30,
                        transform: 'translateX(20px)',
                        height: 30,
                        marginRight: 1,
                        bgcolor: 'transparent',
                        opacity: correctable ? 1 : 0
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
              error={corrections[key].messageError}
              onChange={(e) =>
                setCorrections({
                  ...corrections,
                  [key]: { ...corrections[key], message: e.target.value }
                })
              }
              value={corrections[key].message || ''}
              label={
                typeof data.applicationDetails[key] == 'object'
                  ? desc
                  : truncateValue(detail || 'Table')
              }
              name={key}
              placeholder="Correction description"
              sx={{ mt: 1 }}
              variant="outlined"
            />
          </Box>
        ) : missingField ? (
          <Tooltip title={'No Information'} TransitionComponent={Zoom}>
            <Stack direction="row" ml={2} color="#000" alignItems="center" mt="2px">
              <Iconify fontSize={18} icon={'heroicons:no-symbol-20-solid'} />
              <Typography
                variant="subtitle1"
                sx={{ fontSize: 16, ml: 1, fontWeight: 300, fontStyle: 'italic' }}
              >
                N/A
              </Typography>
            </Stack>
          </Tooltip>
        ) : (
          <Box flex="1" display="flex" flexDirection="row">
            <Box flex="1">
              {field == WidgetType.chip ? (
                <Box
                  sx={{
                    minWidth: 32,
                    minHeight: 32,
                    ml: 2,
                    bgcolor: 'gray',
                    color: 'white',
                    borderRadius: 3,
                    width: 'fit-content',
                    textAlign: 'center',
                    px: 1.3,
                    py: 0.5,
                    ...getAllPropertyValues({ data: rawData, fieldKey: path, conf: style })
                  }}
                >
                  {value}
                </Box>
              ) : field == WidgetType.squareChip ? (
                <Box
                  sx={{
                    minWidth: 32,
                    minHeight: 32,
                    ml: 2,
                    bgcolor: 'gray',
                    color: 'white',
                    borderRadius: 1,
                    width: 'fit-content',
                    textAlign: 'center',
                    px: 1,
                    py: 0.5,
                    ...getAllPropertyValues({ data: rawData, fieldKey: key || path, conf: style })
                  }}
                >
                  {value}
                </Box>
              ) : field == WidgetType.link ? (
                <Link sx={{ textDecoration: 'none' }} href={link} target="_blank" rel="noreferrer">
                  <Typography variant="body1" sx={{ fontSize: 14 }} noWrap>
                    printout.pdf
                  </Typography>
                </Link>
              ) : field == WidgetType.attachment ? (
                <Stack direction="row">
                  {isObject(value) ? (
                    <>
                      <Tooltip title={`View document in new tab`}>
                        <IconButton sx={{ height: 34, width: 34, ...buttonStyle }}>
                          <Link
                            sx={{ textDecoration: 'none', color: '#808080', fontSize: 18 }}
                            href={`${storageHost}download/${value.bucket}/${value.key}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Iconify icon="fluent:document-16-filled" />
                          </Link>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={`Download this file`}>
                        <IconButton sx={{ height: 34, width: 34, ...buttonStyle }}>
                          <Link
                            sx={{ textDecoration: 'none', color: '#808080', fontSize: 18 }}
                            href={`${storageHost}download/${value.bucket}/${value.key}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Iconify icon="eva:cloud-download-outline" />
                          </Link>
                        </IconButton>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title={`No document uploaded`}>
                        <Stack direction="row">
                          <IconButton
                            disabled
                            color="error"
                            sx={{ height: 34, width: 34, ...buttonStyle }}
                          >
                            <Iconify icon="fluent:document-16-filled" />
                          </IconButton>
                        </Stack>
                      </Tooltip>
                      <Tooltip title={`No file to download`}>
                        <Stack direction="row">
                          <IconButton
                            disabled
                            color="error"
                            sx={{ height: 34, width: 34, ...buttonStyle }}
                          >
                            <Iconify icon="eva:cloud-download-outline" />
                          </IconButton>
                        </Stack>
                      </Tooltip>
                      <Button
                        disabled
                        sx={{ height: 34, ...buttonStyle, fontStyle: 'italic', fontWeight: 300 }}
                      >
                        {value.length == 20 ? 'Not Resolved' : `No document`}
                      </Button>
                    </>
                  )}
                  {
                    // check if suffix is '.pdf'
                    (value.extension || '').includes('pdf') && (
                      <Tooltip title={`View document overlay`}>
                        <Button
                          onClick={() => setShowMore(true)}
                          sx={{ height: 34, ...buttonStyle }}
                        >
                          {`Preview`}
                        </Button>
                      </Tooltip>
                    )
                  }
                  <Box></Box>
                  <Doc
                    onClose={() => setShowMore(false)}
                    urla={value}
                    url={`${storageHost}download/${value.bucket}/${value.key}`}
                    open={showMore}
                  />
                </Stack>
              ) : field == WidgetType.table ? (
                <>
                  <LoadingButton
                    onClick={() => setShowTable(true)}
                    startIcon={<Iconify icon="bi:table" sx={{ width: 20, height: 20, ml: 1 }} />}
                  >
                    {tableTitle}
                  </LoadingButton>
                  <DynamicTable
                    open={showTable}
                    onClose={() => setShowTable(false)}
                    title={desc}
                    rows={data.applicationDetails[key]}
                    tableConfig={table}
                  />
                </>
              ) : field == WidgetType.staticTable ? (
                <>
                  <LoadingButton
                    onClick={() => setShowTable(true)}
                    startIcon={<Iconify icon="bi:table" sx={{ width: 20, height: 20, ml: 1 }} />}
                  >
                    {tableTitle}
                  </LoadingButton>
                  {/* <StaticTable
                    open={showTable}
                    data={data}
                    onClose={() => setShowTable(false)}
                    title={desc}
                    rows={data.applicationDetails[key]}
                    tableConfig={table}
                  /> */}
                </>
              ) : field == WidgetType.moreInfo ? (
                <>
                  <Tooltip
                    key={moreInfo.loading || moreInfo.show}
                    title={
                      (infoType || []).includes('company')
                        ? 'Validate with CIPA'
                        : 'Validate with eID(Omang)'
                    }
                    TransitionComponent={Zoom}
                  >
                    <LoadingButton
                      sx={{ ml: 1, ...buttonStyle }}
                      onClick={() => setMoreInfo({ ...moreInfo, loading: true, show: true })}
                      loadingPosition="end"
                      endIcon={
                        <Iconify
                          icon="akar-icons:circle-chevron-right-fill"
                          sx={{ width: 20, height: 20 }}
                        />
                      }
                    >
                      {detail}
                    </LoadingButton>
                  </Tooltip>
                  <MoreInfo
                    open={moreInfo.show}
                    regNo={detail}
                    info={moreInfo}
                    onClose={() => setMoreInfo({ ...moreInfo, loading: false, show: false })}
                    setInfo={(i) => setMoreInfo(i)}
                  />
                  {reportServices.length > 0 && (
                    <>
                      {(infoType || []).includes('report') && (
                        <Tooltip title={`View report on ${desc}`}>
                          <LoadingButton
                            sx={{ ml: 1, ...buttonStyle }}
                            onClick={() => setShowReport(true)}
                            loadingPosition="end"
                            endIcon={
                              <Iconify
                                icon="bi:file-earmark-bar-graph-fill"
                                sx={{ width: 20, height: 20 }}
                              />
                            }
                          >
                            Report
                          </LoadingButton>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              ) : field == WidgetType.declaration ? (
                <Tooltip title={toolTipInfo} TransitionComponent={Zoom}>
                  <Stack direction="row" ml={1} alignItems="center" mt="2px">
                    <Iconify
                      fontSize={18}
                      icon={value ? 'akar-icons:circle-check-fill' : 'ep:circle-close-filled'}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{ fontSize: 16, ml: 1, color: isChecked ? 'red' : altDetColor || '#000' }}
                    >
                      {value ? 'Checked' : 'Not Checked'}
                    </Typography>
                  </Stack>
                </Tooltip>
              ) : field == WidgetType.copyfield ? (
                <Stack ml={1} mt="2px">
                  <CopyField title={value} text={value} />
                  <Typography />
                </Stack>
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
                    sx={{
                      fontSize: 16,
                      textOverflow: 'hidden',
                      textDecoration:
                        returned && data.status == 'returned' ? 'line-through wavy red 1px' : '',
                      color: altDetColor || '#000'
                    }}
                  >
                    {missingField ? 'Missing Field' : detail}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box>
              {((correctionMode && correctable) || returned) && (
                <>
                  {correctionMode && correctable ? (
                    <Checkbox
                      onChange={(e) => toggleCorrectionField(key)}
                      sx={{
                        width: 30,
                        height: 30,
                        marginRight: '9px',
                        bgcolor: isChecked ? '#ff000020' : 'transparent',
                        '&:hover': { bgcolor: '#ff000020', color: 'red' },
                        opacity: correctable ? 1 : 0
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
                  ) : (
                    <Tooltip
                      title={
                        <>
                          <Typography component="h4" fontWeight={600} fontSize={12}>
                            Returned with message:
                          </Typography>
                          <Divider />
                          <Typography component="p" fontSize={12}>
                            {applicationFixes.allFixes.find((f) => f.key == key).fixDescription}
                          </Typography>
                        </>
                      }
                    >
                      <Stack alignContent="center" justifyContent="center" height={30}>
                        <Iconify color="red" icon="icomoon-free:undo2" />
                      </Stack>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
            <Box>
              {data.status != 'returned' && correction && !correctionMode && (
                <>
                  {
                    <Tooltip
                      title={
                        field == WidgetType.table ? (
                          ''
                        ) : (
                          <>
                            <Typography component="h4" fontWeight={600} fontSize={12}>
                              {`Corrected ${correction.prev ? 'from:' : ''}`}
                            </Typography>
                            {correction.prev && (
                              <>
                                <Divider />
                                <Typography component="h4" fontWeight={400} fontSize={12}>
                                  {`'${formatText({
                                    value: correction.prev,
                                    formatter,
                                    field,
                                    info
                                  })}'`}
                                </Typography>
                              </>
                            )}
                          </>
                        )
                      }
                    >
                      <Stack alignContent="center" justifyContent="center" height={30}>
                        <Iconify color="gray" icon="icomoon-free:undo2" />
                      </Stack>
                    </Tooltip>
                  }
                </>
              )}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

const getColor = (type) => {
  if (type.toLowerCase().includes('pending')) {
    return 'error';
  } else if (type.toLowerCase().includes('success')) {
    return 'primary';
  } else if (type.toLowerCase().includes('pending')) {
  } else if (type.toLowerCase().includes('pending')) {
  } else if (type.toLowerCase().includes('pending')) {
  }
  return 'yellow';
};
