import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect } from "vitest";
import ListPage from "./ListPage";

const mockDispatch = vi.fn();
const mockSelector = vi.fn();

vi.mock("@store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

vi.mock("@components/Card/Card", () => ({
  default: ({ nickname, onClick }: any) => (
    <div data-testid="card" onClick={onClick}>{nickname}</div>
  )
}));

vi.mock("@components/Button/Button", () => ({
  default: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  )
}));

vi.mock("@components/Modal/Modal", () => ({
  default: ({ isOpen, superheroId }: any) => (
    isOpen ? <div data-testid="modal">Modal for {superheroId}</div> : null
  )
}));

describe("ListPage component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'No superheroes found' if list is empty", () => {
    mockSelector.mockReturnValue({
      superheroesList: [],
      nextPageUrl: null,
      prevPageUrl: null,
      currentPage: 1,
      totalPages: 1,
      loading: false,
    });

    render(<ListPage />);
    expect(screen.getByText("No superheroes found")).toBeInTheDocument();
  });

  it("renders cards when superheroesList has items", () => {
    mockSelector.mockReturnValue({
      superheroesList: [{ _id: "1", nickname: "Batman", images: [] }],
      nextPageUrl: null,
      prevPageUrl: null,
      currentPage: 1,
      totalPages: 1,
      loading: false,
    });

    render(<ListPage />);
    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Batman");
  });

  it("opens modal when a card is clicked", () => {
    mockSelector.mockReturnValue({
      superheroesList: [{ _id: "1", nickname: "Batman", images: [] }],
      nextPageUrl: null,
      prevPageUrl: null,
      currentPage: 1,
      totalPages: 1,
      loading: false,
    });

    render(<ListPage />);
    fireEvent.click(screen.getByTestId("card"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveTextContent("Modal for 1");
  });

  it("disables pagination buttons correctly", () => {
    mockSelector.mockReturnValue({
      superheroesList: [{ _id: "1", nickname: "Batman", images: [] }],
      nextPageUrl: null,
      prevPageUrl: null,
      currentPage: 1,
      totalPages: 1,
      loading: false,
    });

    render(<ListPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toBeDisabled();
    expect(buttons[1]).toBeDisabled();
  });

});
