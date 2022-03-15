import React from "react";
import { render, cleanup } from "@testing-library/react";
import Box from "..";

describe("Box.withProps", () => {
  afterEach(cleanup);

  describe("object form", () => {
    it("adds those props to the box as defaults", () => {
      const Article = Box.withProps({
        tagName: "article",
        display: "flex",
        flexDirection: "column",
        padding: "4px",
      });
      const { container } = render(<Article />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<article style=\\"display: flex; flex-direction: column; padding: 4px;\\"></article>"`
      );
    });

    it("user-specified props override defaults", () => {
      const Article = Box.withProps({
        tagName: "article",
        display: "flex",
        flexDirection: "column",
        padding: "4px",
      });
      const { container } = render(<Article padding="8px" />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<article style=\\"display: flex; flex-direction: column; padding: 8px;\\"></article>"`
      );
    });

    it("has a withProps that allows further specification", () => {
      const One = Box.withProps({ backgroundColor: "red" });
      const Two = One.withProps({ color: "green" });
      const { container } = render(<Two />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div style=\\"background-color: red; color: green;\\"></div>"`
      );
    });
  });

  describe("function form", () => {
    it("calls the function on render with the received props and spread the return value onto a Box", () => {
      const Toggler = Box.withProps((props) => ({
        ...props,
        backgroundColor: props.on ? "green" : "red",
      }));
      const { container } = render(<Toggler />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div style=\\"background-color: red;\\"></div>"`
      );
      const { container: container2 } = render(<Toggler on />);
      expect(container2.innerHTML).toMatchInlineSnapshot(
        `"<div style=\\"background-color: green;\\"></div>"`
      );
    });

    it("does not spread anything on its own; it leaves that up to the user", () => {
      const Useless = Box.withProps((props) => ({}));
      const { container } = render(<Useless tagName="span" className="yo" />);
      expect(container.innerHTML).toMatchInlineSnapshot(`"<div></div>"`);
    });

    it("has a withProps that allows further specification", () => {
      const One = Box.withProps((props) => ({
        ...props,
        backgroundColor: "red",
      }));
      const Two = One.withProps((props) => ({ ...props, color: "green" }));
      const { container } = render(<Two />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div style=\\"color: green; background-color: red;\\"></div>"`
      );
    });
  });
});
