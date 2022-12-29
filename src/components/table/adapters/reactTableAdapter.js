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
      const valueType = typeof(value);
      const justification = (valueType === "number") ? "flex-end" : "flex-start";

      return (
        <>
          <div style={{
            display:"flex", flexDirection:"column", gap: "2px"
          }}>
            <div style={{
              display: "flex", flexDirection:"row", justifyContent: justification,
              // border: "1px dashed red"
            }}>
              <div>
                <span style={{
                  // border: "1px dashed blue"
                }}>
                  {valToString(value) || ""}
                </span>
              </div>

            </div>
            {showTypes &&
              <div style={{
                display: "flex", justifyContent:"flex-end",
                // border: "1px dashed blue"
              }}>
                <span style={{color: "gray", fontSize:"0.7em"}}>
                  {valueType}
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