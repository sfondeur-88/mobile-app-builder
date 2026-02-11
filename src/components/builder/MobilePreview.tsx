"use client";

import { useBuilderStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DeviceSize } from "@/types";
import { useState } from "react";

// Small - older iPhones/Androids
// Large - Max/Pro/Plus/XL models of current phones.
const dimensions = {
  small: { width: 375, height: 812, label: "Small" },
  large: { width: 430, height: 932, label: "Large" },
};

export default function MobilePreview() {
  const draftConfig = useBuilderStore((state) => state.draftConfig);

  const [deviceSize, setDeviceSize] = useState<DeviceSize>("small");
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const { width, height } = dimensions[deviceSize];

  if (!draftConfig) {
    return (
      <main className="flex-1 bg-gray-100 flex items-center justify-center p-8">
        <div className="w-[375px] h-[812px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  const { carousel } = draftConfig;
  const hasImages = carousel.images.length > 0;

  return (
    <main className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-8 gap-6">
      {/* Device Size Toggle */}
      <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setDeviceSize("small")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md cursor-pointer",
            deviceSize === "small"
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {dimensions.small.label}
        </button>
        <button
          onClick={() => setDeviceSize("large")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-md cursor-pointer",
            deviceSize === "large"
              ? "bg-gray-800 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {dimensions.large.label}
        </button>
      </div>

      {/* Mobile Device Frame */}
      <div
        className="bg-white rounded-[3rem] shadow-2xl border-8 border-gray-800 overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="h-full bg-white overflow-y-auto p-4 space-y-4">
          {/* Carousel */}
          {hasImages && (
            <div className="relative">
              {/* Current Image */}
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={carousel.images[activeImageIndex].url}
                  alt={carousel.images[activeImageIndex].alt || ""}
                  className="w-full h-full object-cover"
                />
              </div>

              {carousel.images.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {carousel.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full cursor-pointer",
                        index === activeImageIndex
                          ? "bg-gray-900 w-6"
                          : "bg-gray-300 hover:bg-gray-400"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Text */}
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

          {/* Call to Action */}
          <a
            href={draftConfig.callToAction.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 rounded-lg font-medium text-center cursor-pointer"
            style={{
              backgroundColor: draftConfig.callToAction.backgroundColour,
              color: draftConfig.callToAction.textColour,
            }}
          >
            {draftConfig.callToAction.label}
          </a>
        </div>
      </div>
    </main>
  );
}