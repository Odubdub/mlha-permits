import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber, formatMadi } from '../../utils/formatNumber';
//
import { BaseOptionChart } from '../../components/charts';
import { useContext, useState } from 'react';
import { IsSalesContext } from './IsSalesContext';

// ----------------------------------------------------------------------

export default function OfficesStats({offices}) {

  const isSales = useContext(IsSalesContext)
  const registrations = [{ data: offices.map(e=>(e.count)) }]
  const sales = [{ data: offices.map(e=>(e.value/100)) }]
  const allOffices = offices.map(e=>e.descr)

  const getMax = () => {

    const arr = isSales ? sales : registrations
    const max = Math.max(...arr[0].data)

    return isSales ? `P${formatMadi(max)}` : fNumber(max)
  }
  
  const getMin = () => {

    const arr = isSales ? sales : registrations
    const min = Math.min(...arr[0].data)

    return isSales ? `P${formatMadi(min)}` : fNumber(min)
  }

  const salesOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => isSales ? `P${formatMadi(seriesName)}` : `${fNumber(seriesName)}`,
        title: {
          formatter: (seriesName) => isSales ? `Sales: ` : `Registrations: `
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: allOffices
    }
  })

  return (
    <Card>
      <CardHeader title={`${isSales ? 'Sales' : 'Registrations'} by D.A. Office`} subheader={`Highest of '${getMax()}' and Lowest of '${getMin()}'`} />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart key={isSales} type="bar" series={isSales ? sales : registrations} options={salesOptions} height={364} />
      </Box>
    </Card>
  );
}
