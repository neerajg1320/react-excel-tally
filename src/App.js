import * as React from 'react';
import {Routes, Route, redirect} from 'react-router-dom';
import {TableWrapper} from "./table/TableWrapper";
import {ReadWrapper} from "./fileReader/ReadWrapper";
import {useCallback, useEffect, useState} from "react";
import {debug} from "./components/config/debug";
import {HomeLayout} from "./components/HomeLayout";
import {TallyWrapper} from "./tally/TallyWrapper";
import AppContext from "./AppContext";

const App = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <App>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<App>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<App>: Destroyed`);
      }
    }
  }, []);

  // The App keeps a copy of data
  const [data, setData] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [tallySaved, setTallySaved] = useState(false);

  const updateModifiedRows = useCallback((indices) => {
    setModifiedRows((prev) => {
      const newIds = indices.filter(index => !prev.includes(index));
      return [...prev, ...newIds];
    });
  }, [setModifiedRows]);

  const clearModifiedRows = useCallback(() => {
    setModifiedRows([]);
  }, [setModifiedRows]);

  // The App component just maintains a copy of data.
  // The modification are done in table and tally components.
  const handleDataChange = useCallback((data, updates, source) => {
    console.log(`handleDataChange: source=${source} data=`, data);
    setData(data);

    // TBD: We can do the below asynchronously
    // In case it is a data modify or delete action

    if (source === "fileReader") {
      const indices = data.map((item,index) => index);
      if (indices.length > 0) {
        setModifiedRows(indices);
        setTallySaved(false);
      }
    } else if (source === "table") {
      if (updates) {
        console.log(`App:handleDataChange ${JSON.stringify(updates, null, 2)}`);
        const indices = updates.reduce((prev, update) => {
          const newIds = update.payload.indices.filter(index => !prev.includes(index));
          return [...prev, ...newIds];
        }, [])

        if (indices.length > 0) {
          updateModifiedRows(indices);
        }
      }
    } else if (source === "tally") {
      // We can count the Tally Operations here. This will happen only if data is submitted to Tally
      // We should get the indices here and clear the modifiedRows
      console.log(`handleDataChange: source:${source} updates=`, updates);

      const responseIds = updates[0].payload;
      if (responseIds.length === modifiedRows.length) {
        console.log(`Modified rows saved.`)
      }

      clearModifiedRows();
      setTallySaved(true);
    } else {
      console.error(`handleDataChange: source '${source}' not supported`);
    }
  }, []);

  const handleLedgersChange = useCallback((ledgers) => {
    console.log(`App: handleLedgersChange:`, ledgers);
    setLedgers(ledgers);
  }, []);

  useEffect(() => {
    console.log(`modifiedRows:`, modifiedRows);
  }, [modifiedRows]);

  // Currently we are not using the AppContext
  const appContext = {
    data,
    onDataChange: handleDataChange,
    ledgers,
    onLedgersChange: handleLedgersChange,
    tallySaved,
    modifiedRows
  }

  return (
    <AppContext.Provider value={appContext}>
      {/* We add voucherIds generated by tally */}
      <TallyWrapper data={data} onDataChange={handleDataChange} onLedgersChange={handleLedgersChange}>
        <Routes>
          <Route element={<HomeLayout />}>

            {/* Data read from excel file */}
            <Route index element={<ReadWrapper />} />

            {/* Category information added by user */}
            <Route path="table" element={<TableWrapper />} />

            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Route>
        </Routes>
      </TallyWrapper>
    </AppContext.Provider>
  );
};

export default App;
