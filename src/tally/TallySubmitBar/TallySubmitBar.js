import Button from "react-bootstrap/Button";
import ConditionalTooltipButton from "../TooltipButton/ConditionalTooltipButton";
import {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";


const TallySubmitBar = ({data}) => {
  const dispatch = useDispatch();
  const tallyStatus = useSelector((state) => state.tally.status);
  const tallyTargetCompany = useSelector((state) => state.tally.targetCompany);
  const tallyLedgers = useSelector((state) => state.tally.ledgers);
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

  const handleSubmitClick = useCallback((data) => {

  }, []);

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

          <ConditionalTooltipButton
              condition={!tallyStatus} message="No connection to Tally"
          >
            <Button
                disabled={false}
                onClick={e => handleSubmitClick(data)}
            >
              Submit To Tally
            </Button>
          </ConditionalTooltipButton>
        </div>

      </div>
  )
}

export default TallySubmitBar;