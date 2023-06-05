import React from 'react';
import { Card, CardHeader, Stack, Box, Typography } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import { formatSimpleTime } from 'src/utils/formatTime';

export const Bar = ({ title = 'All', subheader, series, data }) => {
  const countAll = (status) => {
    let total = data[0].count.map((_) => 0);
    data.forEach((item, i) => {
      total[i] = total[i] + item[status].count;
    });

    return total;
  };

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0
          }
        }
      }
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      }
    },
    xaxis: {
      type: 'datetime',
      categories: data[0].count.map((c) => formatSimpleTime(c.day))
    },
    legend: {
      position: 'bottom',
      offsetY: 40
    },
    fill: {
      opacity: 1
    }
  };

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart options={options} series={series} type="bar" height={350} width="100%" />
      </Box>
      <Stack>
        <Stack ml={2}></Stack>
        <Stack spacing={2}></Stack>
      </Stack>
    </Card>
  );
};
