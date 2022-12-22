import './table.css';
import {
  useTable,
  useRowSelect
} from "react-table";
import {RowCheckbox} from "./parts/RowCheckbox";
// import EditableCell from "./parts/editableCell";
import EditableCell from "./parts/editableControlledCell";
import SelectableCell from "./parts/selectableCell";
import React, {useEffect, useState} from "react";
import {debug} from "../config/debugEnabled";

const SimpleTable = ({data, columns, onChange:updateData, selection}) => {
  if (debug.lifecycle) {
    console.log(`Rendering <SimpleTable>`);
  }
  console.log(`data.length=${data.length} columns.length=${columns.length}`);
  // console.log(JSON.stringify(data, null, 2));

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<SimpleTable>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<SimpleTable>: Destroyed`);
      }
    }
  }, []);

  // The selection feature when enabled causes double render
  // const [featureSelection, setFeatureSelection] = useState(false);

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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow
  } = useTable({
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

  // return (<pre>
  // {
  //   JSON.stringify("data", null, 2)
  // }
  // </pre>);

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

// export default SimpleTable;

// We use React.memo when we want to render the child only when any props change
export default React.memo(SimpleTable);