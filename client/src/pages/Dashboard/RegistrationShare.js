import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../utils/formatNumber';
//
import { BaseOptionChart } from '../../components/charts';
import { IsSalesContext } from './IsSalesContext';
import { useContext } from 'react';

const CHART_HEIGHT = 372
const LEGEND_HEIGHT = 72

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}))

export default function RegistrationShare({data}) {

  const isSales = useContext(IsSalesContext)

  const sales = [data.nameChange_sum.value, data.marriages_sum.value, data.propertyInstrument_sum.value]
  const registrations = [data.nameChange_sum.count, data.marriages_sum.count, data.propertyInstrument_sum.count]

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.error.dark,
      theme.palette.info.dark,
      theme.palette.warning.dark,
      theme.palette.error.main
    ],
    labels: ['Name Change', 'Marriage', 'Property Instrument'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  })

  return (
    <Card>
      <CardHeader title={`${isSales ? 'Sales':'Registration'} Share`} subheader="All Time"/>
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="pie" series={isSales ? sales : registrations} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}
