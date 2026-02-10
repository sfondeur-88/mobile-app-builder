"use client";

import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Modal from "@/components/ui/Modal";
import { useBuilderStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import { SaveStatus } from "@/types";
import { useEffect, useState } from "react";

interface Revision {
  id: number;
  revisionNumber: number;
  isPublished: boolean;
  createdAt: string;
}

interface RevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  configId: number;
}

export default function RevisionsModal({ isOpen, onClose, configId }: RevisionsModalProps) {
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<SaveStatus>("idle");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [revisionToRestore, setRevisionToRestore] = useState<Revision | null>(null);

  const setDraftConfig = useBuilderStore((s) => s.setDraftConfig);
  const setSavedConfig = useBuilderStore((s) => s.setSavedConfig);
  const setIsPublished = useBuilderStore((s) => s.setIsPublished);

  // Fetch revisions when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchRevisions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, configId]);

  const fetchRevisions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/configurations/${configId}/revisions`);

      if (!response.ok) {
        throw new Error('Failed to fetch revisions');
      }

      const data = await response.json();
      setRevisions(data.data);
    } catch (err) {
      console.error('Failed to fetch revisions:', err);
      setError('Failed to load revisions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreClick = (revision: Revision) => {
    setRevisionToRestore(revision);
    setIsConfirmOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!revisionToRestore) return;

    setRestoreStatus("idle");

    try {
      const response = await fetch(
        `/api/configurations/${configId}/restore/${revisionToRestore.id}`,
        { method: 'POST' }
      );

      if (!response.ok) {
        throw new Error('Failed to restore revision');
      }

      const data = await response.json();
      const restoredContent = data.data.content;

      // Update Zustand with restored content
      setDraftConfig(restoredContent);
      setSavedConfig(restoredContent);
      setIsPublished(false); // Restored revisions are unpublished

      setRestoreStatus("success");

      // Refresh revisions list
      await fetchRevisions();

      // Close modal after success
      setTimeout(() => {
        setRestoreStatus("idle");
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Restore failed:', err);
      setRestoreStatus("error");

      setTimeout(() => setRestoreStatus("idle"), 3000);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Revision History"
        size="lg"
      >
        {/* Status Messages */}
        {restoreStatus === "success" && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
            <p className="text-sm text-emerald-700">✓ Revision restored successfully</p>
          </div>
        )}
        {restoreStatus === "error" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">✗ Failed to restore revision</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading revisions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchRevisions}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Revisions List */}
        {!isLoading && !error && revisions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No revisions found</p>
          </div>
        )}

        {!isLoading && !error && revisions.length > 0 && (
          <div className="space-y-3">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-gray-900">
                        Revision #{revision.revisionNumber}
                      </h4>
                      {revision.isPublished && (
                        <span className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded">
                          Published
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(revision.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRestoreClick(revision)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300 cursor-pointer"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Restore Revision?"
        message={`Are you sure you want to restore Revision #${revisionToRestore?.revisionNumber}? This will create a new revision with the restored content.`}
        confirmText="Restore"
        variant="primary"
        onConfirm={handleConfirmRestore}
        onClose={() => setIsConfirmOpen(false)}
      />
    </>
  );
}