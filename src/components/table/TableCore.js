import './table.css';
import './table-column-resizer.css';
import {
  useTable,
  useRowSelect,
  useGlobalFilter,
  usePagination,
  useFilters,
  useSortBy,
  useBlockLayout,
  useResizeColumns
} from "react-table";
import {RowCheckbox} from "./parts/RowCheckbox";
import EditableCell from "./parts/editableControlledCell";
import SelectableCell from "./parts/selectableCell";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {debug} from "../config/debugEnabled";
import TableDataContext from "./TableDataContext";
import {ColumnFilterWithIcon} from "./filter/ColumnFilterWithIcon";
import {filterEmptyValues} from "./filter/customFilter";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import {OverlayTrigger} from "react-bootstrap";
import TooltipComponent from "../tooltip/TooltipComponent";

// Supports:
//  - Rows Selection
//  - Edit cells using input and select


const TableCore = () => {
  const {data,
    columns,
    onChange:updateData,

    featureSelection,
    featureGlobalFilter,
    featureEdit,
    featurePagination,
    featureColumnFilter,
    featureSorting,

    layoutFooter,
    layoutFixed,
    layoutResize,
    layoutHeaderTooltip,

    onSelectionChange: updateSelection,
    onRTableChange: updateRTable,
    onPageChange: updatePageIndex,
    getPageIndex: getCurrentPageIndex,
  } = useContext(TableDataContext);

  if (debug.lifecycle) {
    console.log(`Rendering <TableCore>`);
  }
  console.log(`<TableCore>: data.length=${data.length} columns.length=${columns.length}`);
  // console.log(JSON.stringify(data, null, 2));

  // For debugging purpose
  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<TableCore>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<TableCore>: Destroyed`);
      }
    }
  }, []);

  const usePrepareColumn = useCallback((hooks) => {
    // Support row select
    const selectionColumn = {
      id: "selection",
      Header: ({getToggleAllRowsSelectedProps}) => (
          <RowCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      Cell: ({ row }) => (
          <RowCheckbox {...row.getToggleRowSelectedProps()} />
      ),
      enableSorting: false,
      width: 50
    };

    hooks.visibleColumns.push((columns) => {
      const headColumns = featureSelection ? [selectionColumn] : [];

      if (featureEdit) {
        return headColumns.concat([
          ...columns.map(col => {
            if (col.edit) {
              if (col.type === 'input') {
                col.Cell = EditableCell
              } else if (col.type === 'select') {
                col.Cell = (props) => {
                  return <SelectableCell choices={col.choices} {...props} />
                }
              }
            }
            return col;
          }),
        ])
      } else {
        return headColumns.concat([...columns]);
      }
    })
  }, [featureSelection, featureEdit]);


  const pluginHooks = useMemo(() => {
    const hooks = [];
    if (featureGlobalFilter) {
      hooks.push(useGlobalFilter);
    }
    if (featureColumnFilter) {
      hooks.push(useFilters);
    }
    if (featureSorting) {
      hooks.push(useSortBy);
    }
    if (featurePagination) {
      hooks.push(usePagination);
    }
    if (featureSelection) {
      hooks.push(useRowSelect);
    }
    if (layoutFixed) {
      hooks.push(useBlockLayout);
    }
    if (layoutResize) {
      hooks.push(useResizeColumns);
    }

    hooks.push(usePrepareColumn);

    return hooks;
  }, [featureSelection, featureGlobalFilter, featureEdit, featurePagination])

  const currentPageIndex = getCurrentPageIndex();
  // console.log(`<TableCore>: currentPageIndex:${currentPageIndex}`);

  const defaultColumnAttrs = useMemo(() => {
    let attrs = {};

    if (featureColumnFilter) {
      attrs = {
        Filter: ColumnFilterWithIcon,
        filter: filterEmptyValues,
      }
    }

    if (layoutFixed || layoutResize) {
      attrs = {
        ...attrs,
        ...{
          // maxWidth: 300,
          // minWidth: 100,
          // width: 125,
        }
      }
    }

    console.log(`defaultColumnAttrs=`, attrs);
    return attrs;
  }, [featureSelection]);


  const tableInstance = useTable({
        columns,
        data,
        updateData,
        autoResetSelectedRows: false,
        initialState: {
          pageIndex: currentPageIndex,
        },
        defaultColumn: defaultColumnAttrs,
      },
      // useRowSelect is causing two renders
      // https://github.com/TanStack/table/issues/1496
      // As per above don't worry about rerenders as they are performant in react-table
      // To disable just comment out useRowSelect and Selection column
      ...pluginHooks,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    page,
    state
  } = tableInstance;

  const visibleRows = featurePagination ? page : rows;

  const { pageIndex, pageSize } = state;
  useEffect(() => {
    updatePageIndex(pageIndex);
  }, [pageIndex]);

  // Note: Causes a rerender
  // Required for rerendering the BulkSelection component
  useEffect(() => {
    updateSelection(selectedFlatRows);
  }, [selectedFlatRows]);

  useEffect(() => {
    // console.log(`Updated tableInstance`);
    updateRTable(tableInstance);
  }, [tableInstance]);


  return (
  <>
  <table {...getTableProps()}>
    <thead>
    {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {
            headerGroup.headers.map(column => (
              //  If we want header to be clickable then modify getHeaderProps call as 
              //  getHeaderProps(featureSorting ? column.getSortByToggleProps() : {})
              <th {...column.getHeaderProps()}>
                <div style={{
                    display: "flex", flexDirection:"row", justifyContent: "space-between", alignItems: "center", gap:"10px"
                  }}
                >
                  <TooltipComponent message={column.Header} disabled={!layoutHeaderTooltip}>
                    <span style={{whiteSpace:"nowrap"}}>
                      {column.render('Header')}
                    </span>
                  </TooltipComponent>
                  <div style={{display:"flex", flexDirection:"row", gap:"5px", alignItems:"center"}}>
                    {(featureSorting && (column.enableSorting !== false)) && <span {...column.getSortByToggleProps()}>{column.isSorted ? (column.isSortedDesc ? ' >' : ' <') : '<>'}</span>}
                    {featureColumnFilter && <span>{column.canFilter ? column.render('Filter') : null}</span>}
                    {layoutResize &&
                      <div
                        {...column.getResizerProps()}
                        className={`resizer ${column.isResizing ? "isResizing" : ""}`}
                      />
                    }
                  </div>
                </div>
              </th>
            ))
          }
        </tr>
    ))}
    </thead>
    <tbody {...getTableBodyProps()}>
    {
      visibleRows.map(row => {
        prepareRow(row);
        return (
            <tr {...row.getRowProps()}>
              {
                row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })
              }
            </tr>
        );
      })
    }
    </tbody>
    <tfoot>
    {layoutFooter &&
      footerGroups.map(footerGroup => (
          <tr {...footerGroup.getFooterGroupProps()}>
            {
              footerGroup.headers.map(column => (
                  <td {...column.getFooterProps()}>
                    {column.render('Footer')}
                  </td>
              ))
            }
          </tr>
      ))
    }
    </tfoot>
  </table>
  </>
  );
}

// export default TableCore;

// We use React.memo when we want to render the child only when any props change
export default React.memo(TableCore);