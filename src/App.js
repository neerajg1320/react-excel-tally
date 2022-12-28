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
import {accountingColumns, presetColumns} from "./presets/presetColumns";
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
    // TBD: Put default mapper attributes
    mappers.push({name: hdfc.bankName, matchThreshold: 6, headerKeynameMap: hdfc.headerKeynameMap});
    mappers.push({name: kotak.bankName, matchThreshold: 6, headerKeynameMap: kotak.headerKeynameMap});
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
  const dataNormalizeUsingCommon = useCallback((data) => {
    const nData = data.map(row => {
      return Object.fromEntries(Object.entries(row).map(([headerName, val]) => {
        const keyName = getKeyFromPresets(headerName) || generateKeyFromHeader(headerName);
        return [keyName, val];
      }));
    })
    return nData;
  }, []);

  const getKeyFromMapper = useCallback((headerName, headerKeynameMap) => {
    // console.log(`getKeyFromMapper: headerName=${headerName}`);

    const matchingColumns = headerKeynameMap.filter(col => {
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

    const matchedMapper = getMatchedMapper(data[0])

    // Then we use the mapper to create data
    if (matchedMapper) {
      const {name, headerKeynameMap} = matchedMapper;
      console.log(`dataNormalizeUsingMapper: Match Found: name=${name} keysMatched=${headerKeynameMap.length}`);
      console.log(matchedMapper);
      const nData = data.map(row => {
        return Object.fromEntries(Object.entries(row).map(([headerName, val]) => {
          const keyName = getKeyFromMapper(headerName, headerKeynameMap) || generateKeyFromHeader(headerName);
          return [keyName, val];
        }));
      });

      console.log(`nData=${JSON.stringify(nData, null, 2)}`);

      return nData;
    }

    return data;
  }, [getMappers]);

  const addAccountingColumns = useCallback((data) => {
    return data.map((row) => {
      const accRow = {...row};
      const rowProps = Object.keys(accRow);

      accountingColumns.forEach(accCol => {
        if (!rowProps.includes(accCol.keyName)) {
          if (accCol.required) {
            accRow[accCol.keyName] = accCol.defaultValue;
          }
        }
      });
      return accRow
    });
  }, []);


  const getRowSignature = (row) => {
    return Object.entries(row).map(([k, val]) => typeof(val))
  };

  const isHeaderSignature = (rowSignature) => {
    let result = true;
    for (let i=0; i < rowSignature.length; i++) {
      if (rowSignature[i] !== "string") {
        result = false;
        break;
      }
    }

    return result;
  }

  const getMatchedMapper = (headerRow) => {
    const mappers = getMappers();

    let matchedMapper;

    for (let mprIdx=0; mprIdx < mappers.length; mprIdx++) {
      const {matchThreshold, headerKeynameMap} = mappers[mprIdx];
      const headers = Object.keys(headerRow);

      const hdrKeyMap = headers.reduce((prev, hdrName) => {
        const matchingEntries = headerKeynameMap.filter(item => item.matchLabels.includes(hdrName));
        if (matchingEntries.length) {
          return [...prev, matchingEntries[0]];
        }

        return [...prev];
      }, []);

      console.log(`headers.length:${headers.length} hdrKeyMap.length:${hdrKeyMap.length} headerKeynameMap.length:${headerKeynameMap.length}`)
      // If all the keys are matched then declare a match
      if (hdrKeyMap.length == headerKeynameMap.length || (matchThreshold && hdrKeyMap.length > matchThreshold)) {
        // console.log(`hdrKeyMap: ${JSON.stringify(hdrKeyMap, null, 2)}`);
        matchedMapper = mappers[mprIdx];
        break;
      }
    }

  }

  const filterStatement =useCallback((data) => {
    const headerThreshold = 6;

    for (let rowIdx=0; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];
      // console.log(`row=`, row);

      const signature = getRowSignature(row);
      if (signature.length >= headerThreshold) {
        // console.log(`Possible Header: `, row);
        // console.log(`Possible Header: `, signature);
        // console.log(`all string=`, isHeaderSignature(signature));
        if (isHeaderSignature(signature)) {
          console.log(`${rowIdx}: possible header=`, row, signature);
        }
      }

    }

  }, []);

  const onLoadComplete = ({data}) => {
    const statementData = filterStatement(data);
    const normalizedData = dataNormalizeUsingMapper(data);

    // const accountingData = addAccountingColumns(normalizedData);

    // Kept for future use: Would be used for banks which aren't supported yet
    // const normalizedData = dataNormalizeUsingCommon(data);

    navigate('/table', { state: { data:normalizedData } });
  };

  return (
    <>
      <ReadExcel onComplete={onLoadComplete}/>
    </>
  );
};


export default App;
