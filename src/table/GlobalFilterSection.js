import React, {useContext, useEffect, useMemo, useRef} from "react";
import TableDataContext from "./TableDataContext";
import {GlobalFilter} from "./filter/GlobalFilter";
import {debug} from "../components/config/debugEnabled";

const GlobalFilterSection = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <GlobalFilterSection>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<GlobalFilterSection>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<GlobalFilterSection>: Destroyed`);
      }
    }
  }, []);

  const {
    tableInstance,
    getGlobalFilter,
    onGlobalFilterChange: updateGlobalFilter
  } = useContext(TableDataContext);

  const {state, setGlobalFilter} = tableInstance;
  const globalFilter = state?.globalFilter;

  // const globalFilterActiveRef = useRef(globalFilter && globalFilter.length);
  useEffect(() => {
    console.log(`Global Filter: ${globalFilter}`)
    updateGlobalFilter(globalFilter);
  }, [globalFilter]);

  // We need to reset the pageIndex to 0 when we start typing in the filter
  return (
      <>
        <GlobalFilter {...{globalFilter, setGlobalFilter}}/>
      </>
  )

}

export default React.memo(GlobalFilterSection);
