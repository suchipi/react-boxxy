import React from "react";

// This is an object type whose keys are tagName strings and whose values are element classes;
// If written by hand, it'd be like: { div: HTMLDivElement, g: SVGGElement, ...and so forth }
type ElementTagNameMap = HTMLElementTagNameMap &
  HTMLElementDeprecatedTagNameMap &
  Omit<
    // When there's name conflicts, we assume HTML instead of SVG (because that's probably what the user wants). Sorry, SVGAElement
    SVGElementTagNameMap,
    keyof (HTMLElementTagNameMap & HTMLElementDeprecatedTagNameMap)
  >;

// withProps function that is aware of the underlying react-boxxy element type.
type WithPropsForBoxxy<
  Tag extends keyof ElementTagNameMap,
  CustomProps extends {} = {}
> = {
  <AddedProps extends BoxxyProps<Tag> & CustomProps>(
    addedProps: AddedProps
  ): AddedProps extends { tagName: keyof ElementTagNameMap }
    ? BoxxyComponent<AddedProps["tagName"], CustomProps>
    : BoxxyComponent<Tag, CustomProps>;

  <
    InputProps extends {},
    OutputProps extends BoxxyProps<keyof ElementTagNameMap> & CustomProps
  >(
    config: (receivedProps: InputProps) => OutputProps
  ): InputProps extends BoxxyProps<keyof ElementTagNameMap>
    ? OutputProps extends { tagName: keyof ElementTagNameMap }
      ? BoxxyComponent<
          OutputProps["tagName"],
          Omit<InputProps, keyof BoxxyProps<OutputProps["tagName"]>> &
            CustomProps
        >
      : InputProps extends BoxxyProps<Tag>
      ? BoxxyComponent<
          Tag,
          Omit<InputProps, keyof BoxxyProps<Tag>> & CustomProps
        >
      : React.FunctionComponent<InputProps> & {
          withProps: WithPropsGeneric<InputProps>;
        }
    : React.FunctionComponent<InputProps> & {
        withProps: WithPropsGeneric<InputProps>;
      };
};

// withProps function for generic react component functions.
type WithPropsGeneric<Props extends {}> = {
  (addedProps: Props): React.FunctionComponent<Props> & {
    withProps: WithPropsGeneric<Props>;
  };
  <NewProps extends {}>(
    addedProps: (newProps: NewProps) => Props
  ): React.FunctionComponent<NewProps> & {
    withProps: WithPropsGeneric<NewProps>;
  };
};

/**
 * The props that are allowed on a Boxxy component that will render an element with the provided Tag as its tagName.
 *
 * For example, BoxxyProps<"div"> describes the props that are allowed to appear on a Boxxy component that eventually renders a div.
 * The reason you have to specify a Tag is because different props are allowed on different elements; for instance, an input element
 * can have a "type" property (like <input type="checkbox" />), but a div element cannot.
 */
export type BoxxyProps<Tag extends keyof ElementTagNameMap> = {
  tagName?: keyof ElementTagNameMap;
  ref?: React.Ref<ElementTagNameMap[Tag]>;
} & React.CSSProperties &
  (ElementTagNameMap[Tag] extends HTMLElement
    ? React.HTMLProps<ElementTagNameMap[Tag]>
    : ElementTagNameMap[Tag] extends SVGElement
    ? React.SVGProps<ElementTagNameMap[Tag]>
    : {});

/**
 * The component function for a component created by react-boxxy.
 *
 * See also BoxxyProps, which is the props for this function.
 */
export type BoxxyComponent<
  Tag extends keyof ElementTagNameMap,
  CustomProps extends {} = {}
> = ((props: BoxxyProps<Tag> & CustomProps) => JSX.Element) & {
  displayName?: string;
  withProps: WithPropsForBoxxy<Tag, CustomProps>;
};

declare const Box: BoxxyComponent<"div">;
export default Box;
