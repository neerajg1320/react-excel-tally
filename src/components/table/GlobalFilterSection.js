import React, {useContext} from "react";
import TableDataContext from "./TableDataContext";
import {GlobalFilter} from "./filter/GlobalFilter";

const GlobalFilterSection = () => {
  const {rTable} = useContext(TableDataContext);
  const {state, setGlobalFilter} = rTable;
  const {globalFilter} = state;

  return (
      <>
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter}/>
      </>
  )

}

export default GlobalFilterSection;
