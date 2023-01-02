import * as React from 'react';
import {Routes, Route, Outlet, NavLink} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {ReadWrapper} from "./components/excel/ReadWrapper";
import {useEffect} from "react";
import {debug} from "./components/config/debug";
import {Mappers} from "./components/mappers/Mappers";
import {HomeLayout} from "./components/HomeLayout";

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

  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route index element={<ReadWrapper />} />
        <Route path="read" element={<ReadWrapper />} />
        <Route path="table" element={<TableWrapper />} />
        <Route path="mappers" element={<Mappers />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Route>
    </Routes>
  );
};

export default App;
