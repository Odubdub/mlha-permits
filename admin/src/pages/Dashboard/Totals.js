// material
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';
// utils
import { fNumber, formatMadi, fShortenNumber } from '../../utils/formatNumber';
// component
import Iconify from '../../components/Iconify';
import { useContext } from 'react';
import { IsSalesContext } from './IsSalesContext';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.lighter
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
  color: theme.palette.primary.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    theme.palette.primary.dark,
    0.24
  )} 100%)`
}));

export default function AppWeeklySales({data}) {

  const isSales = useContext(IsSalesContext)

  const getTotal = () => {

    if (isSales){
      return `P${formatMadi((data.marriages_sum.value + data.propertyInstrument_sum.value + data.nameChange_sum.value)/ 100)}`
    }
    return fNumber(data.marriages_sum.count + data.propertyInstrument_sum.count + data.nameChange_sum.count)
  }

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="tabler:sum" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{getTotal()}</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {isSales ? 'Total Sales' : 'Total Registrations'}
      </Typography>
    </RootStyle>
  );
}
