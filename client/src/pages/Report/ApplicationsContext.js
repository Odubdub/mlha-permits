import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
import { BaseOptionChart } from 'src/components/charts';
import { dayKeys, epocToLabel, getPercent, getValues } from './report_helper';
import { getShortApplicationName } from '../Registrations/PermitTypes';
import { fDateTime, formatSimpleTime } from 'src/utils/formatTime';
// components

ApplicationsContext.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string
};

export default function ApplicationsContext({
  title,
  type,
  serviceCode,
  subheader,
  data,
  newData,
  date,
  showSales = false,
  ...other
}) {
  const theKeys = dayKeys(date);

  // const labels = theKeys.map((k) => epocToLabel(k));
  let percent;

  let labels = newData[0].count.map((c) => formatSimpleTime(c.day));

  const newChartData = newData.map((d, i) => {
    return {
      code: i,
      name: d.shortName,
      type: 'area',
      fill: 'gradient',
      data: d.count.map((c) => c.count)
    };
  });

  const chartData = Object.keys(data).map((key) => {
    const values = getValues(data, key, theKeys, showSales);

    if (key === serviceCode) {
      percent = getPercent(values[values.length - 2], values[values.length - 1]);
    }

    return {
      code: key,
      name: getShortApplicationName(key),
      type: 'area',
      fill: 'gradient',
      data: values
    };
  });

  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    labels: labels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={`Submitted customer applications count.`} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={newChartData} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
