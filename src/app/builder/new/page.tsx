"use client";

import { ConfigurationContent } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewConfigPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateConfig = async () => {
    setIsCreating(true);
    setError(null);

    // Default empty configuration
    const defaultContent: ConfigurationContent = {
      carousel: {
        images: [],
      },
      textSection: {
        title: "Welcome to Our Store",
        description: "Discover amazing products curated just for you",
        titleColour: "#000000",
        descriptionColour: "#666666",
      },
      callToAction: {
        label: "Shop Now",
        url: "https://example.com",
        backgroundColour: "#000000",
        textColour: "#FFFFFF",
      },
    };

    try {
      const response = await fetch('/api/configurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Home Screen",
          content: defaultContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create configuration');
      }

      const data = await response.json();
      const newConfigId = data.data.id;

      // Redirect to the new config builder
      router.push(`/builder/${newConfigId}`);

    } catch (err) {
      console.error('Create config failed:', err);
      setError('Failed to create configuration. Please try again.');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Icon/Illustration */}
        <div className="w-24 h-24 mx-auto mb-6 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your First Home Screen
        </h1>
        <p className="text-gray-600 mb-8">
          {`Get started by creating a new home screen configuration. You'll be able to customize the carousel, text sections, and call-to-action buttons.`}
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleCreateConfig}
          disabled={isCreating}
          className="w-full px-6 py-3 text-base font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating...' : 'Create Home Screen'}
        </button>

        <p className="text-sm text-gray-500 mt-4">
          You can always edit and customize everything later
        </p>
      </div>
    </div>
  );
}