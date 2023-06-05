import { differenceInCalendarDays, format, formatDistanceToNow } from 'date-fns';

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fShortDate(date) {
  return format(new Date(date), 'dd MMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy ・ HH:mm');
}

export function formatSimpleTime(date) {
  return format(new Date(date), 'MM/dd/yyyy');
}

export const differenceInDays = (date1, date2) => {
  return differenceInCalendarDays(new Date(date1), new Date(date2));
};

export function fTime(date) {
  return format(new Date(date), 'HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}

export function getAge(date) {
  const seconds = (Date.now() - Date.parse(date)) / 1000;

  let interval = seconds / 31536000;

  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} year${i === 1 ? '' : 's'} old`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} month${i === 1 ? '' : 's'} old`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} day${i === 1 ? '' : 's'} old`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} hour${i === 1 ? '' : 's'} old`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} minute${i === 1 ? '' : 's'} old`;
  }

  const i = Math.floor(interval);
  return `${i} second${i === 1 ? '' : 's'} old`;
}

export function getTimeDiff(date) {
  const seconds = (Date.now() - Date.parse(date)) / 1000;

  let interval = seconds / 31536000;

  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} year${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} month${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} day${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} hour${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} minute${i === 1 ? '' : 's'}`;
  }

  const i = Math.floor(interval);
  return `${i} second${i === 1 ? '' : 's'}`;
}

export function getDifferenceBetweenDates(date1, date2) {
  let seconds = 0;

  if (date2) {
    seconds = (Date.parse(date2) - Date.parse(date1)) / 1000;
  } else {
    seconds = (Date.now() - Date.parse(date1)) / 1000;
  }

  let interval = seconds / 31536000;

  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} year${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} month${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 86400;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} day${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 3600;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} hour${i === 1 ? '' : 's'}`;
  }

  interval = seconds / 60;
  if (interval > 1) {
    const i = Math.floor(interval);
    return `${i} minute${i === 1 ? '' : 's'}`;
  }

  const i = Math.floor(interval);
  return `${i} second${i === 1 ? '' : 's'}`;
}

export function getDays(date) {
  const seconds = (Date.now() - Date.parse(date)) / 1000;

  let interval = seconds / 31536000;

  interval = seconds / 86400;
  const i = Math.floor(interval);

  return `${i} day${i === 1 ? '' : 's'}`;
}

export function getDaysFromDate(date) {
  const seconds = (Date.now() - date) / 1000;

  let interval = seconds / 31536000;

  interval = seconds / 86400;
  const i = Math.floor(interval);

  return `${i} day${i === 1 ? '' : 's'}`;
}
