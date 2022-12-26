import {presetColumns} from "../presets/presetColumns";
import {generateKeyFromLabel} from "../schema/core";

const getKeyFromPresets = (headerName) => {
  // TBD: need to update matching algo
  const matchingColumns = presetColumns.filter(col => {
    return col.matchLabels.includes(headerName)
  });

  if (matchingColumns.length > 0) {
    const matchingCol = matchingColumns[0]
    return matchingCol.keyName;
  }

  console.log(`headerName=${headerName} not found in presets`);
  return null;
}

// The input data is an object of the form {..., excelHeader: value, ...}
// The normalized data is an object of the form {..., keyName: value, ...}
export const dataNormalize = (data) => {
  const nData = data.map(row => {
    return Object.fromEntries(Object.entries(row).map(([headerName, val]) => {
      const keyName = getKeyFromPresets(headerName) || generateKeyFromLabel(headerName);
      return [keyName, val];
    }));
  })
  return nData;
}