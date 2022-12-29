import ReadExcel from "./components/excel/xlsx/ReadExcel";
import * as React from 'react';
import {Routes, Route, Outlet, NavLink, useNavigate} from 'react-router-dom';
import {TableWrapper} from "./components/table/TableWrapper";
import {useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {debug} from "./components/config/debug";
import {Mappers} from "./components/mappers/Mappers";
import AppContext from "./AppContext";
import * as hdfc from "./banks/hdfc";
import * as kotak  from "./banks/kotak";
import {accountingColumns, presetColumns, statementColumns} from "./presets/presetColumns";
import {generateKeyFromHeader} from "./schema/core";
import {type} from "@testing-library/user-event/dist/type";
import {isDate} from "./utils/types";

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

  const debugFiltering = false;
  const debugRowIdx = debugFiltering ? 22 : -1;

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

    const [matchedMapper, exactMapper] = getMatchedMapper(Object.keys(data[0]));

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


  const getType = (val) => {
    if (isDate(val)) {
      return 'date';
    }
    return typeof(val);
  }

  const getRowSignature = (row, rowIdx, numProps) => {
    const propNames = Object.keys(row);

    if (rowIdx === debugRowIdx) {
      console.log(`getRowSignature:`, row);
      console.log(`numProps=${numProps}`);
      console.log(`propNames=`, propNames);
    }

    const signatureFullRow = [];
    for (let i=0; i < Math.max(propNames.length, numProps); i++) {
      signatureFullRow.push(getType(row[i]));
    }

    if (rowIdx === debugRowIdx) {
      console.log(`signatureFullRow=`, signatureFullRow);
    }

    // return Object.entries(row).map(([k, val]) => typeof(val));
    return signatureFullRow;
  };

  const isAllString = (rowSignature) => {
    let result = true;
    for (let i=0; i < rowSignature.length; i++) {
      if (rowSignature[i] !== "string") {
        result = false;
        break;
      }
    }

    return result;
  }

  const getMatchedMapper = (headers) => {
    const mappers = getMappers();
    // console.log(`mappers=`, mappers);

    let matchedPresetMapper;
    let exactMapper;

    for (let mprIdx=0; mprIdx < mappers.length; mprIdx++) {
      const {matchThreshold, headerKeynameMap} = mappers[mprIdx];

      const hdrKeyEntries = headers.reduce((prev, hdrName) => {
        const matchingEntries = headerKeynameMap.filter(item => item.matchLabels.includes(hdrName));
        if (matchingEntries.length) {
          return [...prev, [hdrName, matchingEntries[0]]];
        }

        return [...prev];
      }, []);

      // console.log(`headers.length:${headers.length} hdrKeyEntries.length:${hdrKeyEntries.length} headerKeynameMap.length:${headerKeynameMap.length}`)

      // If all the keys are matched then declare a match
      if (hdrKeyEntries.length == headerKeynameMap.length || (matchThreshold && hdrKeyEntries.length > matchThreshold)) {
        // console.log(`hdrKeyMap: ${JSON.stringify(hdrKeyEntries, null, 2)}`);
        matchedPresetMapper = mappers[mprIdx];
        exactMapper = Object.fromEntries(hdrKeyEntries);
        // console.log(`exactMapper: ${JSON.stringify(exactMapper, null, 2)}`);
        break;
      }
    }

    return [matchedPresetMapper, exactMapper];
  }

  const isSignatureMatch = (mSignature, signature, rowIdx, matchType) => {
    let match = true;
    for (let i=0; i < mSignature.length; i++) {
      if (!mSignature[i].includes(signature[i])) {
        if (rowIdx === debugRowIdx) {
          console.log(`i:${i} no match: mSignature[i]=${mSignature[i]}  signature[i]=${signature[i]}`);
        }
        match = false;
        break;
      }
    }
    return match;
  }

  const filterStatement = useCallback((data) => {
    const filterThreshold = 6;
    let matchedPresetMapper, exactMapper;
    let matchRowSignature;

    let headerRow;
    let matchedRows = [];

    for (let rowIdx=0; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];

      if (rowIdx == debugRowIdx) {
        console.log(`${rowIdx}: matchedMapper=`, matchedPresetMapper);
      }

      const signature = getRowSignature(row, rowIdx, matchedPresetMapper ? matchedPresetMapper.headerKeynameMap.length : -1);
      if (signature.length >= filterThreshold) {
        // All strings signature is a possible header
        if (isAllString(signature)) {
          const headers = Object.entries(row).map(([k, val]) => val);
          const [resultMapper, resultExactMapper] = getMatchedMapper(headers);

          if (resultMapper) {
            matchedPresetMapper = resultMapper;
            exactMapper = resultExactMapper;

            if (debugFiltering || true) {
              console.log(`${rowIdx}: Found Header Row:`, row);
              console.log(`matchedMapper.headerKeynameMap:`, matchedPresetMapper.headerKeynameMap);
            }

            headerRow = {...row};

            // Get the type of the keyNames from the statement
            // From the statementColumns create an acceptable signature
            const propNames = matchedPresetMapper.headerKeynameMap.map(item => (item.keyName));
            matchRowSignature = propNames.map(propName => {
              const matchingStatementCols = statementColumns.filter(col => col.keyName === propName);
              if (matchingStatementCols.length > 0) {
                let acceptedTypes = [matchingStatementCols[0].type];

                // We are accepting strings as dates as well
                if (matchingStatementCols[0].type === "date") {
                  acceptedTypes.push('string');
                }

                if (!matchingStatementCols[0].required) {
                  acceptedTypes.push('undefined');
                }
                return acceptedTypes;
              }
            });
          }
        } else {
          if (matchRowSignature) {
            const isMatch = isSignatureMatch(matchRowSignature, signature, rowIdx);
            if (isMatch) {
              matchedRows.push({...row});
            }

            if (rowIdx === debugRowIdx) {
              console.log(`${rowIdx}: matchRowSignature=`, matchRowSignature);
              console.log(`${rowIdx}: signature=`, signature);
              console.log(`match:${isMatch}`);
            }

          }
        }
      }
    }

    return {headerRow, matchedRows, matchedPresetMapper, exactMapper};

  }, []);

  const createDataFromRows = (header, rows, matchedPresetMapper, exactMapper, skipUndefined=true) => {
    // header is an array of column names in file. We need to get keyNames
    const keyNames = matchedPresetMapper.headerKeynameMap.map(item => [item.keyName]);
    // console.log(`keyNames=${JSON.stringify(keyNames, null, 2)}`);

    return rows.map(row => {
      const item = {};
      for (let i=0; i < keyNames.length; i++) {
        console.log(header[i], exactMapper[header[i]]);
        const keyName =  exactMapper[header[i]].keyName;

        if (skipUndefined && row[i] === undefined) {
          continue;
        }

        item[keyName] = row[i];
      }
      return item;
    });
  }

  const onLoadComplete = ({data}) => {
    const {headerRow, matchedRows, matchedPresetMapper, exactMapper} = filterStatement(data);

    // Kept for future use: Would be used for banks which aren't supported yet
    // const normalizedData = dataNormalizeUsingCommon(data);

    // The following is used when we read excel with a header row specified
    // const normalizedData = dataNormalizeUsingMapper(data);

    // This takes excel rows and create data using a mappper
    const filteredData = createDataFromRows(headerRow, matchedRows, matchedPresetMapper, exactMapper, false)
    console.log(`filteredData:`, filteredData);

    const accountingData = addAccountingColumns(filteredData);

    navigate('/table', { state: { data:accountingData } });
  };

  return (
    <>
      <ReadExcel onComplete={onLoadComplete}/>
    </>
  );
};


export default App;
