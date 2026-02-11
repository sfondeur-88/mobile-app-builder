"use client";

import { useBuilderStore } from "@/lib/store";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import ConfirmationModal from "../ui/ConfirmationModal";
import SortableImage from "./SortableImage";

export default function CarouselEditor() {
  const draftConfig = useBuilderStore((s) => s.draftConfig);
  const setDraftConfig = useBuilderStore((s) => s.setDraftConfig);

  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newImageAlt, setNewImageAlt] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageToRemove, setImageToRemove] = useState<string | null>(null);

  const dragAndDropSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!draftConfig) return null;

  const { carousel } = draftConfig;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = carousel.images.findIndex((img) => img.id === active.id);
      const newIndex = carousel.images.findIndex((img) => img.id === over.id);

      const reorderedImages = arrayMove(carousel.images, oldIndex, newIndex).map(
        (img, idx) => ({
          ...img,
          order: idx,
        })
      );

      setDraftConfig({
        ...draftConfig,
        carousel: {
          images: reorderedImages,
        },
      });
    }
  };

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
      <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
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
          className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
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
          <DndContext
            sensors={dragAndDropSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={carousel.images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {carousel.images.map((image, index) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    index={index}
                    totalImages={carousel.images.length}
                    onUpdate={handleUpdateImage}
                    onRemove={handleRemoveImage}
                    onMoveUp={() => handleMoveImage(index, "up")}
                    onMoveDown={() => handleMoveImage(index, "down")}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
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