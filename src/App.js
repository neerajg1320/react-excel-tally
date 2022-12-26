import ReadExcel from "./components/excel/xlsx/ReadExcel";
import * as React from 'react';
import {Routes, Route, Outlet, NavLink, useNavigate} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {useEffect} from "react";
import {debug} from "./components/config/debug";
import {dataNormalize} from "./parseData/normalize";

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
        <Route element={<Layout />}>
          <Route index element={<Read />} />
          <Route path="read" element={<Read />} />
          <Route path="table" element={<TableWrapper />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Route>
      </Routes>
  );
};

const Layout = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <Layout>`);
  }

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
        <div style={{
            padding: "10px",
            display: "flex",
          }}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};



const Read = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <Read>`);
  }

  const navigate = useNavigate();

  const onLoadComplete = ({data}) => {
    const normalizedData = dataNormalize(data);

    navigate('/table', { state: { data:normalizedData } });
  };

  return (
    <>
      <ReadExcel onComplete={onLoadComplete}/>
    </>
  );
};


export default App;
