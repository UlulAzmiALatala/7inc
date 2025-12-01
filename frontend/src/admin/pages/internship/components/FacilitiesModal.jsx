import { createPortal } from "react-dom";

const FacilitiesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-xl font-bold mb-4">Edit Fasilitas</h2>
        <p>Form Fasilitas akan diletakkan di sini.</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="btn btn-primary">
            Tutup
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default FacilitiesModal;
