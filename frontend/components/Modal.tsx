import React from "react";

interface ModalProps {
  show: boolean; // Controls visibility of the modal
  onClose: () => void; // Function to call when closing the modal
  title?: string; // Optional title for the modal
  children: React.ReactNode; // Content to display inside the modal
}

export default function Modal({ show, onClose, title, children }: ModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-auto">
      <div className="w-full max-w-3xl mx-4 p-6 relative bg-dark border border-secondary rounded-lg shadow-lg animate-fadeIn">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-secondary pb-2 mb-4">
          <h2 className="text-2xl font-bold text-primary">{title || "Modal Title"}</h2>
        </div>

        {/* Modal Content - Smooth Scrollable Section */}
        <div className="modal-content max-h-[60vh] overflow-y-auto p-4 text-white custom-scrollbar">
          {children}
        </div>

        {/* Modal Footer with Close Button */}
        <div className="flex justify-end mt-6 border-t border-secondary pt-4">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-300 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
