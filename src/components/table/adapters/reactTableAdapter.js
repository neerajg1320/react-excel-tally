import {valToString} from "../../../utils/types";

export function colToRTCol (colObj) {
  const reactColObj = {
    "id": colObj["keyName"],
    "Header": colObj["header"] || colObj["keyName"],
    // We need accessor as a function when we have . (dot) in the key name
    "accessor": (row) => {return row[colObj["keyName"]]},

    ...colObj
  }

  // Convert all objects
  if (String(colObj.keyName).toLowerCase().includes('date') || true) {
    reactColObj.Cell = ({ value }) => {
      return valToString(value);
    }
  }

  return reactColObj;
}