import * as React from 'react';
import {Routes, Route, Outlet, NavLink} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {ReadWrapper} from "./components/excel/ReadWrapper";
import {useEffect} from "react";
import {debug} from "./components/config/debug";
import {Mappers} from "./components/mappers/Mappers";


const App = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <App>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<App>: First render`);
    }

    // Register the Bank mappers


    return () => {
      if (debug.lifecycle) {
        console.log(`<App>: Destroyed`);
      }
    }
  }, []);


  return (

        <Routes>
          <Route element={<Layout />}>
            <Route index element={<ReadWrapper />} />
            <Route path="read" element={<ReadWrapper />} />
            <Route path="table" element={<TableWrapper />} />
            <Route path="mappers" element={<Mappers />} />
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
      <div style={{
        display:"flex", flexDirection:"row", justifyContent:"center",
        marginBottom: "20px"
      }}>
        <h1>Table For Accounting</h1>
      </div>

      <nav
          style={{
            // borderBottom: 'solid 1px',
            paddingBottom: '1rem',
            paddingLeft: "1rem",
            display: "flex", flexDirection:"row", gap:"10px", justifyContent: "center"
          }}
      >
        <NavLink to="/read" style={style}>
          Read
        </NavLink>
        <NavLink to="/table" style={style}>
          Table
        </NavLink>
        <NavLink to="/mappers" style={style}>
          Mappers
        </NavLink>
      </nav>

      <main style={{ padding: '1rem 0' }}>
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center"
          }}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default App;
