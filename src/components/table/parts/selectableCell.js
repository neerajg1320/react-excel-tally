import {useCallback, useEffect, useState} from "react";
import Select from "react-select";

// https://cloudnweb.dev/2020/08/how-to-build-an-actionable-data-table-with-react-table-and-tailwindcss/
const SelectableCell = ({value: initialValue, row, column, updateMyData, choices}) => {
  const [value, setValue] = useState(initialValue || "");
  const [options, setOptions] = useState([]);

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    if (initialValue) {
      // console.log(`initialValue=${initialValue}`);
      setValue(initialValue);
    }
  }, [initialValue]);
  
  useEffect(() => {
    const options = choices.map(choice => {
      return {label: choice, value:choice}
    })
    setOptions(options)
  }, [choices]);

  const handleSelect = useCallback((opt) => {
    // console.log(opt.value);
    setValue(opt.value);
    updateMyData(row, column, opt.value);
  }, []);

  return (
    <>
      <Select
          options={choices.map(choice => {
            return {label: choice, value:choice}
          })}
          value = {options.filter(opt => opt.label === value)}
          onChange={handleSelect}
      />
    </>
  );
}

export default SelectableCell;
