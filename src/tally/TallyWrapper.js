import TallyServerStatus from "./TallyServerStatus/TallyServerStatus";
import TallySubmitBar from "./TallySubmitBar/TallySubmitBar";
import {Provider} from "react-redux";
import store from "./state/store";
import {useEffect, useState} from "react";
import {debug} from "../components/config/debugEnabled";

export const TallyWrapper = ({children, data}) => {
  if (debug.lifecycle) {
    console.log(`Rendering <TallyWrapper>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<TallyWrapper>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<TallyWrapper>: Destroyed`);
      }
    }
  }, []);

  const boxShadow = "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px";
  const [tabKey, setTabKey] = useState("columnsTable");

  const handleLedgersChange = (ledgers) => {
    console.log(`ledgers=`, ledgers);
  }

  return (
    <Provider store={store}>
      <div
          style={{
            display:"flex", flexDirection:"column", alignItems:"center", gap: "10px", justifyContent:"flex-start",
            border: "2px dashed red"

          }}
      >
        <div style={{
          marginTop: "40px",
          marginBottom: "10px",
          width: "90%",
          borderRadius: "4px",
          minHeight: "60vh",
          // border: "1px dashed blue",
          boxShadow
        }}
        >
          {children}
        </div>

        <div style={{
          height: "70px", width:"100%",
          position: "fixed", bottom: "0",
        }}
        >
          <TallySubmitBar data={data}/>
        </div>
      </div>
    </Provider>
  )
}