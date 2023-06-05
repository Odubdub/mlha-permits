import { Card, Stack, Typography } from '@mui/material';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { BaseOptionChart } from 'src/components/charts';
import Iconify from 'src/components/Iconify';
import merge from 'lodash/merge';
import { getPercent } from './report_helper';

function MiniReportCard({ title, color, dates, cardValues = [], fixed }) {
  const percent = getPercent(cardValues[cardValues.length - 2], cardValues[cardValues.length - 1]);

  const data = {
    isUp: percent.startsWith('+'),
    count: (fixed || {}).count,
    value: percent,
    valueDescription: 'than yesterday',
    values: cardValues,
    dates: dates
  };

  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: {
      bar: {
        columnWidth: '16%'
      }
    },
    xaxis: {
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    grid: {
      show: false
    },
    fill: { type: data.values.map((i) => i.fill) },
    labels: data.dates,
    tooltip: {
      shared: true,
      intersect: false
    }
  });

  return (
    <Card>
      <Stack direction="row">
        <Stack ml={2}>
          <Typography sx={{ fontWeight: '600', mt: 1 }}>{title}</Typography>
          <Typography sx={{ fontWeight: 900, fontSize: 25 }}>{data.count}</Typography>
        </Stack>
        <Stack spacing={2}>
          {cardValues && (
            <ReactApexChart
              type="line"
              height={100}
              series={[
                {
                  color: color,
                  fill: 'gradient',
                  data: data.values
                }
              ]}
              options={chartOptions}
            />
          )}
        </Stack>
      </Stack>
      <Stack>
        <Stack
          direction="row"
          sx={{ ml: 2, mb: 2, borderRadius: 15, fontSize: 12 }}
          alignItems="center"
        >
          <Stack
            direction="row"
            sx={{
              width: 24,
              height: 24,
              borderRadius: 15,
              bgcolor: data.isUp ? 'success.lighter' : 'error.lighter'
            }}
            justifyContent="center"
            alignItems="center"
          >
            <Iconify
              color={data.isUp ? 'success.dark' : 'error.dark'}
              icon={!data.isUp ? 'ph:trend-down-bold' : 'ph:trend-up-bold'}
            />
          </Stack>
          <Typography ml={1} fontSize={14} color="grey.900">
            {data.value}
          </Typography>
          <Typography ml={1} fontSize={14} color="grey.600">
            {data.valueDescription}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}

export default MiniReportCard;
