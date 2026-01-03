import React, { useState, useEffect } from "react";
import { api } from "../../../api/client";

const Applicants = () => {
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null); // ID of applicant being saved
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Default Weights (currently fixed in backend)
  const weights = {
    education: 20,
    experience: 20,
    skill: 20,
    interview: 20,
    attitude: 20
  };

  // Fetch Vacancies first
  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await api.get("/api/admin/vacancies");
        setVacancies(res.data.data || []);
        if (res.data.data && res.data.data.length > 0) {
          setSelectedVacancy(res.data.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch vacancies", err);
      }
    };
    fetchVacancies();
  }, []);

  // Fetch Applicants when vacancy selected
  useEffect(() => {
    if (!selectedVacancy) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/vacancies/${selectedVacancy}/applicants`);
        setApplicants(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch applicants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedVacancy]);

  // Handle Score Input Change
  const handleScoreChange = (applicantId, field, value) => {
    // Ensure value is within 0-100
    let numValue = parseFloat(value);
    if (numValue < 0) numValue = 0;
    if (numValue > 100) numValue = 100;

    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, [field]: value } : app
      )
    );
  };

  // Save Scores
  const saveScore = async (applicant) => {
    setSaving(applicant.id);
    try {
      await api.put(`/api/admin/applicants/${applicant.id}`, {
        education_score: applicant.education_score,
        experience_score: applicant.experience_score,
        skill_score: applicant.skill_score,
        interview_score: applicant.interview_score,
        attitude_score: applicant.attitude_score,
      });
      
      // Refresh to get updated ranking/final score
      const res = await api.get(`/api/admin/vacancies/${selectedVacancy}/applicants`);
      setApplicants(res.data.data || []);
      
      // Optional: Show success toast/notification
    } catch (err) {
      console.error("Failed to save score", err);
      alert("Gagal menyimpan nilai. Pastikan semua input valid.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Pelamar & Analisis SPK (SAW)</h1>
        <p className="text-gray-500 text-sm">Kelola pelamar dan penilaian menggunakan metode SPK SAW.</p>
      </div>

      {/* Vacancy Selector */}
      <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <label className="block mb-2 text-sm font-medium text-gray-700">Pilih Lowongan Pekerjaan:</label>
        <select
          className="select select-bordered w-full max-w-md bg-white text-gray-800"
          value={selectedVacancy || ""}
          onChange={(e) => setSelectedVacancy(e.target.value)}
        >
          {vacancies.length === 0 && <option value="">Tidak ada lowongan aktif</option>}
          {vacancies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Tabel Penilaian Kandidat</h2>
            <div className="badge badge-info text-white">Metode SAW (Simple Additive Weighting)</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="text-center">Rank</th>
                  <th>Kandidat</th>
                  <th className="text-center w-20">Pend. (C1)</th>
                  <th className="text-center w-20">Peng. (C2)</th>
                  <th className="text-center w-20">Skill (C3)</th>
                  <th className="text-center w-20">Wawn. (C4)</th>
                  <th className="text-center w-20">Sikap (C5)</th>
                  <th className="text-center">Nilai Akhir</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center">
                        <i className="ri-user-search-line text-4xl mb-2 text-gray-300"></i>
                        <p>Belum ada pelamar untuk lowongan ini.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applicants
                    .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="text-center font-bold text-lg text-blue-600">
                          {app.ranking ? `#${app.ranking}` : "-"}
                        </td>
                        <td>
                          <div className="font-bold text-gray-800">{app.name}</div>
                          <div className="text-xs text-gray-500">{app.email}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {app.cv_file && (
                                <a href={`/storage/${app.cv_file}`} target="_blank" rel="noopener noreferrer" className="link link-primary no-underline">
                                    <i className="ri-file-text-line"></i> Lihat CV
                                </a>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input input-bordered input-sm w-full text-center"
                            value={app.education_score}
                            onChange={(e) => handleScoreChange(app.id, "education_score", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input input-bordered input-sm w-full text-center"
                            value={app.experience_score}
                            onChange={(e) => handleScoreChange(app.id, "experience_score", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input input-bordered input-sm w-full text-center"
                            value={app.skill_score}
                            onChange={(e) => handleScoreChange(app.id, "skill_score", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input input-bordered input-sm w-full text-center"
                            value={app.interview_score}
                            onChange={(e) => handleScoreChange(app.id, "interview_score", e.target.value)}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            className="input input-bordered input-sm w-full text-center"
                            value={app.attitude_score}
                            onChange={(e) => handleScoreChange(app.id, "attitude_score", e.target.value)}
                          />
                        </td>
                        <td className="text-center font-bold text-gray-800">
                          {app.final_score ? parseFloat(app.final_score).toFixed(4) : "-"}
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => saveScore(app)}
                            disabled={saving === app.id}
                            className="btn btn-sm btn-primary text-white"
                          >
                            {saving === app.id ? (
                                <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                                <i className="ri-save-3-line"></i>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            * Nilai dihitung otomatis berdasarkan bobot kriteria. Peringkat 1 adalah kandidat terbaik.
          </div>
        </div>
      )}
      {/* Weight Config Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Konfigurasi Bobot Kriteria (SAW)</h3>
            <p className="text-sm text-gray-500 mb-4">
              Saat ini sistem menggunakan bobot rata (Equal Weighting). Fitur kustomisasi bobot akan segera hadir di update backend berikutnya.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pendidikan (Education)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pengalaman (Experience)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Keahlian (Skill)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Wawancara (Interview)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sikap (Attitude)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="divider my-1"></div>
              <div className="flex justify-between items-center font-bold">
                <span>Total Bobot</span>
                <span className="text-green-600">100%</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => setShowWeightModal(false)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
