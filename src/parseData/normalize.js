import {presetColumns} from "../components/table/presets/presetColumns";
import {generateKeyFromLabel} from "../schema/core";

const getKeyFromPresets = (label) => {
  // TBD: need to update matching algo
  const matchingColumns = presetColumns.filter(col => col.label === label)

  if (matchingColumns.length > 0) {
    const matchingCol = matchingColumns[0]
    console.log(`getKeyFromPresets:`, matchingCol);
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

  // console.log(`dataNormalize: nData=${JSON.stringify(nData, null, 2)}`);

  return nData;
}