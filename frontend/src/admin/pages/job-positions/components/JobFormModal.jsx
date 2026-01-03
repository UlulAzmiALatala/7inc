import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import Portal
import { api } from "../../../../api/client";

const JobFormModal = ({ isOpen, onClose, onSuccess, dataToEdit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    job_type: "full-time",
    salary_range: "",
    deadline: "",
    google_form_url: "https://forms.google.com", // Default or empty
    status: "open"
  });
  const [loading, setLoading] = useState(false);

  // Mengisi form jika mode edit
  useEffect(() => {
    if (isOpen) {
      if (dataToEdit) {
        setFormData({
          title: dataToEdit.title || "",
          description: dataToEdit.description || "",
          requirements: dataToEdit.requirements || "",
          location: dataToEdit.location || "",
          job_type: dataToEdit.job_type || "full-time",
          salary_range: dataToEdit.salary_range || "",
          deadline: dataToEdit.deadline ? dataToEdit.deadline.split('T')[0] : "",
          google_form_url: dataToEdit.google_form_url || "",
          status: dataToEdit.status || "open"
        });
      } else {
        // Reset form jika mode tambah baru
        setFormData({
            title: "",
            description: "",
            requirements: "",
            location: "",
            job_type: "full-time",
            salary_range: "",
            deadline: "",
            google_form_url: "",
            status: "open"
        });
      }
    }
  }, [isOpen, dataToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = dataToEdit
        ? `/api/admin/vacancies/${dataToEdit.id}`
        : `/api/admin/vacancies`;

      const method = dataToEdit ? "put" : "post";

      await api[method](url, formData);

      // Refresh data tabel & tutup modal
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving job:", error);
      const msg =
        error.response?.data?.message || "Gagal menyimpan data lowongan.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 animate__animated animate__fadeInDown max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {dataToEdit ? "Edit Lowongan Kerja" : "Tambah Lowongan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Judul Posisi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Posisi / Judul
                </label>
                <input
                type="text"
                required
                className="input input-bordered w-full bg-white text-gray-800"
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Contoh: UI/UX Designer"
                />
            </div>

            {/* Input Lokasi */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
                </label>
                <input
                type="text"
                required
                className="input input-bordered w-full bg-white text-gray-800"
                value={formData.location}
                onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Contoh: Yogyakarta / Remote"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Job Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Pekerjaan
                </label>
                <select 
                    className="select select-bordered w-full bg-white text-gray-800"
                    value={formData.job_type}
                    onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                </select>
            </div>

            {/* Input Deadline */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
                </label>
                <input
                type="date"
                required
                className="input input-bordered w-full bg-white text-gray-800"
                value={formData.deadline}
                onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                }
                />
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kisaran Gaji (Opsional)
            </label>
            <input
              type="text"
              className="input input-bordered w-full bg-white text-gray-800"
              value={formData.salary_range}
              onChange={(e) =>
                setFormData({ ...formData, salary_range: e.target.value })
              }
              placeholder="Contoh: Rp 5.000.000 - Rp 8.000.000"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi Pekerjaan
            </label>
            <textarea
              required
              className="textarea textarea-bordered w-full bg-white text-gray-800 h-24"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Jelaskan tanggung jawab dan detail pekerjaan..."
            ></textarea>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Persyaratan (Requirements)
            </label>
            <textarea
              required
              className="textarea textarea-bordered w-full bg-white text-gray-800 h-24"
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              placeholder="Tuliskan persyaratan kandidat..."
            ></textarea>
          </div>

          {/* Google Form URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Google Form / Aplikasi (Opsional)
            </label>
            <input
              type="url"
              className="input input-bordered w-full bg-white text-gray-800"
              value={formData.google_form_url}
              onChange={(e) =>
                setFormData({ ...formData, google_form_url: e.target.value })
              }
              placeholder="https://forms.gle/..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost text-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-white shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>{" "}
                  Menyimpan...
                </>
              ) : (
                "Simpan Lowongan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default JobFormModal;
