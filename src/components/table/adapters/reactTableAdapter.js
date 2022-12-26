import {valToString} from "../../../utils/types";
import {generateKeyFromLabel} from "../../../schema/core";

export function colToRTCol (colObj) {
  const reactColObj = {
    "id": generateKeyFromLabel(colObj["label"]),
    "Header": colObj["header"],
    // We need accessor as a function when we have . (dot) in the key name
    "accessor": (row) => {return row[colObj["keyName"]]},

    ...colObj
  }

  if (String(colObj.keyName).toLowerCase().includes('date')) {
    reactColObj.Cell = ({ value }) => {
      return valToString(value);
    }
  }

  return reactColObj;
}