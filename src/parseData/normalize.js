import {presetColumns} from "../presets/presetColumns";
import {generateKeyFromLabel} from "../schema/core";

const getKeyFromPresets = (label) => {
  // TBD: need to update matching algo
  const matchingColumns = presetColumns.filter(col => {
    return col.matchLabels.includes(label)
  });

  if (matchingColumns.length > 0) {
    const matchingCol = matchingColumns[0]
    return matchingCol.keyName;
  }

  console.log(`label=${label} not found in presets`);
  return null;
}

export const dataNormalize = (data) => {
  const nData = data.map(row => {
    return Object.fromEntries(Object.entries(row).map(([label, val]) => {
      const keyName = getKeyFromPresets(label) || generateKeyFromLabel(label);
      return [keyName, val];
    }));
  })
  return nData;
}