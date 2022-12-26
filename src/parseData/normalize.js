import {getKeyFromLabel} from "../schema/schema";
import {presetColumns} from "../components/table/presets/presetColumns";

const getKeyFromPresets = (label) => {
  const matchingColumns = presetColumns.filter(col => col.label === label)

  if (matchingColumns.length > 0) {
    const matchingCol = matchingColumns[0]
    console.log(`getKeyFromPresets:`, matchingCol);
    return matchingCol;
  }

  return label;
}

export const dataNormalize = (data) => {
  // console.log(`dataNormalize: data=${JSON.stringify(data, null, 2)}`);

  const nData = data.map(row => {
    return Object.fromEntries(Object.entries(row).map(([label, val]) => {
      const keyPreset = getKeyFromPresets(label)
      console.log(`keyPreset=${keyPreset}`);

      const keyName = getKeyFromLabel(label);

      return [keyName, val];
    }));
  })

  console.log(`dataNormalize: nData=${JSON.stringify(nData, null, 2)}`);

  return data;
}