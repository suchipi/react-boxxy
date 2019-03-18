import React from "react";
import isValidAttr from "./isValidAttr";
import withProps from "./withProps";

const Box = React.forwardRef(({ tagName = "div", ...props }, ref) => {
  const attrs = {};
  const style = {};

  Object.keys(props).forEach((propName) => {
    const propValue = props[propName];
    const validity = isValidAttr(tagName, propName);
    if (validity === "valid") {
      attrs[propName] = propValue;
    } else if (validity === "invalid") {
      style[propName] = propValue;
    } else if (validity === "unknown") {
      attrs[propName] = propValue;
      style[propName] = propValue;
    }
  });

  const TagName = tagName;
  return (
    <TagName ref={ref} style={style} {...attrs} children={props.children} />
  );
});

Box.displayName = "Box";

Box.withProps = (addedProps) => {
  return withProps(Box, addedProps);
};

Box.default = Box;
module.exports = Box;
