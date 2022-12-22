import {useLocation} from "react-router-dom";
import {getColumns} from "../../excel/xlsx/schema";
import {colToRTCol} from "../adapters/reactTableAdapter";
import {BasicTable} from "../SimpleTable";
import {presetColumns} from "../presets/presetColumns";

// We will just convert the columns.
// Any modification of columns should be handled above this.

export const TableWrapper = () => {
  console.log(`Rendering <Table>`);
  const {state} = useLocation();

  if (!state) {
    return <h1>Empty</h1>
  }

  const handleUpdateData = (row, col, value) => {
    console.log('handleUpdateData', row, col, value);

    const id = row.original.id;
    // key is stored in col.id
    const values = {[col.id]: value};

  }

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

  const {data} = state;
  const columns = getColumns(data);
  const rtColumns = columns.map(attachPresetProperties);

  // console.log(`rtColumns=${JSON.stringify(rtColumns, null, 2)}`);

  return (
      <>
        <BasicTable data={data} columns={rtColumns} onChange={handleUpdateData}/>
      </>
  );
};
