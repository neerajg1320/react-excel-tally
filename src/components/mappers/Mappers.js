import {debug} from "../config/debug";
import {useEffect, useRef} from "react";

export const Mappers = () => {
  if (debug.lifecycle) {
    console.log(`Rendering <Mappers>`);
  }

  const mapperLoadCountRef = useRef(0);

  useEffect(() => {
    if (debug.lifecycle) {
      console.log(`<Mappers>: First render`);
    }

    // Register the Bank mappers after one second
    setTimeout(() => {
      console.log(`Registering the bank mappers`);
      mapperLoadCountRef.current += 1;
      if (mapperLoadCountRef.current > 1) {
        throw `Mappers loaded more than once`;
      }
    }, 1000);

    return () => {
      if (debug.lifecycle) {
        console.log(`<Mappers>: Destroyed`);
      }
    }
  }, []);

  return (
    <div>
      Bank Mappers
    </div>
  )
}
