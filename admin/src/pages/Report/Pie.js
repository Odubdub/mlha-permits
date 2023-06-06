import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled } from '@mui/material/styles';
import { Card, CardHeader, Stack } from '@mui/material';

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
    marginLeft: '20px',
    marginBottom: '5px',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

Pie.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default function Pie({
  title,
  subheader,
  chartData,
  chartColors,
  data,
  chartLabels,
  ...other
}) {
  function countStatusTotals() {
    const statusCounts = {
      rejected: 0,
      issued: 0,
      revoked: 0,
      returned: 0
    };

    data.forEach((type) => {
      type.rejected.forEach(({ count }) => {
        statusCounts.rejected += count;
      });

      type.issued.forEach(({ count }) => {
        statusCounts.issued += count;
      });

      type.revoked.forEach(({ count }) => {
        statusCounts.revoked += count;
      });
    });

    return statusCounts;
  }

  function transformTotals(totals) {
    const values = Object.values(totals);
    const labels = Object.keys(totals);
    return { labels, values };
  }

  const { labels, values } = transformTotals(countStatusTotals());

  const chartOptions = {
    chart: {
      width: 380,
      type: 'donut'
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270
      }
    },
    labels: labels.map((label) => label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()),
    fill: {
      type: 'gradient'
    },
    legend: {
      formatter: function (val, opts) {
        return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack width="100%" alignContent="center">
        <ChartWrapperStyle dir="ltr">
          <ReactApexChart
            type="donut"
            series={values}
            options={chartOptions}
            height={1000}
            width={1000}
          />
        </ChartWrapperStyle>
      </Stack>
    </Card>
  );
}
