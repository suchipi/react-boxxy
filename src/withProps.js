import React from "react";

export default function withProps(TargetComponent, addedProps) {
  const mapProps =
    typeof addedProps === "function"
      ? addedProps
      : (receivedProps) => Object.assign({}, addedProps, receivedProps);

  const NewComponent = React.forwardRef((receivedProps, ref) => {
    const props = mapProps(receivedProps);
    return <TargetComponent {...props} ref={ref} />;
  });

  NewComponent.withProps = (addedProps) => {
    return withProps(NewComponent, addedProps);
  };

  return NewComponent;
}
