import ReadExcel from "./components/excel/xlsx/ReadExcel";
import * as React from 'react';
import {Routes, Route, Outlet, NavLink, useNavigate} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {useCallback, useContext, useEffect, useMemo} from "react";
import {debug} from "./components/config/debug";
import {Mappers} from "./components/mappers/Mappers";
import AppContext from "./AppContext";
import * as hdfc from "./banks/hdfc";
import * as kotak  from "./banks/kotak";
import {presetColumns} from "./presets/presetColumns";
import {generateKeyFromHeader} from "./schema/core";

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

  const mappers = useMemo(() => {
    const mappers = []
    mappers.push({name: hdfc.bankName, headerKeynameMap: hdfc.headerKeynameMap});
    mappers.push({name: kotak.bankName, headerKeynameMap: kotak.headerKeynameMap});
    return mappers;
  });

  const getMappers = useCallback(() => {
    return mappers;
  });

  const appContext = {
    getMappers,
  };

  return (
      <AppContext.Provider value={appContext}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Read />} />
            <Route path="read" element={<Read />} />
            <Route path="table" element={<TableWrapper />} />
            <Route path="mappers" element={<Mappers />} />
            <Route path="*" element={<p>There's nothing here: 404!</p>} />
          </Route>
        </Routes>
      </AppContext.Provider>
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
        <NavLink to="/mappers" style={style}>
          Mappers
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

  const {
    getMappers,
  } = useContext(AppContext);


  const getKeyFromPresets = useCallback((headerName) => {
    // TBD: need to update matching algo
    const matchingColumns = presetColumns.filter(col => {
      return col.matchLabels.includes(headerName)
    });

    if (matchingColumns.length > 0) {
      const matchingCol = matchingColumns[0]
      return matchingCol.keyName;
    }

    console.log(`headerName=${headerName} not found in presets`);
    return null;
  }, []);


  // The input data is an object of the form {..., excelHeader: value, ...}
  // The normalized data is an object of the form {..., keyName: value, ...}
  const dataNormalize = useCallback((data) => {
    const nData = data.map(row => {
      return Object.fromEntries(Object.entries(row).map(([headerName, val]) => {
        const keyName = getKeyFromPresets(headerName) || generateKeyFromHeader(headerName);
        return [keyName, val];
      }));
    })
    return nData;
  }, []);

  const getKeyFromMappers = useCallback((headerName) => {
    // TBD: need to update matching algo
    const matchingColumns = presetColumns.filter(col => {
      return col.matchLabels.includes(headerName)
    });

    if (matchingColumns.length > 0) {
      const matchingCol = matchingColumns[0]
      return matchingCol.keyName;
    }

    console.log(`headerName=${headerName} not found in presets`);
    return null;
  }, []);

  // The input data is an object of the form {..., excelHeader: value, ...}
  // The normalized data is an object of the form {..., keyName: value, ...}
  const dataNormalizeUsingMapper = useCallback((data) => {
    // First we match a mapper from the mapper array
    const mappers = getMappers();

    // console.log(`Read: mappers=${JSON.stringify(mappers, null, 2)}`);

    let matchedMapper;
    for(let idx=0; idx < data.slice(0,1).length; idx++) {
      const row = data[idx];
      // console.log(`${JSON.stringify(row, null, 2)}`);

      for (let mprIdx=0; mprIdx < mappers.length; mprIdx++) {
        const {headerKeynameMap} = mappers[mprIdx];

        // Check if all the prop names of the row exist in the mapper

        const headerKeyMap = Object.keys(row).reduce((prev, hdrName) => {
          // console.log(hdrName);
          const matchingEntries = headerKeynameMap.filter(item => item.matchLabels.includes(hdrName));
          if (matchingEntries.length) {
            // console.log(matchingEntries[0]);
            // console.log(JSON.stringify(prev));
            return [...prev, matchingEntries[0]];
          }

          return [...prev];
        }, []);

        if (headerKeyMap.length > 0) {
          matchedMapper = mappers[mprIdx];
          break;
        }
      }
    }

    if (matchedMapper) {
      const {name, headerKeynameMap} = matchedMapper;
      console.log(`dataNormalizeUsingMapper: Match Found: name=${name} keysMatched=${headerKeynameMap.length}`);
      console.log(matchedMapper);
    }

    // Then we use the mapper to create data

  }, [getMappers]);

  const onLoadComplete = ({data}) => {
    const normalizedData = dataNormalizeUsingMapper(data);

    // const normalizedData = dataNormalize(data);
    // navigate('/table', { state: { data:normalizedData } });
  };

  return (
    <>
      <ReadExcel onComplete={onLoadComplete}/>
    </>
  );
};


export default App;
