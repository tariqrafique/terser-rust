/*
 * Copyright (c) 2025, Salesforce, Inc.,
 * All rights reserved.
 * For full license text, see the LICENSE.txt file
 */
const ISO8601_STRICT_PATTERN = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?)?)?)?$/i;
const ISO8601_TIME_PATTERN = /^\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d[:]?\d\d)|Z)?$/i;
const STANDARD_TIME_FORMAT = 'HH:mm:ss.SSS';
const STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
const TIME_SEPARATOR = 'T';
const TIMEZONE_INDICATOR = /(Z|([+-])(\d{2})[:]?(\d{2}))$/i;
function isValidISODateTimeString(dateTimeString) {
  return isValidISO8601String(dateTimeString) && isValidDate(dateTimeString);
}
function isValidISOTimeString(timeString) {
  if (!isValidISO8601TimeString(timeString)) {
    return false;
  }
  const timeOnly = removeTimeZoneSuffix(timeString);
  return isValidDate(`2018-09-09T${timeOnly}Z`);
}
function removeTimeZoneSuffix(dateTimeString) {
  if (typeof dateTimeString === 'string') {
    return dateTimeString.split(TIMEZONE_INDICATOR)[0];
  }
  return dateTimeString;
}
function padMilliseconds(dateTimeString) {
  if (typeof dateTimeString === 'string' && (isValidDate(dateTimeString) || isValidISOTimeString(dateTimeString))) {
    const millisecondIndex = dateTimeString.indexOf('.');
    let timezoneIndex = dateTimeString.search(TIMEZONE_INDICATOR);
    if (timezoneIndex === -1) {
      timezoneIndex = dateTimeString.length;
    }
    if (millisecondIndex !== -1) {
      const milliseconds = dateTimeString.substring(millisecondIndex + 1, timezoneIndex);
      let newMilliseconds = milliseconds;
      if (milliseconds.length > 3) {
        newMilliseconds = newMilliseconds.substring(0, 3);
      } else if (milliseconds.length < 3) {
        const extraZeros = '0'.repeat(3 - milliseconds.length);
        newMilliseconds = `${newMilliseconds}${extraZeros}`;
      }
      const start = dateTimeString.substring(0, millisecondIndex);
      const end = dateTimeString.substring(timezoneIndex);
      return `${start}.${newMilliseconds}${end}`;
    }
  }
  return dateTimeString;
}
function isValidISO8601String(dateTimeString) {
  if (typeof dateTimeString !== 'string') {
    return false;
  }
  return ISO8601_STRICT_PATTERN.test(dateTimeString);
}
function isValidISO8601TimeString(timeString) {
  if (typeof timeString !== 'string') {
    return false;
  }
  return ISO8601_TIME_PATTERN.test(timeString);
}
function isValidDate(value) {
  const timeStamp = Date.parse(value);
  return isFinite(timeStamp);
}

export { STANDARD_DATE_FORMAT, STANDARD_TIME_FORMAT, TIME_SEPARATOR, isValidISODateTimeString, isValidISOTimeString, padMilliseconds, removeTimeZoneSuffix };