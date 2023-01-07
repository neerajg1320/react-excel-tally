import {debug} from "../components/config/debugEnabled";
import React, {useContext, useEffect} from "react";
import TableDataContext from "./TableDataContext";

// This is not used as of now.
const ColumnsFiltersSection = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <ColumnsFiltersSection>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<ColumnsFiltersSection>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<ColumnsFiltersSection>: Destroyed`);
      }
    }
  }, []);

  const {
    state,
    onColumnsFiltersChange: updateColumnsFilters
  } = useContext(TableDataContext);

  console.log(`ColumnsFiltersSection: state=`, state);

  const filters = state?.filters;

  // This is important. The updated value is stored in the TableWrapper.
  // It is provided to TableCore upon re-render.
  useEffect(() => {
    // console.log(`ColumnsFiltersSection: `, filters)
    // updateColumnsFilters(filters);
  }, [filters]);

  return (
    <>
      CF
    </>

  );
}

export default React.memo(ColumnsFiltersSection);