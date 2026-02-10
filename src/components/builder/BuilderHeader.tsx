"use client";

import { useBuilderStore } from "@/lib/store";
import { SaveStatus } from "@/types";
import { useState } from "react";

export default function BuilderHeader() {
  const isSaving = useBuilderStore((s) => s.isSaving);
  const isPublishing = useBuilderStore((s) => s.isPublishing);
  const isPublished = useBuilderStore((s) => s.isPublished);
  const hasUnsavedChanges = useBuilderStore((s) => s.hasUnsavedChanges());
  const saveConfiguration = useBuilderStore((s) => s.saveConfiguration);
  const publishConfiguration = useBuilderStore((s) => s.publishConfiguration);

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [publishStatus, setPublishStatus] = useState<SaveStatus>('idle');

  const handleSave = async () => {
    try {
      setSaveStatus('idle');
      await saveConfiguration(1); // TODO:Shane - Make configId dynamic
      setSaveStatus('success');

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('error');

      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // TODO:Shane - Snackbar for publishing?
  const handlePublish = async () => {
    if (hasUnsavedChanges) {
      setPublishStatus('error');
      setTimeout(() => setPublishStatus('idle'), 3000);
      return;
    }

    try {
      setPublishStatus('idle');
      await publishConfiguration(1); // TODO:Shane - Make configId dynamic
      setPublishStatus('success');

      setTimeout(() => setPublishStatus('idle'), 2000);
    } catch (error) {
      console.error('Publish failed:', error);
      setPublishStatus('error');

      setTimeout(() => setPublishStatus('idle'), 3000);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-neutral-900 font-semibold">Home Screen</h2>

        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && (
          <span className="text-xs text-amber-600 font-medium">
            • Unsaved changes
          </span>
        )}

        {/* Published Indicator */}
        {isPublished && !hasUnsavedChanges && (
          <span className="text-xs text-emerald-600 font-medium">
            • Published
          </span>
        )}

        {/* Save Status Messages */}
        {saveStatus === 'success' && (
          <span className="text-xs text-emerald-600 font-medium">
            ✓ Saved successfully
          </span>
        )}
        {saveStatus === 'error' && (
          <span className="text-xs text-red-600 font-medium">
            ✗ Save failed
          </span>
        )}

        {/* Publish Status Messages */}
        {publishStatus === 'success' && (
          <span className="text-xs text-emerald-600 font-medium">
            ✓ Published successfully
          </span>
        )}
        {publishStatus === 'error' && hasUnsavedChanges && (
          <span className="text-xs text-red-600 font-medium">
            ✗ Please save before publishing
          </span>
        )}
        {publishStatus === 'error' && !hasUnsavedChanges && (
          <span className="text-xs text-red-600 font-medium">
            ✗ Publish failed
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer">
          Revisions
        </button>

        <button
          onClick={handleSave}
          disabled={!hasUnsavedChanges || isSaving}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50  cursor-pointer disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        {/* TODO:Shane - tooltip on hover to let the user know more info? */}
        {/* Ex: 'Current config is already published' */}
        <button
          onClick={handlePublish}
          disabled={hasUnsavedChanges || isPublishing || (isPublished && !hasUnsavedChanges)}
          className="px-6 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isPublishing ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}