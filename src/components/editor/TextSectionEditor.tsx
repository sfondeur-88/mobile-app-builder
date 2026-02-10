"use client";

import { useBuilderStore } from "@/lib/store";

export default function TextSectionEditor() {
  const draftConfig = useBuilderStore((state) => state.draftConfig);
  const setDraftConfig = useBuilderStore((state) => state.setDraftConfig);

  if (!draftConfig) return null;

  const { textSection } = draftConfig;

  const handleChange = (field: keyof typeof textSection, value: string) => {
    setDraftConfig({
      ...draftConfig,
      textSection: {
        ...textSection,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Text Section</h3>

      <div>
        <label
          htmlFor="text-title"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="text-title"
          type="text"
          value={textSection.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Welcome to Our Store"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400"
        />
      </div>

      <div>
        <label
          htmlFor="text-title-colour"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Title Colour
        </label>
        <div className="flex gap-2">
          <input
            id="text-title-colour"
            type="color"
            value={textSection.titleColour}
            onChange={(e) => handleChange('titleColour', e.target.value)}
            className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            id="text-title-colour-hex"
            type="text"
            value={textSection.titleColour}
            onChange={(e) => handleChange('titleColour', e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 font-mono text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="text-description"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="text-description"
          value={textSection.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="e.g., Discover amazing products curated just for you"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="text-description-colour"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Description Colour
        </label>
        <div className="flex gap-2">
          <input
            id="text-description-colour"
            type="color"
            value={textSection.descriptionColour}
            onChange={(e) => handleChange('descriptionColour', e.target.value)}
            className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            type="text"
            value={textSection.descriptionColour}
            onChange={(e) => handleChange('descriptionColour', e.target.value)}
            placeholder="#666666"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}