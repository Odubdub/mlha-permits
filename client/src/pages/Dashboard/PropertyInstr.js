// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fNumber, formatMadi } from '../../utils/formatNumber';
//
import Iconify from '../../components/Iconify';
import { useContext } from 'react';
import { IsSalesContext } from './IsSalesContext';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: theme.palette.warning.lighter
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

export default function PropertyInstr({data}) {

  const isSales = useContext(IsSalesContext)

  const getTotal = () => {

    if (isSales){
      return `P${formatMadi((data.propertyInstrument_sum.value)/ 100)}`
    }
    return fNumber(data.propertyInstrument_sum.count)
  }

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="fa-solid:laptop-house" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{getTotal()}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        Property Instrument
      </Typography>
    </RootStyle>
  );
}
