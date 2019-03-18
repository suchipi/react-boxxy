# `react-boxxy`

An extendable base component for React DOM.

## Features

- Mix styles and HTML attributes as top-level props
- Choose a tagName other than `div` with the `tagName` prop
- Forwards refs
- Create specialized components with default/custom props

## Example Usage

<!-- prettier-ignore -->
```js
import Box from "react-boxxy";

<Box
  // You can put HTML attributes here...
  id="app"
  className="some-class"
  // Or styles...
  display="flex"
  flexDirection="row"
>
  <Box
    // Or React DOM event handlers
    onClick={() => alert("clicked!")}
  >
    Click me!
  </Box>
</Box>

// You can create a Box with defaults using the `withProps` function:
const Column = Box.withProps({
  display: "flex",
  flexDirection: "column",
});

// `Column` is a component...
<Column>
  <Box>Hi</Box>
</Column>
// The above is the same as:
<Box
  display="flex"
  flexDirection="column"
>
  <Box>Hi</Box>
</Box>

// If you have more specific needs or want to use custom props, you can pass a function to `withProps`:
const Switch = Box.withProps((props) => {
  ...props,
  tagName: "input",
  type: "checkbox",
  checked: props.on,
});

// You can specialize a component returned from `withProps` further:
const FancySwitch = Switch.withProps({
  backgroundColor: "red",
  color: "green"
});
```

## API Documentation

### `Box`

A component that renders an HTML (or SVG) element, and spreads the props it receives into the HTML element's attributes or styles, based on the key name.

### Accepted Props:

- `tagName` - Change which DOM element is rendered. Defaults to `"div"`.
- Any valid React HTML/SVG attribute name (eg `id`, `className`, etc).
- Any valid `camelCase` CSS style name (eg `display`, `marginTop`, etc).

`Box` forwards its ref to the DOM element it renders.

### `Box.withProps`

`Box.withProps` returns a component that renders a Box with the specified props. You can call it with either an `Object` or a `Function`.

If you call `Box.withProps` with an `Object`, the entries in that object will be used as the default props for the `Box`. Users can still override these defaults by specifying the props manually.

```js
const Column = Box.withProps({
  display: "flex",
  flexDirection: "column",
});
```

If you call `Box.withProps` with a `Function`, that function will be called whenever the component renders. It will receive the props that component is being rendered with, and its return value will be spread onto the `Box` rendered by the component.

```js
const Column = Box.withProps((props) => {
  return {
    display: "flex",
    flexDirection: "column",
  };
});
```

Unlike the `Object` form, the `Function` form does not allow users to override the props you provide unless you handle this manually. With Object spread, that looks like this:

```js
const Column = Box.withProps((props) => {
  return {
    display: "flex",
    flexDirection: "column",
    ...props,
  };
});
```

Or, if you want to make your entries always take precedence over the user's (but still allow arbitrary value to be provided for other entries), spread before your entries:

```js
const Column = Box.withProps((props) => {
  return {
    ...props,
    display: "flex",
    flexDirection: "column",
  };
});
```

The function form is also useful for translating custom props to DOM attributes and styles. For example, here is a `Toggler` component designed to receive a boolean `on` prop that dictates its background color:

```js
const Toggler = Box.withProps(({ on, ...otherProps }) => {
  return {
    ...otherProps,
    backgroundColor: on ? "green" : "red",
  };
});
```

The above example avoids passing the `on` down to the underlying `Box`, but since `Box` will filter out non-DOM attributes internally, this isn't necessary:

```js
const Toggler = Box.withProps((props) => {
  return {
    ...props,
    backgroundColor: props.on ? "green" : "red",
  };
});
```

The returned component from `withProps` also has a `withProps` function on it that behaves the same as `Box.withProps`, which you can use if you want to specialize a component further:

```js
const Flex = Box.withProps({
  display: "flex",
});

const Column = Flex.withProps({
  flexDirection: "column",
});

const Row = Flex.withProps({
  flexDirection: "row",
});
```

> **Side Note**: Internally, the `Object` form of `withProps` uses `Object.assign`, so the following two code blocks are equivalent:
>
> ```js
> const Column = Box.withProps({
>   display: "flex",
>   flexDirection: "column",
> });
> ```
>
> ```js
> const Column = Box.withProps((props) => {
>   return Object.assign(
>     {},
>     {
>       display: "flex",
>       flexDirection: "column",
>     },
>     props
>   );
> });
> ```

## License

MIT
