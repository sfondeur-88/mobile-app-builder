"use client";

import { useBuilderStore } from "@/lib/store";

export default function CallToActionEditor() {
  const draftConfig = useBuilderStore((state) => state.draftConfig);
  const setDraftConfig = useBuilderStore((state) => state.setDraftConfig);

  if (!draftConfig) return null;

  const { callToAction } = draftConfig;

  const handleChange = (field: keyof typeof callToAction, value: string) => {
    setDraftConfig({
      ...draftConfig,
      callToAction: {
        ...callToAction,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Call to Action</h3>

      <div>
        <label
          htmlFor="cta-label"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Button Label
        </label>
        <input
          id="cta-label"
          type="text"
          value={callToAction.label}
          onChange={(e) => handleChange('label', e.target.value)}
          placeholder="e.g., Shop Now"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="cta-url"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Destination URL
        </label>
        <input
          id="cta-url"
          type="url"
          value={callToAction.url}
          onChange={(e) => handleChange('url', e.target.value)}
          placeholder="https://example.com/shop"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label
          htmlFor="cta-bg-colour"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Background Colour
        </label>
        <div className="flex gap-2">
          <input
            id="cta-bg-colour"
            type="color"
            value={callToAction.backgroundColour}
            onChange={(e) => handleChange('backgroundColour', e.target.value)}
            className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            type="text"
            value={callToAction.backgroundColour}
            onChange={(e) => handleChange('backgroundColour', e.target.value)}
            placeholder="#000000"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="cta-text-colour"
          className="inline text-sm font-medium text-gray-700 mb-1"
        >
          Text Colour
        </label>
        <div className="flex gap-2">
          <input
            id="cta-text-colour"
            type="color"
            value={callToAction.textColour}
            onChange={(e) => handleChange('textColour', e.target.value)}
            className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
          />
          <input
            type="text"
            value={callToAction.textColour}
            onChange={(e) => handleChange('textColour', e.target.value)}
            placeholder="#FFFFFF"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-900 font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}