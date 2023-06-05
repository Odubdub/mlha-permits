import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
import { BaseOptionChart } from 'src/components/charts';

const CHART_HEIGHT = 392;

const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT
  },
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
}));

OpenApplicationsContext.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default function OpenApplicationsContext({ title, subheader, data, chartColors, ...other }) {
  function countStatusTotals() {
    const res = [];

    data.forEach((d) => {
      const newApp = d.new.reduce((acc, { count }) => acc + count, 0);
      const returned = d.returned.reduce((acc, { count }) => acc + count, 0);
      const pending = d.pending.reduce((acc, { count }) => acc + count, 0);
      const pendingPayment = d.pendingPayment.reduce((acc, { count }) => acc + count, 0);

      res.push({
        name: d.shortName,
        data: [newApp, returned, pendingPayment, pending]
      });
    });

    return res;
  }

  const chartDat = countStatusTotals();
  const labels = ['New Applications', 'Returned', 'Pending Payment', 'Pending'];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: 2 },
    fill: { opacity: 0.48 },
    legend: { floating: true, horizontalAlign: 'center' },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: chartColors
        }
      }
    }
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <ChartWrapperStyle dir="ltr">
        <ReactApexChart type="radar" series={chartDat} options={chartOptions} height={340} />
      </ChartWrapperStyle>
    </Card>
  );
}
