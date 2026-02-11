"use client";

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Image {
  id: string;
  url: string;
  order: number;
  alt?: string;
}

interface SortableImageProps {
  image: Image;
  index: number;
  totalImages: number;
  onUpdate: (id: string, field: "url" | "alt", value: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export default function SortableImage(props: SortableImageProps) {
  const {
    image,
    index,
    totalImages,
    onUpdate,
    onRemove,
    onMoveUp,
    onMoveDown,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 border border-gray-200 rounded-lg space-y-2 bg-white transition-shadow",
        isDragging && "shadow-lg opacity-50"
      )}
    >
      {/* Image Preview & Controls */}
      <div className="flex gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="shrink-0 w-10 flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>

        {/* Thumbnail */}
        <div className="w-20 h-20 shrink-0 bg-gray-100 rounded overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.alt || "Carousel image"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image Details */}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            value={image.url}
            onChange={(e) => onUpdate(image.id, "url", e.target.value)}
            placeholder="Image URL"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
          />
          <input
            type="text"
            value={image.alt || ""}
            onChange={(e) => onUpdate(image.id, "alt", e.target.value)}
            placeholder="Alt text"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          ↑ Move Up
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={index === totalImages - 1}
          className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          ↓ Move Down
        </button>
        <button
          onClick={() => onRemove(image.id)}
          className="ml-auto px-3 py-1 text-xs font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 rounded cursor-pointer"
        >
          Remove
        </button>
      </div>
    </div>
  );
}