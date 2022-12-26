import Tooltip from "react-bootstrap/Tooltip";
import {OverlayTrigger} from "react-bootstrap";
import React from "react";

const TooltipComponent = ({children, message}) => {
  const renderTooltip = (props) => {
    return (<Tooltip {...props}>{message}</Tooltip>);
  }

  return (
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        {children}
      </OverlayTrigger>
  )
}

export default React.memo(TooltipComponent);
