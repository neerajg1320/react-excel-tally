import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";

function ConditionalTooltipButton({children, condition, message}) {
  return (
    <OverlayTrigger
        delay={{hide: 450, show: 300}}
        overlay={condition ? (props) => (
            <Tooltip {...props}>
              {message}
            </Tooltip>
        ) : (
            <span></span>
        )
        }
        placement="bottom"
    >
      {children}
    </OverlayTrigger>
  );
}

export default ConditionalTooltipButton;