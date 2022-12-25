import {useLocation} from "react-router-dom";
import {getColumns} from "../excel/xlsx/schema";
import {colToRTCol} from "./adapters/reactTableAdapter";
import {presetColumns} from "./presets/presetColumns";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Button from "react-bootstrap/Button";
import {debug} from "../config/debug";
import BulkOperationsSection from "./BulkOperationsSection";
import TableDataContext from "./TableDataContext";
import EditSelectionTable from "./EditSelectionTable";
import {DELETE, PATCH} from "./common/operationsTypes";
import GlobalFilterSection from "./GlobalFilterSection";
import PaginationSection from "./PaginationSection";

// We derive columns from data
// We will just convert the columns.
// Any modification of columns should be handled above this.


export const TableWrapper = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <TableWrapper>`);
  }

  // // Data Section

  const {state} = useLocation();
  const [data, setData] = useState(state?.data);

  // Data Features:
  // Update with commit
  const updateWithCommit = useMemo(() => true, []);
  const [updates, setUpdates] = useState([]);


  // // Table Section

  // Used for re-rendering the table
  const tableKeyRef = useRef(1);
  const [rTable, setRTable] = useState({})

  // Table features:
  const [featureSelection, setFeatureSelection] = useState(true);
  const [featureEdit, setFeatureEdit] = useState(true);
  const [featureBulk, setFeatureBulk] = useState(true);
  const [featureGlobalFilter, setFeatureGlobalFilter] = useState(true);
  const [featurePagination, setFeaturePagination] = useState(true);

  const [selectedRows, setSelectedRows] = useState([])
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

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

  // Keep this function as this is used for causing a render
  // Check the behaviour before and after in case this has to be deleted
  const handleSelectionUpdate = useCallback((seletedFlatRows) => {
    // console.log(`handleSelectionUpdate: `, seletedFlatRows);
    setSelectedRows(seletedFlatRows);
  }, []);

  const handleRTableChange = useCallback((rt) => {
    console.log(`handleRTableChange: `, rt);
    setRTable(rt);
  }, []);

  // convert before using this to ids and patch
  const applyUpdate = useCallback((prevData, {action, payload:{indices, patch}}) => {
    // console.log(`applyUpdate: action=${action}`);

    switch (action) {
      case PATCH:
        const updatedData = prevData.map((item, item_idx) => {
          if (indices.includes(item_idx)) {
            return {...item, ...patch};
          }
          return {...item};
        })

        // console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
        return updatedData;

      case DELETE:
        return prevData.filter((item, index) => !indices.includes(index))

      default:
        return prevData;
    }
  }, []);

  const commitUpdates = useCallback((updates) => {
    // Since data is updated on the previous state
    setData((prevData) => {
      return updates.reduce((pData, update, index) => {
        return applyUpdate(pData, update);
      }, prevData);
    });
  }, [applyUpdate]);

  const {toggleAllRowsSelected} = rTable;

  const handleCommitClick = useCallback((updates) => {
    // console.log(`updates count: ${updates.length}`);
    if (updates.length < 1) {
      return
    }

    commitUpdates(updates);

    setUpdates([]);

    // Reset the selection of rows
    // const {toggleAllRowsSelected} = rTable; // TBD Optimize: take definition outside
    toggleAllRowsSelected(false);
  }, [commitUpdates, rTable]);

  const handleDataChange = useCallback((action, indices, patch) => {
    // console.log('handleDataChange:', action, indices, patch);

    const update = {action, payload:{indices, patch}};

    if (updateWithCommit) {
      setUpdates((prevUpdates) => {
        return [...prevUpdates].concat(update);
      });
    } else {
      commitUpdates([update]);

      // Reset the selection of rows
      if (toggleAllRowsSelected) {
        toggleAllRowsSelected(false);
      }
    }
  }, [commitUpdates, rTable]);


  const handleResetClick = useCallback((updates) => {
    // setTableKey((prevTableKey) => prevTableKey + 1);
    tableKeyRef.current += 1;

    setUpdates([]);
  }, []);

  const handlePageChange = useCallback((pageIndex) => {
    console.log(`handlePageChange: ${pageIndex}`);
    setPageIndex(pageIndex);
  }, []);


  // We need to fix the pageIndex when filtering starts
  const handleGlobalFilterChange = useCallback(({value}) => {
    console.log(`handleGlobalFilterChange: value=${value}`);
    setGlobalFilterValue((preValue) => {
      if (!preValue && value) {
        console.log(`Filter active pulse`);
        // setPageIndex(0);
        // const {gotoPage} = rTable;
        // gotoPage(1);
      }

      if (preValue && !value) {
        console.log(`Filter passive pulse`);
      }
      return value;
    })
  }, [rTable])

  const providePageIndex = () => {
    console.log(`providePageIndex: pageIndex=${pageIndex}`)
    return pageIndex;
  }

  const tableContext = {
    data,
    columns: rtColumns,
    onChange: handleDataChange,
    selection: featureSelection,
    filter: featureGlobalFilter,
    bulk: featureBulk,
    edit: featureEdit,
    pagination: featurePagination,
    selectedRows,
    rTable,
    onSelectionChange: handleSelectionUpdate,
    onRTableChange: handleRTableChange,
    onPageChange: handlePageChange,
    getPageIndex: providePageIndex,
    onGlobalFilterChange: handleGlobalFilterChange
  };

  return (
      <>
        <TableDataContext.Provider value={tableContext}>
          {!data &&
            <div style={{
              display:"flex", flexDirection:"row", justifyContent:"center", alignItems: "center"
            }}>
              <h1>Please upload an excel file</h1>
            </div>
          }
          {data &&
            <div style={{
              display:"flex", flexDirection:"column", gap:"20px", alignItems:"center",
            }}>

              <div style={{
                display:"flex", flexDirection:"row", justifyContent:'space-between', gap:"40px",
                width: "100%", padding: "0 40px",
              }}>
                <div>
                  <BulkOperationsSection edit={featureEdit}/>
                </div>
                <div>
                  <GlobalFilterSection />
                </div>
              </div>

              <EditSelectionTable key={tableKeyRef.current} />
              <PaginationSection />

              {updateWithCommit &&
              <div style={{
                display: "flex", flexDirection: "row", gap: "20px"
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
                    onClick={e => handleCommitClick(updates)}
                >
                  Commit
                </Button>
              </div>
              }
            </div>
          }
        </TableDataContext.Provider>
      </>
  );

};
