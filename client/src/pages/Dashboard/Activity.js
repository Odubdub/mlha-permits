import { keys, merge } from 'lodash'
import ReactApexChart from 'react-apexcharts'
import { Card, CardHeader, Box } from '@mui/material'
import { BaseOptionChart } from '../../components/charts'
import { useContext } from 'react'
import { IsSalesContext } from './IsSalesContext'
import { formatMadi } from 'src/utils/formatNumber'
import { fDate, fShortDate } from 'src/utils/formatTime'

const weekCount = 7
const monthCount = 12
const yearCount = 6

const getDayBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate()-1*i)
  d.setUTCHours(0, 0, 0, 0)
  return d.getTime()/1000
}

const get7WeeksBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate()-7*i)
  return d
}

const get12MonthsBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate()-365)
  return d
}

const get6YearsBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate()-365*6,)
  return d
}

const dayKeys = (date) => {

  let k = []
  let i = 0
  while (i < 7 ) {
    k.push(getDayBefore(date, i))
    i++
  }
  return k.reverse()
}

const epocToLabel = (epoc) => {

  let date = new Date(epoc * 1000)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export default function Activity({data, date}) {

  const isSales = useContext(IsSalesContext)

  const theKeys = dayKeys(date)

  const getValues = (source, sourceKey, keys, isMon) => {
    let arr = []
    const childKey = isMon ? 'value' : 'count'
    keys.forEach(d=>{
      const stats = source[sourceKey].filter(s=>s.datePeriod==d)
      if (stats.length != 0){
        const v = stats[0][childKey]
        if (isMon){
          arr.push(v/100)
        } else {
          arr.push(v)
        }
      } else {
        arr.push(0)
      }
    })

    return arr
  }

  //TODO: Change this to 
  const data1 = getValues(data, 'change to sth', theKeys, isSales)
  const data3 = getValues(data, 'change to sthels', theKeys, isSales)
  const data2 = getValues(data, 'change to sssss', theKeys, isSales)
  const labels = theKeys.map(k=>epocToLabel(k))

  const CHART_DATA = [
    {
      name: 'Data 3',
      type: 'column',
      data: data3
    },
    {
      name: 'Data 2',
      type: 'area',
      data: data2
    },
    {
      name: 'Data 1',
      type: 'line',
      data: data1
    }
  ]

  console.log(labels)

  console.log(data1)
  console.log(data3)
  console.log(data2)

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: labels,
    xaxis: { type: 'datetime' },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return isSales ? `Sales: P${formatMadi(y)}` : `${y.toFixed(0)} registrations`
          }
          return y
        }
      },
      x: {
        format: "dd' MMM",
        formatter: (value) => {
          const d = new Date(value)

            return fShortDate(d)
          }
        }
    }
  })

  return (
    <Card>
      <CardHeader title={`${isSales ? 'Sales':'Registrations'} Comparison`} subheader="In the Past 7 Days" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart key={isSales} type="line" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  )
}
