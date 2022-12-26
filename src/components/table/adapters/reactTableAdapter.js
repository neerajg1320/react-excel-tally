import {valToString} from "../../../utils/types";
import {generateKeyFromLabel} from "../../../schema/core";

export function colToRTCol (colObj) {
  const reactColObj = {
    "id": generateKeyFromLabel(colObj["label"]),
    "Header": colObj["label"],
    // We need accessor as a function when we have . (dot) in the key name
    "accessor": (row) => {return row[colObj["key"]]},

    ...colObj
  }

  if (String(colObj.key).toLowerCase().includes('date')) {
    reactColObj.Cell = ({ value }) => {
      return valToString(value);
    }
  }

  return reactColObj;
}