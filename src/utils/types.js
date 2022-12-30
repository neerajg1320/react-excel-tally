import {format as fnsFormat, parse as fnsParse, isDate as fnsIsDate, addHours, addMinutes, addSeconds} from "date-fns";

const isoDateFormat = "yyyy-MM-dd";
const localDateFormat = "dd/MM/yyyy";

export function isString(val) {
  return (typeof val === 'string' || val instanceof String)
}

export function isDate(val) {
  // Kept for reference
  // return val instanceof Date && !isNaN(val)

  return fnsIsDate(val);
}

export function valToString(val) {
  if (isDate(val)) {
    return fnsFormat(val, localDateFormat);
  }

  return val ? val.toString() : "";
}

export function getValueType(value) {
  let valueType = typeof(value);
  if (valueType === "object") {
    if (isDate(value)) {
      valueType = "date";
    }
  }
  return valueType;
}

export function dateFromString(dateStr, format) {
  return fnsParse(dateStr, format, new Date());
}

// Strangely Sheetjs reads the data and reduces 5:30 hrs and an adiitional 10 seconds
export function fixDatesInObject(obj) {
  const adjustedObj = Object.fromEntries(Object.entries(obj).map(([key, value]) =>{
    if (isDate(value)) {
      // console.log(`key=${key} value=${JSON.stringify(value)}`);
      value = addSeconds(addMinutes(addHours(value, 5), 30), 10);
    }
    return [key, value];
  }));

  return adjustedObj;
}