// import './App.css';
import {BasicTable} from "./components/table/SimpleTable";
import {useMemo, useState} from "react";
// import {BrowserRouter, Routes, Route} from "react-router-dom";
import MOCK_DATA from "./assets/MOCK_DATA.json";
import { MOCK_COLUMNS } from './assets/MOCK_COLUMNS';
import ReadExcel from "./components/excel/xlsx/ReadExcel";


import * as React from 'react';
import { Routes, Route, Outlet, NavLink } from 'react-router-dom';

const App = () => {
  console.log(`Rendering <App>`);

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Read />} />
          <Route path="home" element={<Read />} />
          <Route path="about" element={<Table />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Route>
      </Routes>
  );
};

const Layout = () => {
  console.log(`Rendering <Layout>`);

  const style = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
      <>
        <h1>React Router</h1>

        <nav
            style={{
              borderBottom: 'solid 1px',
              paddingBottom: '1rem',
              paddingLeft: "1rem",
              display: "flex", flexDirection:"row", gap:"10px"
            }}
        >
          <NavLink to="/home" style={style}>
            Read
          </NavLink>
          <NavLink to="/about" style={style}>
            Table
          </NavLink>
        </nav>

        <main style={{ padding: '1rem 0' }}>
          <Outlet />
        </main>
      </>
  );
};

const Read = () => {
  console.log(`Rendering <Read>`);

  return (
      <>
        <ReadExcel />
      </>
  );
};

const Table = () => {
  console.log(`Rendering <Table>`);

  const columns = useMemo(() => MOCK_COLUMNS, []);
  const data = useMemo(() => MOCK_DATA, []);

  const rtColumns = columns.map(col => {
    return {...col, id: col.key, Header: col.label, accessor: col.key}
  });


  return (
      <>
        <BasicTable data={data} columns={rtColumns}/>
      </>
  );
};

export default App;
