import React from "react";
import isValidAttr from "./isValidAttr";
import withProps from "./withProps";

const Box = React.forwardRef(({ tagName = "div", ...props }, ref) => {
  const attrs = {};
  const style = {};

  Object.keys(props).forEach((propName) => {
    const propValue = props[propName];
    if (isValidAttr(tagName, propName)) {
      attrs[propName] = propValue;
    } else {
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
