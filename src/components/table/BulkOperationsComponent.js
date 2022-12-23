import {debug} from "../config/debug";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import EditSelectionTable from "./EditSelectionTable";
import TableDataContext from "./TableDataContext";
import Button from "react-bootstrap/Button";
import ExpandableButton from "../expandableButton/ExpandableButton";
import ColumnsEditBox from "./parts/ColumnsEditBox";

const BulkOperationsComponent = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <BulkOperationsComponent>`);
  }

  const {columns, rTable, onChange:updateData} = useContext(TableDataContext);

  console.log(rTable);
  const {selectedFlatRows, toggleAllRowsSelected} = rTable;

  const bulkEnabled = selectedFlatRows && selectedFlatRows?.length > 0;
  const [bulkEditExpanded, setBulkEditExpanded] = useState(false);

  // For debugging purpose
  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<BulkOperationsTable>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<SimpleBulkOperationsTableTable>: Destroyed`);
      }
    }
  }, []);

  const getRowIndices = useCallback((selRows) => {
    return selRows.map(row => {
      return row.index;
    });
  }, []);

  const handleBulkDeleteClick = useCallback(() => {
    const indices = getRowIndices(selectedFlatRows);

    console.log(`handleBulkDeleteClick: ids=${JSON.stringify(indices)}`);
  }, [selectedFlatRows]);

  const handleBulkEditSaveClick = useCallback((patch) => {
    const indices = getRowIndices(selectedFlatRows);

    console.log(`handleBulkEditSaveClick: indices=${JSON.stringify(indices)} patch=${JSON.stringify(patch)}`);
    updateData(indices, patch);
    setBulkEditExpanded(false);
  }, [selectedFlatRows]);

  const handleBulkEditCancelClick = useCallback(() => {
    setBulkEditExpanded(false);
  }, []);

  const handleClearSelectionClick = useCallback(() => {
    if (toggleAllRowsSelected) {
      toggleAllRowsSelected();
    }
  }, [toggleAllRowsSelected]);

  // Support bulk select
  const bulkColumns = useMemo(() => {
    return columns?.length ? columns.filter(col => col.bulk) : [];
  }, [columns]);

  console.log(`bulkColumns=${JSON.stringify(bulkColumns.map(col => col.key))}`);

  return (

        <div style={{display:"flex", gap: "10px", padding:"20px"}}>
          <Button variant="danger" size="sm"
                  disabled={!bulkEnabled}
                  onClick={e => handleBulkDeleteClick()}
          >
            Bulk Delete
          </Button>

          {/* We should try and replace below */}
          <ExpandableButton
              title="Bulk Edit"
              disabled={!bulkColumns.length || !bulkEnabled}
              value={bulkEditExpanded}
              onChange={exp => setBulkEditExpanded(exp)}
              popupPosition={{left: "60px", top: "25px"}}
          >
            <ColumnsEditBox
                columns={bulkColumns}
                onSave={handleBulkEditSaveClick}
                onCancel={handleBulkEditCancelClick}
                disabled={!bulkEnabled}
            />
          </ExpandableButton>

          <Button variant="outline-dark" size="sm"
                  disabled={!bulkEnabled}
                  onClick={handleClearSelectionClick}
          >
            Clear
          </Button>
        </div>

  );
}

// export default EditSelectionTable;

// We use React.memo when we want to render the child only when any props change
export default React.memo(BulkOperationsComponent);