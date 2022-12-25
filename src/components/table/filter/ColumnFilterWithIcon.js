import {BiSearchAlt} from "react-icons/bi";
import {FaSearchPlus} from "react-icons/fa";
import {AiOutlineClose} from "react-icons/ai";
import {TiTick} from "react-icons/ti";
import ExpandableButton from "../../expandableButton/ExpandableButton";
import {useCallback, useEffect, useState} from "react";
import InputWithIcons from "./input-icons/InputWithIcons";

export const ColumnFilterWithIcon = ({ column }) => {
  const { filterValue, setFilter } = column;
  const [expanded, setExpanded] = useState(false);

  const [textEnabled, setTextEnabled] = useState(true);
  const [blankEnabled, setBlankEnabled] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [textFlags, setTextFlags] = useState({});

  useEffect(() => {
    // Check if we need state
    const filterObject = {
      flagBlank: blankEnabled,
      flagText: textEnabled,
      filterText,
      textFlags
    }
    setFilter(filterObject);
  }, [blankEnabled, textEnabled, filterText, textFlags]);

  const clearFilter = useCallback(() => {
    setExpanded(!expanded);
    setFilter(undefined);
  }, [expanded]);

  const searchIcon = (filterValue?.flagBlank ||
      (filterValue?.flagText && filterValue?.filterText)) ?
      <FaSearchPlus
          onClick={e => setExpanded(!expanded)}
          style={{cursor: "pointer"}}
      /> :
      <BiSearchAlt
          onClick={e => setExpanded(!expanded)}
          style={{cursor: "pointer"}}
      />;

  return (
      <>
      <ExpandableButton
          title="S"
          icon={searchIcon}
          value={expanded}
          onChange={e => setExpanded(!expanded)}
          popupPosition={column.index < 3 ?
              {top:"100%", left:"50%"}:
                  column.index < 6 ?
                  {top:"100%", transform: "translate(-50%, 0)"} :
                  {top:"100%", right:"50%"}
          }
      >
        <div style={{color:"black", display:"flex", flexDirection:"column", gap:"5px", alignItems: "start"}}>
          <div style={{width: "100%", color:"black", display:"flex", justifyContent: "space-between", gap: "10px"}}>
            <div
                style={{
                  color:"black",
                  display:"flex",
                  flexDirection:"row",
                  justifyContent: "start",
                  gap: "5px",
                  alignItems:"center"
                }}
            >
              <span style={{color:"black", fontSize:".8em", fontWeight: "normal" }}>
                {column.Header}
              </span>
              <BiSearchAlt  />
            </div>

            <div>
              <TiTick
                  style={{color:"green", fontSize: "1.3em", cursor:"pointer"}}
                  onClick={e => setExpanded(!expanded)}
              />
              <AiOutlineClose
                  onClick={e => clearFilter()}
                  style={{color:"red", cursor: "pointer"}}
              />
            </div>
          </div>

          <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between", gap:"10px"}}>
            <input type="checkbox"
                   defaultChecked={true}
                   onChange={e => {
                     setTextEnabled(e.target.checked);
                   }}
            />
            <InputWithIcons
                disabled={!textEnabled}
                defaultValue={{text: filterValue?.filterText, flags:filterValue?.textFlags }}
                onChange={({text, flags}) => {
                  // console.log(`text=${text} flags=${JSON.stringify(flags, null, 2)}`)
                  setFilterText(text);
                  setTextFlags(flags);
                }}
            />
          </div>

          <div style={{display:"flex", alignItems:"center", gap:"5px",
                       fontSize:"0.9em", fontWeight: "normal", marginTop: "5px"}}
          >
            <input type="checkbox"
                   onChange={e => {
                     setBlankEnabled(e.target.checked);
                   }}
            />
            <label>Blanks</label>
          </div>
        </div>
      </ExpandableButton>
      </>
  );
}