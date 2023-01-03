import * as React from 'react';
import {Routes, Route, Outlet, NavLink} from 'react-router-dom';
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

  const [data, setData] = useState([]);

  const handleDataChange = useCallback((data) => {
    console.log(`handleDataChange:`, data);
  }, []);

  const appContext = {
    data
  }

  return (
    <AppContext.Provider value={appContext}>
      <TallyWrapper data={data}>
        <Routes>
          <Route element={<HomeLayout />}>
            <Route index element={<ReadWrapper />} />
            <Route path="read" element={<ReadWrapper onDataChange={handleDataChange}/>} />
            <Route path="table" element={<TableWrapper onDataChange={handleDataChange}/>} />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Route>
        </Routes>
      </TallyWrapper>
    </AppContext.Provider>
  );
};

export default App;
