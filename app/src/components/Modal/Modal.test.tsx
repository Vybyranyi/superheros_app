import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router";
import Modal from "./Modal";

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
const mockSelector = vi.fn();

// Mock the hooks
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

// Mock environment variable
vi.mock("meta", () => ({
  env: {
    VITE_API_URL: "http://localhost:3000",
  },
}));

// Add to global scope for the component
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_URL: "http://localhost:3000",
  },
});

describe("Modal component", () => {
  const mockSuperhero = {
    _id: "123",
    nickname: "Batman",
    real_name: "Bruce Wayne",
    origin_description: "Witnessed his parents' murder as a child, which led him to train himself to physical and intellectual perfection and don a bat-themed costume to fight crime in Gotham City.",
    superpowers: ["martial arts", "detective skills", "advanced technology", "wealth"],
    catch_phrase: "I am vengeance, I am the night, I am Batman!",
    images: ["batman1.jpg", "batman2.jpg", "batman3.jpg"],
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-02"),
  };

  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    superheroId: "123",
  };

  const defaultState = {
    currentSuperhero: mockSuperhero,
    loading: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter(props = defaultProps) {
    return render(
      <MemoryRouter>
        <Modal {...props} />
      </MemoryRouter>
    );
  }

  describe("Modal Visibility", () => {
    it("does not render when isOpen is false", () => {
      mockSelector.mockReturnValue(defaultState);
      
      renderWithRouter({ ...defaultProps, isOpen: false });
      
      expect(screen.queryByText("Superhero Details")).not.toBeInTheDocument();
    });

    it("renders when isOpen is true", () => {
      mockSelector.mockReturnValue(defaultState);
      
      renderWithRouter();
      
      expect(screen.getByText("Superhero Details")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading message when loading", () => {
      mockSelector.mockReturnValue({
        currentSuperhero: null,
        loading: true,
      });
      
      renderWithRouter();
      
      expect(screen.getByText("Loading...")).toBeInTheDocument();
      expect(screen.getByText("Loading superhero details...")).toBeInTheDocument();
    });

    it("does not show action buttons when loading", () => {
      mockSelector.mockReturnValue({
        currentSuperhero: null,
        loading: true,
      });
      
      renderWithRouter();
      
      expect(screen.queryByAltText("edit")).not.toBeInTheDocument();
      expect(screen.queryByAltText("delete")).not.toBeInTheDocument();
    });
  });

  describe("Superhero Data Display", () => {
    beforeEach(() => {
      mockSelector.mockReturnValue(defaultState);
    });

    it("displays superhero nickname", () => {
      renderWithRouter();
      
      expect(screen.getByText("Batman")).toBeInTheDocument();
    });

    it("displays superhero real name", () => {
      renderWithRouter();
      
      expect(screen.getByText("Bruce Wayne")).toBeInTheDocument();
    });

    it("displays origin description", () => {
      renderWithRouter();
      
      expect(screen.getByText(mockSuperhero.origin_description)).toBeInTheDocument();
    });

    it("displays catch phrase with quotes", () => {
      renderWithRouter();
      
      expect(screen.getByText(`"${mockSuperhero.catch_phrase}"`)).toBeInTheDocument();
    });

    it("displays all superpowers as tags", () => {
      renderWithRouter();
      
      mockSuperhero.superpowers.forEach(power => {
        expect(screen.getByText(power)).toBeInTheDocument();
      });
    });

    it("displays main image with correct src", () => {
      renderWithRouter();
      
      const mainImage = screen.getByAltText("Batman") as HTMLImageElement;
      expect(mainImage).toBeInTheDocument();
      expect(mainImage.src).toContain("batman1.jpg");
    });

    it("displays thumbnails when multiple images exist", () => {
      renderWithRouter();
      
      const thumbnails = screen.getAllByRole("img").slice(1, -3);
      expect(thumbnails.length).toBeGreaterThan(1);
    });

    it("changes main image when thumbnail is clicked", async () => {
      renderWithRouter();
      
      const thumbnails = screen.getAllByRole("img").slice(1, -3);
      if (thumbnails.length > 1) {
        fireEvent.click(thumbnails[1]);
        
        await waitFor(() => {
          const mainImage = screen.getByAltText("Batman") as HTMLImageElement;
          expect(mainImage.src).toContain("http://localhost:3000batman1.jpg");
        });
      }
    });
  });

  describe("Modal Actions", () => {
    beforeEach(() => {
      mockSelector.mockReturnValue(defaultState);
    });

    it("renders all action buttons", () => {
      renderWithRouter();
      
      expect(screen.getByAltText("edit")).toBeInTheDocument();
      expect(screen.getByAltText("delete")).toBeInTheDocument();
      expect(screen.getByAltText("Close")).toBeInTheDocument();
    });

    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();
      renderWithRouter({ ...defaultProps, onClose });
      
      fireEvent.click(screen.getByAltText("Close"));
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls edit action and navigates to form page", async () => {
      renderWithRouter();
      
      fireEvent.click(screen.getByAltText("edit"));
      
      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining("setSuperheroToEdit")
          })
        );
        expect(mockNavigate).toHaveBeenCalledWith('/form');
        expect(defaultProps.onClose).toHaveBeenCalled();
      });
    });
  });

  describe("Error States", () => {
    it("shows 'not found' message when superhero is null and not loading", () => {
      mockSelector.mockReturnValue({
        currentSuperhero: null,
        loading: false,
      });
      
      renderWithRouter();
      
      expect(screen.getByText("Superhero not found")).toBeInTheDocument();
    });

    it("does not show action buttons when superhero is not found", () => {
      mockSelector.mockReturnValue({
        currentSuperhero: null,
        loading: false,
      });
      
      renderWithRouter();
      
      expect(screen.queryByAltText("edit")).not.toBeInTheDocument();
      expect(screen.queryByAltText("delete")).not.toBeInTheDocument();
    });
  });
});