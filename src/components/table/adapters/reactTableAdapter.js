import {valToString} from "../../../utils/types";

export function colToRTCol (colObj, {showTypes}) {
  const reactColObj = {
    "id": colObj["keyName"],
    "Header": colObj["header"] || colObj["keyName"],
    // We need accessor as a function when we have . (dot) in the key name
    "accessor": (row) => {return row[colObj["keyName"]]},

    ...colObj
  }

  reactColObj.Cell = ({ value }) => {
    const valueType = typeof(value);
    let alignment;

    if (reactColObj.alignment) {
      if (reactColObj.alignment === "left") {
        alignment = "flex-start"
      } else if (reactColObj.alignment === "right") {
        alignment = "flex-end"
      } else if (reactColObj.alignment === "center") {
        alignment = "center"
      }

    } else {
      alignment = (valueType === "number") ? "flex-end" : "flex-start";
    }

    return (
      <>
        <div style={{
          display:"flex", flexDirection:"column", gap: "2px"
        }}>
          <div style={{
            display: "flex", flexDirection:"column", alignItems: alignment,
          }}>
            <div style={{display:"flex", height:"1em"}}>
                {valToString(value) || ""}
            </div>

          </div>
          {showTypes &&
            <div style={{
              display: "flex", flexDirection:"row", justifyContent:"flex-end",
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


  return reactColObj;
}