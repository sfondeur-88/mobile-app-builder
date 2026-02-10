"use client";

import { cn } from "@/lib/utils";
import Modal from "./Modal";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  const {
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
  } = props;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-emerald-500 hover:bg-emerald-600";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer rounded-md"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium text-white cursor-pointer rounded-md",
              variantButtonClass,
            )}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
}

export default ConfirmationModal;