import Button from "react-bootstrap/Button";
import ConditionalTooltipButton from "../TooltipButton/ConditionalTooltipButton";
import {useCallback, useEffect} from "react";
import {DateToStringDate} from "../../utils/date";
import {useDispatch, useSelector} from "react-redux";
import {exportJsonToExcel} from "../../components/excel/xlsx/excel";

const TallySubmitBar = () => {
  const dispatch = useDispatch();
  const tallyStatus = useSelector((state) => state.tally.status);
  const tallyTargetCompany = useSelector((state) => state.tally.targetCompany);
  const columns = useSelector(state => state.columns);
  const rows = useSelector(state => state.rows);
  // const currentBank = useSelector(state => state.banks.current);
  const currentBank='None';

  const handleAddCategoryClick = useCallback((columns) => {
    // console.log(`Need to add a new column`);
    const tableCategoryColumn = columns.filter(col => col.key === "Category");

    if (tableCategoryColumn.length < 1) {
      // const categoryColumn = presetColumns.filter(col => col.key === 'Category');
      // if (categoryColumn.length) {
      //   const categoryRTColumn = colToRTCol(categoryColumn[0]);
      //   dispatch(addColumn(categoryRTColumn));
      // }
    } else {
      alert("Category is already present");
    }

  }, []);

  const handleSubmitClick = useCallback((data, company, bank) => {
    const tData = data.map(item => {return {
      ...item,
      ["Transaction Date"]: DateToStringDate(item["Transaction Date"]),
      ["Value Date"]: DateToStringDate(item["Value Date"])
    }});

    // dispatch(addVouchers(tData, company, bank));
  }, []);

  const handleSaveClick = useCallback((e) => {
    const header = columns.map(col => col.label).filter(col => !!col);

    const data = rows.map(row => {
      const rowCopy = {...row};
      delete rowCopy.id;
      return rowCopy;
    });
    exportJsonToExcel(data, "file.xlsx", header);
  }, [rows, columns]);

  return (
      <div
          style={{
            height: "100%",
            backgroundColor: "white",
            boxShadow: "0 0 3px rgba(0,0,0,0.2)",
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"
          }}
      >
        <div
            style={{
              width: "90%",
              // border: "1px dashed blue",
              display: "flex", justifyContent:"flex-end", alignItems:"center", gap:"60px"
            }}
        >
          <div
              style={{
                display: "flex", flexDirection: "row", gap:"20px"
              }}
          >
            <Button
                className="btn-outline-primary bg-transparent"
                size="sm"
                onClick={handleSaveClick}
            >
              Save Table
            </Button>

            <Button
                className="btn-outline-primary bg-transparent"
                size="sm"
                onClick={e => handleAddCategoryClick(columns)}
            >
              Add Category
            </Button>
          </div>

          <ConditionalTooltipButton
              condition={!tallyStatus} message="No connection to Tally"
          >
            <Button onClick={e => handleSubmitClick(rows, tallyTargetCompany, currentBank)}>
              Submit To Tally
            </Button>
          </ConditionalTooltipButton>
        </div>

      </div>
  )
}

export default TallySubmitBar;