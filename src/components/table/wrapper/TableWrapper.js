import {useLocation} from "react-router-dom";
import {getColumns} from "../../excel/xlsx/schema";
import {colToRTCol} from "../adapters/reactTableAdapter";
import SimpleTable from "../SimpleTable";
import {presetColumns} from "../presets/presetColumns";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import Button from "react-bootstrap/Button";

// We derive columns from data
// We will just convert the columns.
// Any modification of columns should be handled above this.

export const TableWrapper = () => {
  console.log(`Rendering <TableWrapper>`);
  const {state} = useLocation();

  const [data, setData] = useState(state?.data);
  // console.log(`data=${JSON.stringify(data)}`);

  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    console.log(`<TableWrapper>: First render`);
    return () => {
      console.log(`<TableWrapper>: Destroyed`);
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
  const [rtColumns, setRTColumns] = useState(getColumns(data).map(attachPresetProperties))

  const handleUpdateData = (row, col, value) => {
    // console.log('handleUpdateData', row, col, value);

    // Using this is mandatory as using the updates does not work
    setUpdates((prevState) => {
      // console.log(`prevState=${prevState.length}`);
      return [...prevState].concat({row, col, value});
    });
  };

  const applyUpdate = (prevData, update) => {
    const {row, col, value} = update

    const indices = [row.index];
    const values = {[col.label]: value};

    console.log(`applyUpdate: indices=${JSON.stringify(indices)} values=${JSON.stringify(values)}`);

    const updatedData = prevData.map((item, item_idx) => {
      if (indices.includes(item_idx)) {
        return {...item, ...values};
      }
      return {...item};
    })

    // console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
    return updatedData;
  }

  const handleSaveClick =() => {
    console.log(`updates count: ${updates.length}`);
    if (updates.length < 1) {
      return
    }

    const updatedData = updates.reduce((prevData, update, index) => {
      return applyUpdate(prevData, update);
    }, data);

    // console.log(`updatedData=${JSON.stringify(updatedData, null, 2)}`);
    setData(updatedData);
    setUpdates([]);
  };

  return (
      <>
        {!data &&
          <h1>Please upload an excel file</h1>
        }
        {data &&
          <div style={{
            display:"flex", flexDirection:"column", gap:"20px", alignItems:"center",
          }}>
            <SimpleTable data={data} columns={rtColumns} onChange={handleUpdateData}/>
            <div>
              <Button
                  disabled={updates.length < 1}
                  onClick={e => handleSaveClick()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        }
      </>
  );

};
