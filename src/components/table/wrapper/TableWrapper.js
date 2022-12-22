import {useLocation} from "react-router-dom";
import {getColumns} from "../../excel/xlsx/schema";
import {colToRTCol} from "../adapters/reactTableAdapter";
import {BasicTable} from "../SimpleTable";
import {presetColumns} from "../presets/presetColumns";
import {useCallback, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";

// We derive columns from data
// We will just convert the columns.
// Any modification of columns should be handled above this.

export const TableWrapper = () => {
  console.log(`Rendering <TableWrapper>`);
  const {state} = useLocation();

  const [data, setData] = useState(state?.data);
  const [columns, setColumns] = useState(getColumns(data));
  const [updates, setUpdates] = useState([]);

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
  const [rtColumns, setRTColumns] = useState(columns.map(attachPresetProperties))

  const handleUpdateData = (row, col, value) => {
    console.log('handleUpdateData', row, col, value);
    const updatesCopy = [...updates];
    updatesCopy.push({row, col, value});
    setUpdates(updatesCopy);
  };

  useEffect(() => {
    console.log(`updates[]:${updates.length}`)
  }, [updates]);

  const applyUpdate = (data_p, update) => {
    // console.log('handleUpdateData', row, col, value);
    const {row, col, value} = update

    const indices = [row.index];
    // key is stored in col.id
    const values = {[col.label]: value};

    console.log(`handleUpdateData: indices=${JSON.stringify(indices)} values=${JSON.stringify(values)}`);


    const updatedData = data_p.map((item, item_idx) => {
      if (indices.includes(item_idx)) {
        return {...item, ...values};
      }
      return {...item};
    })

    // console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
    return updatedData;
  }

  const handleSaveClick = () => {
    if (updates.length < 1) {
      return
    }

    // let updatedData;
    // updates.forEach(({row, col, value}) => {
    //   updatedData = applyUpdate(row, col, value);
    // });

    const updatedData = updates.reduce((prev, current, index) => {
      return applyUpdate(prev, current);
    }, data);

    console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
  }

  return (
      <>
        {!data &&
          <h1>Please upload an excel file</h1>
        }
        {data &&
          <div style={{
            display:"flex", flexDirection:"column", gap:"20px", alignItems:"center",
          }}>
            <BasicTable data={data} columns={rtColumns} onChange={handleUpdateData}/>
            <div>
              <Button
                  disabled={updates.length < 1}
                  onClick={handleSaveClick}
              >
                Save Changes
              </Button>
            </div>
          </div>
        }
      </>
  );

};
