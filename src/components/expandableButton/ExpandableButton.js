import React from "react";
import Button from "react-bootstrap/Button";

// Currently its a controlled component
const ExpandableButton = ({ children, title, icon, disabled, value, onChange, popupPosition}) => {
  // console.log(`Rendering <ExpandableButton> value=${value}`);

  // The followed function can be use when we need to inject or remove props in child
  const childrenWithProps =  React.Children.map(children, child => {
    // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
    // avoids typescript error as well
    if (React.isValidElement(child)) {
      return React.cloneElement(child);
    }
    return child;
  });

  return (
      <div style={{
        display:"flex",
        flexDirection:"column",
        position: "relative"
      }}>
        {icon}

        {!icon &&
          <Button variant="primary" size="sm"
                  disabled={disabled}
                  onClick={e => onChange(!value)}
          >
            {title}
          </Button>
        }

        {value &&
            <div
                style={{
                  padding:"20px",
                  display: "flex",
                  flexDirection:"column",
                  gap:"15px",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 5px 15px",
                  borderRadius: "4px",
                  position: "absolute",
                  backgroundColor: "white",
                  zIndex: "1",
                  ...{...popupPosition}
                }}
            >
              {childrenWithProps}
            </div>
        }
      </div>
  );
}

export default ExpandableButton;
