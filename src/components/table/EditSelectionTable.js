import './table.css';
import {
  useTable,
  useRowSelect
} from "react-table";
import {RowCheckbox} from "./parts/RowCheckbox";
// import EditableCell from "./parts/editableCell";
import EditableCell from "./parts/editableControlledCell";
import SelectableCell from "./parts/selectableCell";
import React, {useContext, useEffect} from "react";
import {debug} from "../config/debug";
import TableDataContext from "./TableDataContext";

// Supports:
//  - Rows Selection
//  - Edit cells using input and select


const EditSelectionTable = () => {
  const {data,
    columns,
    onChange:updateData,
    selection,
    onSelectionChange: updateSelection
  } = useContext(TableDataContext);

  if (debug.lifecycle) {
    console.log(`Rendering <EditSelectionTable>`);
  }
  console.log(`data.length=${data.length} columns.length=${columns.length}`);
  // console.log(JSON.stringify(data, null, 2));

  // For debugging purpose
  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<EditSelectionTable>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<EditSelectionTable>: Destroyed`);
      }
    }
  }, []);


  // Support row select
  const selectionColumn = {
    id: "selection",
    Header: ({getToggleAllRowsSelectedProps}) => (
        <RowCheckbox {...getToggleAllRowsSelectedProps()} />
    ),
    Cell: ({ row }) => (
        <RowCheckbox {...row.getToggleRowSelectedProps()} />
    )
  };
  const selectionHook = selection ? useRowSelect : null;

  const rTable = useTable({
        columns,
        data,
        updateData
      },
      // useRowSelect is causing two renders
      // https://github.com/TanStack/table/issues/1496
      // As per above don't worry about rerenders as they are performant in react-table
      // To disable just comment out useRowSelect and Selection column
      selectionHook,
      (hooks) => {
        hooks.visibleColumns.push((columns) => {
          const headColumns = selection ? [selectionColumn] : [];
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
        })
      }
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    toggleAllRowsSelected,
  } = rTable;

  useEffect(() => {
    console.log(`Updated rTable`);
  }, [rTable]);

  // This is causing additional rerender
  // console.log(`selectedFlatRows=${selectedFlatRows}`);
  // useEffect(() => {
  //   updateSelection(selectedFlatRows);
  // }, [selectedFlatRows]);

  return (
  <>
  <table {...getTableProps()}>
    <thead>
    {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {
            headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))
          }
        </tr>
    ))}
    </thead>
    <tbody {...getTableBodyProps()}>
    {
      rows.map(row => {
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
    {
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

// export default EditSelectionTable;

// We use React.memo when we want to render the child only when any props change
export default React.memo(EditSelectionTable);