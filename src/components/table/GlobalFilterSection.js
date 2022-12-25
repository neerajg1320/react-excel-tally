import React, {useContext, useEffect, useRef} from "react";
import TableDataContext from "./TableDataContext";
import {GlobalFilter} from "./filter/GlobalFilter";
import {debug} from "../config/debugEnabled";

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
    rTable,
    featureGlobalFilter,
    onGlobalFilterChange: updateGlobalFilter
  } = useContext(TableDataContext);

  const {state, setGlobalFilter} = rTable;
  const {globalFilter} = state || {};

  // const globalFilterActiveRef = useRef(globalFilter && globalFilter.length);
  useEffect(() => {
    console.log(`Global Filter: ${globalFilter}`)
    updateGlobalFilter(globalFilter);
  }, [globalFilter]);

  // We need to reset the pageIndex to 0 when we start typing in the filter
  return (
      <>
        {featureGlobalFilter && <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>}
      </>
  )

}

export default React.memo(GlobalFilterSection);
