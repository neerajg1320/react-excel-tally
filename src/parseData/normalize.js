import {presetColumns} from "../components/table/presets/presetColumns";

const getKeyFromPresets = (label) => {
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
      const keyName = getKeyFromPresets(label) || label;

      console.log(`keyPreset=`, keyName);

      return [keyName, val];
    }));
  })

  // console.log(`dataNormalize: nData=${JSON.stringify(nData, null, 2)}`);

  return nData;
}