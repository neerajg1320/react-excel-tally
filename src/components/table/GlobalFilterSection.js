import React, {useContext, useEffect} from "react";
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

  const {rTable, filter} = useContext(TableDataContext);
  const {state, setGlobalFilter} = rTable;
  const {globalFilter} = state || {};

  return (
      <>
        {filter && <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>}
      </>
  )

}

export default React.memo(GlobalFilterSection);
