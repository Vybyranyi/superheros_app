import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "./Footer";

describe("Footer component", () => {
  it("renders footer element", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  it("displays correct headings", () => {
    render(<Footer />);
    expect(screen.getByText("Special for JavaScript Ninjas")).toBeInTheDocument();
    expect(screen.getByText("By Marian Vybyranyi")).toBeInTheDocument();
    expect(screen.getByText("© 2025 Superhero App")).toBeInTheDocument();
  });
});
