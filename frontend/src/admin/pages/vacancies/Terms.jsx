import React, { useState, useEffect } from "react";
import api from "../../../api/client";

const VacanciesTerms = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setLoading(true);
    try {
      // Menggunakan configurations API untuk menyimpan terms umum
      const res = await api.get("/api/configurations/vacancy_terms");
      // Asumsi response format: { data: { key: 'vacancy_terms', value: '...' } }
      // Atau jika 404, value kosong
      setContent(res.data.value || "");
    } catch (error) {
      console.error("Error fetching terms:", error);
      // Jika 404 (belum ada), biarkan kosong
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/api/admin/configurations/vacancy_terms", {
        value: content,
      });
      alert("Syarat & Ketentuan berhasil disimpan!");
    } catch (error) {
      console.error("Error saving terms:", error);
      alert("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Syarat & Ketentuan Umum</h1>
        <p className="text-gray-500 text-sm">
          Kelola syarat dan ketentuan umum yang berlaku untuk semua pelamar lowongan kerja.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
          <div className="flex justify-center p-8">
            <span className="loading loading-spinner text-blue-600"></span>
          </div>
        ) : (
          <div>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-semibold">Isi Syarat & Ketentuan</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-64 font-mono text-sm"
                placeholder="Tuliskan syarat dan ketentuan umum di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
              <label className="label">
                <span className="label-text-alt text-gray-400">
                  Gunakan format teks biasa atau HTML sederhana jika didukung.
                </span>
              </label>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary text-white"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line mr-2"></i>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VacanciesTerms;
