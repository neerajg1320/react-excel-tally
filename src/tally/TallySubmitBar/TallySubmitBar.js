import Button from "react-bootstrap/Button";
import ConditionalTooltipButton from "../TooltipButton/ConditionalTooltipButton";


const TallySubmitBar = ({title, disabled, onSubmit}) => {

  return (
      <div
          style={{
            height: "100%",
            backgroundColor: "white",
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
                disabled={disabled}
                onClick={e => {if (onSubmit) {onSubmit(e)}}}
            >
              {title}
            </Button>
          </ConditionalTooltipButton>
        </div>

      </div>
  )
}

export default TallySubmitBar;