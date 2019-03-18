import React from "react";
import { render, cleanup, fireEvent } from "react-testing-library";
import Box from "..";

describe("Box", () => {
  afterEach(cleanup);

  describe("tagName", () => {
    it("renders a div by default", () => {
      const { container } = render(<Box />);
      expect(container.innerHTML).toMatchInlineSnapshot(`"<div></div>"`);
    });

    it("can also render whatever tagName you specify", () => {
      const { container } = render(<Box tagName="span" />);
      expect(container.innerHTML).toMatchInlineSnapshot(`"<span></span>"`);
    });
  });

  describe("children", () => {
    it("renders children", () => {
      const { container } = render(
        <Box>
          <span id="child" />
        </Box>
      );
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div><span id=\\"child\\"></span></div>"`
      );
    });
  });

  describe("received props", () => {
    it("puts styles into styles and html attrs into html attrs", () => {
      const { container } = render(
        <Box display="flex" flexDirection="column" className="jeff" id="bob" />
      );
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div style=\\"display: flex; flex-direction: column;\\" class=\\"jeff\\" id=\\"bob\\"></div>"`
      );
    });

    it("handles aria attrs correctly", () => {
      const { container } = render(<Box role="button" aria-expanded />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div role=\\"button\\" aria-expanded=\\"true\\"></div>"`
      );
    });

    it("handles data attrs correctly", () => {
      const { container } = render(<Box data-foo="yo" />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<div data-foo=\\"yo\\"></div>"`
      );
    });

    it("spreads props to both locations for custom elements", () => {
      const { container } = render(<Box tagName="x-foo" display="flex" />);
      expect(container.innerHTML).toMatchInlineSnapshot(
        `"<x-foo style=\\"display: flex;\\" display=\\"flex\\"></x-foo>"`
      );
    });
  });

  describe("event handler props", () => {
    it("binds them properly", () => {
      const clickHandler = jest.fn((event) => {
        expect(event).not.toBe(undefined);
      });
      const { getByText } = render(<Box onClick={clickHandler}>Click me</Box>);
      fireEvent.click(getByText("Click me"));
      expect(clickHandler).toHaveBeenCalled();
    });
  });

  describe("refs", () => {
    it("forwards to the dom element", () => {
      let mounted = false;
      const refHandler = jest.fn((el) => {
        if (mounted) {
          expect(el).toBe(null);
        } else {
          expect(el instanceof HTMLDivElement).toBe(true);
          mounted = true;
        }
      });
      render(<Box ref={refHandler} />);
      expect(refHandler).toHaveBeenCalled();
    });
  });
});
