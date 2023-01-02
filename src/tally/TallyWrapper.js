import TallyServerStatus from "./TallyServerStatus/TallyServerStatus";
import TallySubmitBar from "./TallySubmitBar/TallySubmitBar";
import {Provider} from "react-redux";
import store from "./state/store";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {useState} from "react";
import {TableWrapper} from "../components/table/TableWrapper";

export const TallyWrapper = ({children}) => {
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
          height: "100px", width: "100%",
          position: "fixed", top: 0,
          display: "flex", flexDirection: "row", justifyContent:"center",
          boxShadow: "0 0 3px 0 rgba(0,0,0,0.2)",
        }}
        >
          <TallyServerStatus onLedgersChange={handleLedgersChange}/>
        </div>

        <div style={{
          marginTop: "150px",
          marginBottom: "100px",
          width: "90%",
          borderRadius: "4px",
          minHeight: "60vh",
          border: "1px dashed blue",
          boxShadow
        }}
        >
          <Tabs className="mb-3"
                activeKey={tabKey}
                onSelect={k => setTabKey(k)}
          >
            <Tab eventKey="columnsTable" title="Columns">
              <TableWrapper />
            </Tab>
          </Tabs>
        </div>

        <div style={{
          height: "70px", width:"100%",
          position: "fixed", bottom: "0",
        }}
        >
          <TallySubmitBar />
        </div>
      </div>
    </Provider>
  )
}
