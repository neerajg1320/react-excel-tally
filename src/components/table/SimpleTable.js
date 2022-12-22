import './table.css';
import {
  useTable,
  useRowSelect
} from "react-table";
import {RowCheckbox} from "./parts/RowCheckbox";
import EditableCell from "./parts/editableCell";
import SelectableCell from "./parts/selectableCell";

export const BasicTable = ({data, columns}) => {
  console.log(`Rendering <BasicTable>`);
  console.log(`columns.length=${columns.length} data.length=${data.length}`);

  const updateData = (row, col, value) => {
    console.log('updateData', row, col, value);

    const id = row.original.id;
    // key is stored in col.id
    const values = {[col.id]: value};

  }

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