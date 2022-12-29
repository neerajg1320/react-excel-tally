import {valToString} from "../../../utils/types";

export function colToRTCol (colObj, {showTypes}) {
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
      // return valToString(value);
      return (
        <>
          <div style={{
            display:"flex", flexDirection:"column", gap: "2px"
          }}>
            <div style={{height: "1em"}}>
              <span>{valToString(value) || ""}</span>
            </div>
            {showTypes &&
              <div style={{
                display: "flex", justifyContent:"flex-end",
                // border: "1px dashed blue"
              }}>
                <span style={{color: "gray", fontSize:"0.7em"}}>
                  {typeof(value)}
                </span>
              </div>
            }
          </div>
        </>
      );
    }
  }

  return reactColObj;
}