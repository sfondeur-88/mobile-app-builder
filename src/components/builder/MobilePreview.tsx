"use client";

import { useBuilderStore } from "@/lib/store";

export default function MobilePreview() {
  const draftConfig = useBuilderStore((state) => state.draftConfig);

  if (!draftConfig) {
    return (
      <main className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-gray-100 flex items-center justify-center p-8">
      <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden">
        <div className="h-full bg-white overflow-y-auto p-4 space-y-4">
          {/* Carousel */}
          <div className="space-y-2">
            {draftConfig.carousel.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={image.alt || ''}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Text Section */}
          <div className="space-y-2">
            <h2 
              className="text-2xl font-bold"
              style={{ color: draftConfig.textSection.titleColour }}
            >
              {draftConfig.textSection.title}
            </h2>
            <p 
              className="text-sm"
              style={{ color: draftConfig.textSection.descriptionColour }}
            >
              {draftConfig.textSection.description}
            </p>
          </div>

          {/* CTA Button */}
          <button
            className="w-full py-3 px-6 rounded-lg font-medium"
            style={{
              backgroundColor: draftConfig.callToAction.backgroundColour,
              color: draftConfig.callToAction.textColour,
            }}
          >
            {draftConfig.callToAction.label}
          </button>
        </div>
      </div>
    </main>
  );
}