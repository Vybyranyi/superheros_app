import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Input from "./Input";

describe("Input component", () => {
  const defaultProps = {
    label: "Username",
    placeholder: "Enter your name",
  };

  it("renders label and placeholder", () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(<Input {...defaultProps} onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(input, { target: { value: "John" } });

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0].target.value).toBe("John");
  });

  it("calls onBlur when input loses focus", () => {
    const handleBlur = vi.fn();
    render(<Input {...defaultProps} onBlur={handleBlur} />);

    const input = screen.getByPlaceholderText("Enter your name");
    fireEvent.blur(input);

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("shows clear icon when value is provided", () => {
    render(<Input {...defaultProps} value="Batman" />);
    const clearIcon = screen.getByRole("img", { name: /Clear input/i });
    expect(clearIcon).toBeInTheDocument();
  });

  it("clears value when clicking clear icon", () => {
    const handleChange = vi.fn();
    render(<Input {...defaultProps} value="Batman" onChange={handleChange} />);

    const clearIcon = screen.getByRole("img", { name: /Clear input/i });
    fireEvent.click(clearIcon);

    expect(handleChange).toHaveBeenCalled();
  });

  it("shows error message when error prop is passed", () => {
    render(<Input {...defaultProps} error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error class when error exists", () => {
    render(<Input {...defaultProps} error="Invalid value" />);
    const input = screen.getByPlaceholderText("Enter your name");
    expect(input.className).toMatch(/error/);
  });
});
