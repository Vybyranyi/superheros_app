import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Header from "./Header";
import { describe, expect, it } from "vitest";

describe("Header component", () => {
  function renderWithRouter(initialPath: string = "/") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/*" element={<Header />} />
        </Routes>
      </MemoryRouter>
    );
  }

  it("renders header title", () => {
    renderWithRouter();
    expect(screen.getByText(/Superhero App/i)).toBeInTheDocument();
  });

  it("renders both navigation buttons", () => {
    renderWithRouter();
    expect(screen.getByRole("button", { name: /Add new/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /List/i })).toBeInTheDocument();
  });

  it("highlights 'List' button when on '/' route", () => {
    renderWithRouter("/");
    const listButton = screen.getByRole("button", { name: /List/i });
    expect(listButton.className).toMatch(/primary/);
  });

  it("highlights 'Add new' button when on '/form' route", () => {
    renderWithRouter("/form");
    const addButton = screen.getByRole("button", { name: /Add new/i });
    expect(addButton.className).toMatch(/primary/);
  });

  it("navigates to '/form' when clicking 'Add new' button", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/form" element={<div>Form Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Add new/i }));
    expect(screen.getByText(/Form Page/i)).toBeInTheDocument();
  });

  it("navigates to '/' when clicking 'List' button", () => {
    render(
      <MemoryRouter initialEntries={["/form"]}>
        <Routes>
          <Route path="/form" element={<Header />} />
          <Route path="/" element={<div>List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /List/i }));
    expect(screen.getByText(/List Page/i)).toBeInTheDocument();
  });
});
