import * as React from 'react';
import {Routes, Route, redirect} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {ReadWrapper} from "./components/readFiles/ReadWrapper";
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

  const handleDataChange = useCallback((data) => {
    console.log(`handleDataChange:`, data);
    setData(data);
  }, []);

  const handleLedgersChange = useCallback((ledgers) => {
    console.log(`App: handleLedgersChange:`, ledgers);
    setLedgers(ledgers);
  }, []);

  // Currently we are not using the AppContext
  const appContext = {
    data,
    onDataChange: handleDataChange,
    ledgers,
    onLedgersChange: handleLedgersChange
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
