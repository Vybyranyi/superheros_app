import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Card from "./Card";

describe("Card component", () => {
  const defaultProps = {
    _id: "123",
    nickname: "Batman",
    images: ["/batman.png"],
  };

  it("renders nickname", () => {
    render(<Card {...defaultProps} />);
    expect(screen.getByText("Batman")).toBeInTheDocument();
  });

  it("sets alt attribute to nickname", () => {
    render(<Card {...defaultProps} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Batman");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Card {...defaultProps} onClick={handleClick} />);

    fireEvent.click(screen.getByText("Batman"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
