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
import {dateFromString, dateFromNumber, getValueType, isDate, isString, numberFromString} from "./utils/types";

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
          const keyName = matchingEntries[0].keyName;
          const statementColumn = statementColumns.filter(col => col.keyName === keyName)[0];
          const exactMapperEntry = {
            ...matchingEntries[0],
            statementColumn,
            detectedTypes: [],
            acceptedTypes: []
          };
          return [...prev, [hdrName, exactMapperEntry]];
        }

        return [...prev];
      }, []);

      // console.log(`headers.length:${headers.length} hdrKeyEntries.length:${hdrKeyEntries.length} headerKeynameMap.length:${headerKeynameMap.length}`)

      // If all the keys are matched then declare a match
      if (hdrKeyEntries.length === headerKeynameMap.length || (matchThreshold && hdrKeyEntries.length > matchThreshold)) {
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
    if (rowIdx === 1) {
      console.log(`mSignature=${JSON.stringify(mSignature)}  signature=${JSON.stringify(signature)}`);
    }
    for (let i=0; i < mSignature.length; i++) {
      if (mSignature[i] && !mSignature[i].includes(signature[i])) {
        if (rowIdx === 1) {
          console.log(`i:${i} no match: mSignature[i]=${mSignature[i]}  signature[i]=${signature[i]}`);
        }
        match = false;
        break;
      }
    }
    return match;
  }

  const filterStatementRows = useCallback((data) => {
    const filterThreshold = 6;
    let matchedPresetMapper, exactMapper;
    let matchRowSignature;

    let headerRow;
    let matchedRows = [];

    for (let rowIdx=0; rowIdx < data.length; rowIdx++) {
      const row = data[rowIdx];

      if (rowIdx === debugRowIdx) {
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

            if (debugFiltering) {
              console.log(`${rowIdx}: Found Header Row:`, row);
              console.log(`matchedMapper.headerKeynameMap: ${JSON.stringify(matchedPresetMapper.headerKeynameMap, null, 2)}`);
              console.log(`exactMapper: ${JSON.stringify(exactMapper, null, 2)}`);
            }
            headerRow = {...row};

            if (debugFiltering) {
              console.log(headerRow);
            }

            // Get the type of the keyNames from the statement
            // From the statementColumns create an acceptable signature
            matchRowSignature = headers.map(hdrName => {
              const statementCol = exactMapper[hdrName]?.statementColumn;
              if (statementCol) {
                const acceptedTypes = exactMapper[hdrName].acceptedTypes;

                if (statementCol.acceptedTypes) {
                  statementCol.acceptedTypes.forEach(t => acceptedTypes.push(t));
                } else {
                  acceptedTypes.push(statementCol.type)
                }

                // const acceptedTypes = [statementCol.type];

                // We are accepting strings as dates as well
                if (statementCol.type === "date") {
                  acceptedTypes.push('string');
                  acceptedTypes.push('number');
                }

                if (statementCol.type === "number") {
                  acceptedTypes.push('string');
                }

                if (!statementCol.required) {
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

  const createDataFromRows = (header, rows, matchedPresetMapper, exactMapper,
                              {skipUndefined, interpretTypes, interpretHeaderTypes}
  ) => {
    // header is an array of column names in file. We need to get keyNames
    const keyNames = matchedPresetMapper.headerKeynameMap.map(item => [item.keyName]);

    const data = rows.map((row, rowIdx) => {
      const item = {};
      for (let i=0; i < keyNames.length; i++) {
        const headerName = header[i];
        const {keyName, format, statementColumn, parse, detectedTypes} =  exactMapper[headerName];

        if (skipUndefined && row[i] === undefined) {
          continue;
        }

        // console.log(`statementColumn=${JSON.stringify(statementColumn, null, 2)}`);

        if (22 === rowIdx) {
          console.log(`headerName='${headerName}' keyName='${keyName}' format='${format}' row[${i}]='${row[i]}':${typeof(row[i])}`);
        }

        // item[keyName] = row[i];
        const value = row[i];

        if (interpretTypes) {
          let interpretedValue;

          if (parse) {
            interpretedValue = parse(value, rowIdx);
          }

          if (interpretedValue === undefined && value !== undefined) {
            if (statementColumn.type) {
              if (statementColumn.type === "date") {
                if (isString(value)) {
                  if (22 === rowIdx) { console.log(`got string`);}
                  interpretedValue = dateFromString(value, format);
                } else {
                  if (22 === rowIdx) { console.log(`got not string`);}
                  interpretedValue = dateFromNumber(value);
                }
              } else if (statementColumn.type === "number") {
                interpretedValue = numberFromString(value);
              } else if (statementColumn.type === "string") {
                interpretedValue = String(value);
              }
            }
          }

          item[keyName] = interpretedValue !== undefined ? interpretedValue : value;
        }

        if (debugRowIdx === rowIdx) {
          console.log(`converted=${item[keyName]} ${typeof(item[keyName])}`);
        }

        if (interpretHeaderTypes) {
          const valueType = getValueType(item[keyName]);
          if (!detectedTypes.includes(valueType)) {
            detectedTypes.push(valueType);
          }
        }
      }

      if (debugRowIdx === rowIdx) {
        console.log(`item=${JSON.stringify(item, null, 2)}`);
      }

      return item;
    });

    return data;
  }

  const onLoadComplete = ({data}) => {
    // console.log(`data=`, data);
    const {headerRow, matchedRows, matchedPresetMapper, exactMapper} = filterStatementRows(data);

    // Kept for future use: Would be used for banks which aren't supported yet
    // const normalizedData = dataNormalizeUsingCommon(data);

    // The following is used when we read excel with a header row specified
    // const normalizedData = dataNormalizeUsingMapper(data);

    // This takes excel rows and create data using a mappper
    const filteredData = createDataFromRows(
        headerRow,
        matchedRows,
        matchedPresetMapper,
        exactMapper,
        {
          skipUndefined: false,
          interpretTypes: true,
          interpretHeaderTypes: true
        }
    )
    // console.log(`onLoadComplete: exactMapper=`, exactMapper);
    // console.log(`filteredData:`, filteredData);

    const accountingData = addAccountingColumns(filteredData);

    navigate('/table', { state: { data:accountingData, headersMap:JSON.stringify(exactMapper) } });
  };

  return (
    <>
      <ReadExcel onComplete={onLoadComplete}/>
    </>
  );
};


export default App;
