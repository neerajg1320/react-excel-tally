import {debug} from "./config/debug";
import {NavLink, Outlet} from "react-router-dom";
import * as React from "react";

export const HomeLayout = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <Layout>`);
  }

  const style = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  });

  return (
      <div style={{
        // border:"1px dashed blue",
      }}>
        {/* title */}
        <div style={{
          display:"flex", flexDirection:"row", justifyContent:"center",
          marginBottom: "20px"
        }}>
          <h1>Table For Accounting</h1>
        </div>

        {/* nav bar */}
        <nav style={{paddingBottom: '1rem', paddingLeft: "1rem",
          display: "flex", flexDirection:"row", gap:"10px", justifyContent: "center"
        }}
        >
          <NavLink to="/read" style={style}>
            Read
          </NavLink>
          <NavLink to="/table" style={style}>
            Table
          </NavLink>
          <NavLink to="/tally" style={style}>
            Tally
          </NavLink>
        </nav>

        {/* Contents for selected nav*/}
        <main style={{ padding: '1rem 0' }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center"
          }}
          >
            <Outlet />
          </div>
        </main>
      </div>
  );
};