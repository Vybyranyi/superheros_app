import { render, screen, fireEvent, } from "@testing-library/react";
import Button from "./Button";
import { describe, it, expect, vi,  } from "vitest";

describe("Button component", () => {
  it("renders with children text", () => {
    render(<Button type="button">Click me</Button>);
    expect(screen.getByRole("button", { name: /Click me/i })).toBeInTheDocument();
  });

  it("applies type correctly", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button type="button" onClick={handleClick}>Press</Button>);
    
    fireEvent.click(screen.getByRole("button", { name: /Press/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button type="button" disabled onClick={handleClick}>Disabled</Button>);
    
    fireEvent.click(screen.getByRole("button", { name: /Disabled/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has disabled attribute when disabled is true", () => {
    render(<Button type="reset" disabled>Reset</Button>);
    const btn = screen.getByRole("button", { name: /Reset/i });

    expect(btn).toBeDisabled();
    expect(btn.className).toMatch(/disabled/);
  });
});
