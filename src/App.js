// import './App.css';
import {BasicTable} from "./components/table/SimpleTable";
import {useCallback, useMemo, useState} from "react";
import MOCK_DATA from "./assets/MOCK_DATA.json";
import { MOCK_COLUMNS } from './assets/MOCK_COLUMNS';
import ReadExcel from "./components/excel/xlsx/ReadExcel";


import * as React from 'react';
import {Routes, Route, Outlet, NavLink, useNavigate, useLocation} from 'react-router-dom';
import {getColumns} from "./components/excel/xlsx/schema";
import {colToRTCol} from "./components/table/adapters/reactTableAdapter";

const App = () => {
  console.log(`Rendering <App>`);

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Read />} />
          <Route path="read" element={<Read />} />
          <Route path="table" element={<Table />} />
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
          <NavLink to="/read" style={style}>
            Read
          </NavLink>
          <NavLink to="/table" style={style}>
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
  const navigate = useNavigate();

  const onLoadComplete = useCallback(({data}) => {
    console.log(`data=${JSON.stringify(data, null, 2)}`);

    navigate('/table', { state: { id: 9, just:"like", data } });
  });

  return (
      <>
        <ReadExcel onComplete={onLoadComplete}/>
      </>
  );
};

const Table = () => {
  console.log(`Rendering <Table>`);
  const {state} = useLocation();
  // const [data, setData] = useState(MOCK_DATA);
  // const [columns, setColumns] = useState(MOCK_COLUMNS)

  if (!state) {
    return <h1>Empty</h1>
    // TBD: We can probably move the column detection outside
  }
  const {data} = state;
  const columns = getColumns(data);
  const rtColumns = columns.map(colToRTCol);
  console.log(`rtColumns=${JSON.stringify(rtColumns, null, 2)}`)


  // const rtColumns = columns.map(col => {
  //   return {...col, id: col.key, Header: col.label, accessor: col.key}
  // });


  return (
      <>
        <BasicTable data={data} columns={rtColumns}/>
      </>
  );
};

export default App;
