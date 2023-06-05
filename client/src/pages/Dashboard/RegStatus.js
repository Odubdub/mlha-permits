import { merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
// material
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material'
// utils
import { fNumber } from '../../utils/formatNumber'
//
import { BaseOptionChart } from '../../components/charts'

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

export default function RegistrationStatus({data}) {

  const series = [data.backlog.pendingReview, data.backlog.pendingPayment, data.backlog.completed, data.backlog.customerAction]

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.error.dark,
      theme.palette.info.dark,
      theme.palette.warning.dark,
      theme.palette.error.main
    ],
    labels: ['Pending Review', 'Pending Payment', 'Completed', 'Client Action'],
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
      <CardHeader title={`Registration Status`} />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="donut" series={series} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </Card>
  );
}

