import { render, screen, fireEvent } from "@testing-library/react";
import ImageManager from "./ImageManager";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mockSetNewFiles = vi.fn();
const mockSetImagesToRemove = vi.fn();

describe("ImageManager", () => {
    beforeAll(() => {
        global.URL.createObjectURL = vi.fn(() => "blob:mock-url") as any;
        global.URL.revokeObjectURL = vi.fn();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders label", () => {
        render(
            <ImageManager
                existingImages={[]}
                newFiles={[]}
                setNewFiles={mockSetNewFiles}
                imagesToRemove={[]}
                setImagesToRemove={mockSetImagesToRemove}
                label="Profile images"
            />
        );

        expect(screen.getByText("Profile images")).toBeInTheDocument();
    });

    it("renders existing images and allows removing them", () => {
        render(
            <ImageManager
                existingImages={["/img1.png"]}
                newFiles={[]}
                setNewFiles={mockSetNewFiles}
                imagesToRemove={[]}
                setImagesToRemove={mockSetImagesToRemove}
            />
        );

        const existingImg = screen.getByAltText("Image 1") as HTMLImageElement;
        expect(existingImg.src).toContain("/img1.png");

        const removeBtn = screen.getByRole("button");
        fireEvent.click(removeBtn);

        expect(mockSetImagesToRemove).toHaveBeenCalledWith(["/img1.png"]);
    });

    it("renders new files and allows removing them", () => {
        const file = new File(["dummy"], "test.png", { type: "image/png" });

        render(
            <ImageManager
                existingImages={[]}
                newFiles={[file]}
                setNewFiles={mockSetNewFiles}
                imagesToRemove={[]}
                setImagesToRemove={mockSetImagesToRemove}
            />
        );

        const preview = screen.getByAltText("test.png") as HTMLImageElement;
        expect(preview.src).toBe("blob:mock-url");

        const removeBtn = screen.getByRole("button");
        fireEvent.click(removeBtn);

        expect(mockSetNewFiles).toHaveBeenCalledWith([]);
    });

    it("calls setNewFiles with selected files", () => {
    const setNewFiles = vi.fn(); 
    const setImagesToRemove = vi.fn(); 

    const { getByTestId } = render(
      <ImageManager
        label="Upload"
        newFiles={[]}
        existingImages={[]}
        setNewFiles={setNewFiles}
        imagesToRemove={[]}
        setImagesToRemove={setImagesToRemove}
        error=""
      />
    );

    const fileInput = getByTestId("file-input") as HTMLInputElement;

    const file1 = new File(["hello"], "hello.png", { type: "image/png" });
    const file2 = new File(["world"], "world.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, {
      target: { files: [file1, file2] },
    });

    expect(setNewFiles).toHaveBeenCalledTimes(1);
    expect(setNewFiles).toHaveBeenCalledWith([file1, file2]);
  });

    it("renders error message", () => {
        render(
            <ImageManager
                existingImages={[]}
                newFiles={[]}
                setNewFiles={mockSetNewFiles}
                imagesToRemove={[]}
                setImagesToRemove={mockSetImagesToRemove}
                error="Something went wrong"
            />
        );

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
});
