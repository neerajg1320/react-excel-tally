import {debug} from "../config/debugEnabled";
import React, {useEffect, useMemo} from "react";
import EditSelectionTable from "./EditSelectionTable";

const BulkOperationsTable = ({data, columns, onChange:updateData, selection}) => {
  if (debug.lifecycle) {
    console.log(`Rendering <BulkOperationsTable>`);
  }
  
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



  // Support bulk select
  const bulkColumns = useMemo(() => {
    return columns?.length ? columns.filter(col => col.bulk) : [];
  }, [columns]);

  console.log(`bulkColumns=${JSON.stringify(bulkColumns.map(col => col.key))}`);

  return (
      <>
        <EditSelectionTable {...{
          data,
          columns,
          onChange:updateData,
          // selection
        }}/>
      </>
  );
}

// export default EditSelectionTable;

// We use React.memo when we want to render the child only when any props change
export default React.memo(BulkOperationsTable);