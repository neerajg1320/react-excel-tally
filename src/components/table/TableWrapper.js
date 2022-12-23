import {useLocation} from "react-router-dom";
import {getColumns} from "../excel/xlsx/schema";
import {colToRTCol} from "./adapters/reactTableAdapter";
import {presetColumns} from "./presets/presetColumns";
import React, {useCallback, useEffect, useRef, useState} from "react";
import Button from "react-bootstrap/Button";
import {debug} from "../config/debug";
import BulkOperationsComponent from "./BulkOperationsComponent";
import TableDataContext from "./TableDataContext";
import EditSelectionTable from "./EditSelectionTable";

// We derive columns from data
// We will just convert the columns.
// Any modification of columns should be handled above this.


export const TableWrapper = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <TableWrapper>`);
  }
  const {state} = useLocation();

  const [data, setData] = useState(state?.data);
  // console.log(`data=${JSON.stringify(data)}`);
  const [rTable, setRTable] = useState({})
  const [selectedRows, setSelectedRows] = useState([])

  const [updates, setUpdates] = useState([]);
  const tableKeyRef = useRef(1);

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<TableWrapper>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<TableWrapper>: Destroyed`);
      }
    }
  }, []);


  const attachPresetProperties = (col, index) => {
    const mPresetCols = presetColumns.filter(pcol=> pcol.key === col.key);

    if (mPresetCols.length) {
      col = mPresetCols[0];

      if (col.type === 'select') {
        // The Column choices have to be updated.
        // col.choices = choices[col.key.toLowerCase()];
        // col.choices = categoryChoices;
      }
    }

    col.index = index;
    return colToRTCol(col);
  };
  // eslint-disable-next-line
  const [rtColumns, setRTColumns] = useState(getColumns(data).map(attachPresetProperties));


  const handleUpdateData = useCallback((indices, patch) => {
    console.log('handleUpdateData', JSON.stringify(indices), JSON.stringify(patch));

    // Using this is mandatory as using the updates does not work
    setUpdates((prevState) => {
      return [...prevState].concat({indices, patch});
    });
  }, []);

  const handleSelectionUpdate = useCallback((seletedFlatRows) => {
    console.log(`handleSelectionUpdate: `, seletedFlatRows);
    // setRTable(rt);
    setSelectedRows(seletedFlatRows);
  }, []);

  const handleRTableChange = useCallback((rt) => {
    setRTable(rt);
  }, []);

  // convert before using this to ids and patch
  const applyUpdate = useCallback((prevData, {indices, patch}) => {
    console.log(`applyUpdate: indices=${JSON.stringify(indices)} patch=${JSON.stringify(patch)}`);

    const updatedData = prevData.map((item, item_idx) => {
      if (indices.includes(item_idx)) {
        return {...item, ...patch};
      }
      return {...item};
    })

    // console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
    return updatedData;
  }, []);

  const handleSaveClick = useCallback((updates) => {
    // console.log(`updates count: ${updates.length}`);
    if (updates.length < 1) {
      return
    }

    // Since data is updated on the previous state
    setData((prevData) => {
      return updates.reduce((pData, update, index) => {
            return applyUpdate(pData, update);
          }, prevData);
    });
    setUpdates([]);
  }, [applyUpdate]);

  const handleResetClick = useCallback((updates) => {
    // setTableKey((prevTableKey) => prevTableKey + 1);
    tableKeyRef.current += 1;

    setUpdates([]);
  }, []);

  return (
      <>
        <TableDataContext.Provider value={{
          data,
          columns: rtColumns,
          onChange: handleUpdateData,
          selection: true,
          selectedRows,
          rTable,
          onSelectionChange: handleSelectionUpdate,
          onRTableChange: handleRTableChange
        }}>
          {!data &&
            <h1>Please upload an excel file</h1>
          }
          {data &&
            <div style={{
              display:"flex", flexDirection:"column", gap:"20px", alignItems:"center",
            }}>
              <BulkOperationsComponent
                  key={tableKeyRef.current}
              />

              <EditSelectionTable />

              <div style={{
                display:"flex", flexDirection:"row", gap:"20px"
              }}>
                <Button
                    className="btn-outline-primary bg-transparent"
                    disabled={updates.length < 1}
                    onClick={e => handleResetClick(updates)}
                >
                  Reset
                </Button>
                <Button
                    disabled={updates.length < 1}
                    onClick={e => handleSaveClick(updates)}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          }
        </TableDataContext.Provider>
      </>
  );

};
