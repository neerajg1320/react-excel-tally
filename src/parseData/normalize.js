import {getKeyFromLabel} from "../schema/schema";

export const dataNormalize = (data) => {
  // console.log(`dataNormalize: data=${JSON.stringify(data, null, 2)}`);

  const nData = data.map(row => {
    return Object.fromEntries(Object.entries(row).map(([k, val]) => {
      return [getKeyFromLabel(k), val];
    }));
  })

  console.log(`dataNormalize: nData=${JSON.stringify(nData, null, 2)}`);

  return data;
}