import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";

const TermsTab = () => {
  const [header, setHeader] = useState({ subtitle: "", headline: "" });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // State untuk edit item spesifik
  const [editIdx, setEditIdx] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/internship/terms`);
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
      await axios.put(`${API_BASE}/admin/internship/terms/header`, header, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
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
      await axios.put(
        `${API_BASE}/admin/internship/terms/items/${idx + 1}`,
        { text: editText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
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

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate__animated animate__fadeIn">
      {/* Header Form */}
      <div className="mb-8 bg-blue-50 p-5 rounded-lg">
        <h3 className="font-bold text-blue-800 mb-3">Header Section</h3>
        <div className="grid gap-3">
          <input
            className="input input-sm input-bordered"
            value={header.subtitle || ""}
            onChange={(e) => setHeader({ ...header, subtitle: e.target.value })}
            placeholder="Sub Judul"
          />
          <input
            className="input input-md input-bordered font-bold"
            value={header.headline || ""}
            onChange={(e) => setHeader({ ...header, headline: e.target.value })}
            placeholder="Headline Utama"
          />
          <button
            onClick={handleSaveHeader}
            disabled={loading}
            className="btn btn-sm btn-primary w-fit mt-2"
          >
            Simpan Header
          </button>
        </div>
      </div>

      {/* List Items */}
      <h3 className="font-bold text-gray-800 mb-4">
        Daftar Syarat & Ketentuan (6 Poin)
      </h3>
      <div className="space-y-3">
        {items.map((itemText, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 hover:bg-white hover:shadow-sm transition"
          >
            <div className="badge badge-primary badge-outline mt-1">
              {idx + 1}
            </div>

            {editIdx === idx ? (
              <div className="flex-1">
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSaveItem(idx)}
                    disabled={loading}
                    className="btn btn-xs btn-success"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditIdx(null)}
                    className="btn btn-xs btn-ghost"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex justify-between items-center group">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {itemText}
                </p>
                <button
                  onClick={() => {
                    setEditIdx(idx);
                    setEditText(itemText);
                  }}
                  className="btn btn-square btn-xs btn-ghost text-blue-600 opacity-0 group-hover:opacity-100"
                >
                  <i className="ri-pencil-line"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsTab;
