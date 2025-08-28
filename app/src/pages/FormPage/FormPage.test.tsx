import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import FormPage from "./FormPage";

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockSelector = vi.fn();

vi.mock("@store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: any) => mockSelector(selector),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@components/ImageManager/ImageManager", () => ({
  default: ({ label, error, setNewFiles, setImagesToRemove }: any) => (
    <div data-testid="image-manager">
      <label>{label}</label>
      {error && <span data-testid="image-error">{error}</span>}
      <input
        type="file"
        data-testid="file-input"
        multiple
        onChange={(e) => {
          if (e.target.files) {
            setNewFiles(Array.from(e.target.files));
          }
        }}
      />
      <button 
        data-testid="remove-image"
        onClick={() => setImagesToRemove(["image1.jpg"])}
      >
        Remove Image
      </button>
    </div>
  ),
}));

describe("FormPage component", () => {
  const defaultState = {
    loading: false,
    error: null,
    superheroToEdit: null,
  };

  const superheroToEdit = {
    _id: "123",
    nickname: "Batman",
    real_name: "Bruce Wayne",
    origin_description: "Witnessed parents murder, became vigilante",
    superpowers: ["martial arts", "detective skills", "gadgets"],
    catch_phrase: "I am vengeance",
    images: ["batman1.jpg", "batman2.jpg"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter(initialPath: string = "/form") {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <FormPage />
      </MemoryRouter>
    );
  }

  describe("Edit Mode", () => {
    beforeEach(() => {
      mockSelector.mockReturnValue({
        ...defaultState,
        superheroToEdit,
      });
    });

    it("renders edit form with populated fields", () => {
      renderWithRouter();
      
      expect(screen.getByText("Edit Superhero")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Batman")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Bruce Wayne")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Witnessed parents murder, became vigilante")).toBeInTheDocument();
      expect(screen.getByDisplayValue("martial arts, detective skills, gadgets")).toBeInTheDocument();
      expect(screen.getByDisplayValue("I am vengeance")).toBeInTheDocument();
    });

    it("shows update button instead of create button", () => {
      renderWithRouter();
      
      expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /Create/i })).not.toBeInTheDocument();
    });

    it("enables submit button even without changes if images exist", () => {
      renderWithRouter();
      
      const submitButton = screen.getByRole("button", { name: /Update/i });
      expect(submitButton).not.toBeDisabled();
    });

    it("navigates to home after successful update", async () => {
      renderWithRouter();
      
      const submitButton = screen.getByRole("button", { name: /Update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it("clears superheroToEdit after update", async () => {
      renderWithRouter();
      
      const submitButton = screen.getByRole("button", { name: /Update/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining("setSuperheroToEdit")
          })
        );
      });
    });
  });
});