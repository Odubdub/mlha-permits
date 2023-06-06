const weekCount = 7
const monthCount = 12
const yearCount = 6

const getDayBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate() - 1 * i)
  d.setUTCHours(0, 0, 0, 0)
  return d.getTime() / 1000
}

const get7WeeksBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate() - 7 * i)
  return d
}

const get12MonthsBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate() - 365)
  return d
}

const get6YearsBefore = (date, i) => {

  var d = new Date(date)
  d.setDate(d.getDate() - 365 * 6,)
  return d
}

export const dayKeys = (date) => {

  let k = []
  let i = 0
  while (i < 7) {
    k.push(getDayBefore(date, i))
    i++
  }
  return k.reverse()
}

export const getPercent = (yesterday, today) => {

    if (yesterday == 0 && today != 0) {
      return '+100%'
    } else if (yesterday != 0 && today == 0) {
      return '-100%'
    } else if (yesterday == 0 && today == 0) {
      return '0%'
    } else {
      const percent = (today - yesterday) / yesterday * 100
      return `${percent > 0?'+':''}${percent.toFixed(0)}%`
    }
  }


export const epocToLabel = (epoc) => {

  let date = new Date(epoc * 1000)
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export const getValues = (source, sourceKey, keys, isMoney) => {
    let arr = []
    const childKey = isMoney ? 'value' : 'count'
    keys.forEach(d => {
        const stats = source[sourceKey].filter(s => s.datePeriod == d)
        if (stats.length != 0) {
        const v = stats[0][childKey]
        if (isMoney) {
            arr.push(v)
        } else {
            arr.push(v)
        }
        } else {
            arr.push(0)
        }
    })

    return arr
}