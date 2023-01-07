import {debug} from "../components/config/debugEnabled";
import React,{useEffect} from "react";

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

  return (
    <>
      CF
    </>

  );
}

export default React.memo(ColumnsFilterSection);