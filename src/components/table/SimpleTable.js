import './table.css';
import {
  useTable,
  useRowSelect
} from "react-table";
import {RowCheckbox} from "./parts/RowCheckbox";


export const BasicTable = ({data, columns}) => {
  console.log(`Rendering <BasicTable>`);
  // console.log(columns);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow
  } = useTable({
        columns,
        data
      },
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => {
          return [
            {
              id: "selection",
              Header: ({getToggleAllRowsSelectedProps}) => (
                  <RowCheckbox {...getToggleAllRowsSelectedProps()} />
              ),
              Cell: ({ row }) => (
                  <RowCheckbox {...row.getToggleRowSelectedProps()} />
              )
            },
            ...columns
          ]
        })
      }
  );

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