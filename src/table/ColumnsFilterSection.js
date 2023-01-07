import {debug} from "../components/config/debugEnabled";
import React, {useContext, useEffect} from "react";
import TableDataContext from "./TableDataContext";

const ColumnsFilterSection = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <ColumnsFilterSection>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<ColumnsFilterSection>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<ColumnsFilterSection>: Destroyed`);
      }
    }
  }, []);

  const {
    state,
    onColumnsFilterChange: updateColumnsFilter
  } = useContext(TableDataContext);

  const filters = state?.filters;

  // This is important. The updated value is stored in the TableWrapper.
  // It is provided to TableCore upon re-render.
  useEffect(() => {
    console.log(`ColumnsFilterSection: `, filters)
    updateColumnsFilter(filters);
  }, [filters]);

  return (
    <>
      CF
    </>

  );
}

export default React.memo(ColumnsFilterSection);