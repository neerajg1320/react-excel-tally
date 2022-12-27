import {debug} from "../config/debugEnabled";
import {useContext, useEffect, useMemo, useRef} from "react";
import AppContext from "../../AppContext";

export const Mappers = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <Mappers>`);
  }

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<Mappers>: First render`);
    }

    return () => {
      if (debug.lifecycle) {
        console.log(`<Mappers>: Destroyed`);
      }
    }
  }, []);

  const {
    getMappers,
  } = useContext(AppContext);

  const mappers = useMemo(() => {
    return getMappers();
  });

  return (
    <div>
      Bank Mappers
      {mappers.map((mapper, index) => (
        <div key={index}>
          <h3>{mapper.name}</h3>
          <pre>{JSON.stringify(mapper, null, 2)}</pre>
        </div>
      ))}
    </div>
  )
}
