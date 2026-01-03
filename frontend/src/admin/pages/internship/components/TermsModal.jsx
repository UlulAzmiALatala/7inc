import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { api } from "../../../../api/client";

const TermsModal = ({ isOpen, onClose }) => {
  const [header, setHeader] = useState({ subtitle: "", headline: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // State untuk edit item spesifik
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const res = await api.get("/api/internship/terms");
      if (res.data.status) {
        setHeader(res.data.data.header || {});
        setItems(res.data.data.items || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveHeader = async () => {
    setLoading(true);
    try {
      await api.put("/api/admin/internship/terms/header", header);
      alert("Header tersimpan!");
    } catch {
      alert("Gagal simpan header");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (idx) => {
    setLoading(true);
    try {
      await api.put(`/api/admin/internship/terms/items/${idx + 1}`, { text: editText });
      // Update local state
      const newItems = [...items];
      newItems[idx] = editText;
      setItems(newItems);
      setEditIdx(null);
    } catch {
      alert("Gagal update item");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Edit Syarat & Ketentuan Magang</h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <div className="p-6">
          {/* Header Form */}
          <div className="mb-8 bg-blue-50 p-5 rounded-lg border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">Header Section</h3>
            <div className="grid gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Sub Judul</label>
                <input
                  className="input input-sm input-bordered w-full"
                  value={header.subtitle || ""}
                  onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
                  placeholder="Sub Judul"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Headline Utama</label>
                <input
                  className="input input-md input-bordered w-full font-bold"
                  value={header.headline || ""}
                  onChange={(e) => setHeader({ ...header, headline: e.target.value })}
                  placeholder="Headline Utama"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSaveHeader}
                  disabled={loading}
                  className="btn btn-sm btn-primary"
                >
                  {loading ? <span className="loading loading-spinner loading-xs"></span> : <i className="ri-save-line mr-1"></i>}
                  Simpan Header
                </button>
              </div>
            </div>
          </div>

          {/* List Items */}
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="ri-list-check text-blue-600"></i>
            Daftar Syarat & Ketentuan
          </h3>
          <div className="space-y-3">
            {items.map((itemText, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition border-gray-200"
              >
                <div className="badge badge-primary badge-outline mt-1 font-mono">
                  {idx + 1}
                </div>

                {editIdx === idx ? (
                  <div className="flex-1">
                    <textarea
                      className="textarea textarea-bordered w-full text-sm"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      autoFocus
                      rows="3"
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                      <button
                        onClick={() => setEditIdx(null)}
                        className="btn btn-xs btn-ghost"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSaveItem(idx)}
                        disabled={loading}
                        className="btn btn-xs btn-success text-white"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex justify-between items-start group">
                    <p className="text-gray-700 text-sm leading-relaxed pr-4">
                      {itemText}
                    </p>
                    <button
                      onClick={() => {
                        setEditIdx(idx);
                        setEditText(itemText);
                      }}
                      className="btn btn-square btn-xs btn-ghost text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="ri-pencil-line"></i>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TermsModal;
