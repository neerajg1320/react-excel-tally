import {valToString, getValueType} from "../../../utils/types";

export function colToRTCol (colObj, {showTypes}) {
  const reactColObj = {
    "id": colObj["keyName"],
    "Header": colObj["header"] || colObj["keyName"],
    // We need accessor as a function when we have . (dot) in the key name
    "accessor": (row) => {return row[colObj["keyName"]]},

    ...colObj
  }

  console.log(`colToRTCol: ${JSON.stringify(reactColObj, null, 2)}`);

  reactColObj.Cell = ({ value }) => {
    let valueType = getValueType(value);

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
      alignment = (valueType === "number") ? "flex-end" : (valueType === "date") ? "center" : "flex-start";
    }

    return (
      <>
        <div style={{
          overflow: "hidden",
          display:"flex", flexDirection:"column", gap: "2px"
        }}>
          <div style={{
            display: "flex", flexDirection:"column", alignItems: alignment,
            // height:"1em",
            // border: "1px dashed red"
          }}>
            <div style={{height:"1em",
              display:"flex", flexDirection: "row", alignItems:"center",
              // border: "1px dashed blue"
            }}>
                {valToString(value, reactColObj.format) || ""}
            </div>

          </div>
          {showTypes &&
            <div style={{
              display: "flex", flexDirection:"row", justifyContent:"flex-end",
              // border: "1px dashed green"
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