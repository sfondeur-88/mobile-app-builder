import { ConfigurationContent } from '@/types';
import { create } from 'zustand';

interface BuilderState {
  draftConfig: ConfigurationContent | null;
  savedConfig: ConfigurationContent | null;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isPublished: boolean;
  setDraftConfig: (config: ConfigurationContent) => void;
  setSavedConfig: (config: ConfigurationContent) => void;
  setIsPublished: (isPublished: boolean) => void;
  saveConfiguration: (configId: number) => Promise<void>;
  publishConfiguration: (configId: number) => Promise<void>;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  draftConfig: null,
  savedConfig: null,
  hasUnsavedChanges: false,
  isSaving: false,
  isPublishing: false,
  isPublished: false,

  setDraftConfig: (config) => {
    const { savedConfig } = get();
    set({
      draftConfig: config,
      hasUnsavedChanges: JSON.stringify(config) !== JSON.stringify(savedConfig),
    });
  },

  setSavedConfig: (config) =>
    set({
      savedConfig: config,
      draftConfig: config,
      hasUnsavedChanges: false,
    }),

  setIsPublished: (isPublished) => set({ isPublished }),

  saveConfiguration: async (configId: number) => {
    const { draftConfig } = get();
    if (!draftConfig) return;

    set({ isSaving: true });

    try {
      const response = await fetch(`/api/configurations/${configId}/save`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draftConfig }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      // Update saved config to match draft.
      set({
        savedConfig: draftConfig,
        hasUnsavedChanges: false,
        isSaving: false,
        isPublished: false,
      });

      return Promise.resolve();
    } catch (error) {
      set({ isSaving: false });
      return Promise.reject(error);
    }
  },

  publishConfiguration: async (configId: number) => {
    set({ isPublishing: true });

    try {
      const response = await fetch(`/api/configurations/${configId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to publish');
      }

      set({
        isPublishing: false,
        isPublished: true,
      });

      return Promise.resolve();
    } catch (error) {
      set({ isPublishing: false });
      return Promise.reject(error);
    }
  },
}));