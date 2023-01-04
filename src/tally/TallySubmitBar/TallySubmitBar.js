import Button from "react-bootstrap/Button";
import ConditionalTooltipButton from "../TooltipButton/ConditionalTooltipButton";
import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {addVouchers} from "../state/actionCreators";


const TallySubmitBar = ({data, bank, targetCompany, disabled}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(`TallySubmitBar: tallyTargetCompany:${targetCompany}`);
  }, [targetCompany]);

  const handleSubmitClick = useCallback((data, bank, targetCompany) => {
    console.log(`handleSubmitClick: data=${JSON.stringify(data, null, 2)}`);
    dispatch(addVouchers(data, targetCompany, bank))
  }, []);

  return (
      <div
          style={{
            height: "100%",
            backgroundColor: "white",
            // boxShadow: "0 0 3px rgba(0,0,0,0.2)",
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
              condition={disabled} message="No connection to Tally"
          >
            <Button
                disabled={false}
                onClick={e => handleSubmitClick(data, bank, targetCompany)}
            >
              Submit To Tally
            </Button>
          </ConditionalTooltipButton>
        </div>

      </div>
  )
}

export default TallySubmitBar;