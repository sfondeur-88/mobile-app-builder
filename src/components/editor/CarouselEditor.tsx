"use client";

import { useBuilderStore } from "@/lib/store";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function CarouselEditor() {
  const draftConfig = useBuilderStore((s) => s.draftConfig);
  const setDraftConfig = useBuilderStore((s) => s.setDraftConfig);

  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newImageAlt, setNewImageAlt] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageToRemove, setImageToRemove] = useState<string | null>(null);

  if (!draftConfig) return null;

  const { carousel } = draftConfig;

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;

    const newImage = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      alt: newImageAlt.trim(),
      order: carousel.images.length,
    };

    setDraftConfig({
      ...draftConfig,
      carousel: {
        images: [...carousel.images, newImage],
      },
    });

    // Clear form
    setNewImageUrl("");
    setNewImageAlt("");
  };

  const handleRemoveImage = (id: string) => {
    setImageToRemove(id);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!imageToRemove) return;

    const updatedImages = carousel.images
      .filter((img) => img.id !== imageToRemove)
      .map((img, index) => ({ ...img, order: index })); // Reorder after removal.

    setDraftConfig({
      ...draftConfig,
      carousel: {
        images: updatedImages,
      },
    });

    setImageToRemove(null);
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= carousel.images.length) return;

    const updatedImages = [...carousel.images];
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];

    // Update order property
    const reorderedImages = updatedImages.map((img, idx) => ({
      ...img,
      order: idx,
    }));

    setDraftConfig({
      ...draftConfig,
      carousel: {
        images: reorderedImages,
      },
    });
  };

  const handleUpdateImage = (id: string, field: "url" | "alt", value: string) => {
    const updatedImages = carousel.images.map((img) =>
      img.id === id ? { ...img, [field]: value } : img
    );

    setDraftConfig({
      ...draftConfig,
      carousel: {
        images: updatedImages,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Carousel Editor</h3>

      {/* Add New Image Form */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700">Add New Image</h4>

        <div>
          <label htmlFor="new-image-url" className="inline text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            id="new-image-url"
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div>
          <label htmlFor="new-image-alt" className="inline text-sm font-medium text-gray-700">
            Alt Text
          </label>
          <input
            id="new-image-alt"
            type="text"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            placeholder="Description of the image"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <button
          onClick={handleAddImage}
          disabled={!newImageUrl.trim()}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Image
        </button>
      </div>

      {/* Current Images List */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">
          Current Images ({carousel.images.length})
        </h4>

        {carousel.images.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No images added yet!</p>
        ) : (
          <div className="space-y-2">
            {carousel.images.map((image, index) => (
              <div
                key={image.id}
                className="p-3 border border-gray-200 rounded-lg space-y-2 bg-white"
              >
                {/* Image Preview & Controls */}
                <div className="flex gap-3">
                  <div className="w-20 h-20 shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
                    <img
                      src={image.url}
                      alt={image.alt || 'Carousel image'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23ddd" width="80" height="80"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3E?%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Image Details */}
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={image.url}
                      onChange={(e) => handleUpdateImage(image.id, "url", e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                    />
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleUpdateImage(image.id, "alt", e.target.value)}
                      placeholder="Alt text"
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {/* TODO:Shane - icons for arrows? */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveImage(index, "up")}
                    disabled={index === 0}
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ↑ Move Up
                  </button>
                  <button
                    onClick={() => handleMoveImage(index, "down")}
                    disabled={index === carousel.images.length - 1}
                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    ↓ Move Down
                  </button>
                  <button
                    onClick={() => handleRemoveImage(image.id)}
                    className="ml-auto px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 cursor-pointer rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="You sure about that?"
        message="Are you sure you want to remove this image? This action cannot be undone."
        variant="danger"
        confirmText="Yes, Remove"
        onConfirm={handleConfirmRemove}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}