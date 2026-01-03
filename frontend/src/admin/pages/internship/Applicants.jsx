import React, { useState, useEffect } from "react";
import { api } from "../../../api/client";

const InternshipApplicants = () => {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  // Default Weights (currently fixed in backend)
  const weights = {
    gpa: 20,
    skill: 20,
    motivation: 20,
    availability: 20,
    communication: 20
  };

  // Fetch Internships (Program Magang)
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const res = await api.get("/api/admin/internships");
        setInternships(res.data.data || []);
        if (res.data.data && res.data.data.length > 0) {
          // Pilih program pertama (terbaru) secara default
          setSelectedInternship(res.data.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch internships", err);
      }
    };
    fetchInternships();
  }, []);

  // Fetch Applicants when internship selected
  useEffect(() => {
    if (!selectedInternship) return;

    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/internships/${selectedInternship}/applicants`);
        setApplicants(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch applicants", err);
        setApplicants([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedInternship]);

  // Handle Score Input Change
  const handleScoreChange = (applicantId, field, value) => {
    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId ? { ...app, [field]: value } : app
      )
    );
  };

  // Save Scores
  const saveScore = async (applicant) => {
    try {
      await api.put(`/api/admin/internship-applicants/${applicant.id}`, {
        gpa_score: applicant.gpa_score,
        skill_score: applicant.skill_score,
        motivation_score: applicant.motivation_score,
        availability_score: applicant.availability_score,
        communication_score: applicant.communication_score,
      });
      alert("Nilai berhasil disimpan!");
      // Refresh list to update ranking
      const res = await api.get(`/api/admin/internships/${selectedInternship}/applicants`);
      setApplicants(res.data.data || []);
    } catch (err) {
      alert("Gagal menyimpan nilai");
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Data Pelamar & Analisis SPK (SAW)</h2>
      
      {/* Internship Selector */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="w-full md:w-auto">
          <label className="block mb-2 text-sm font-medium text-gray-700">Pilih Program Magang:</label>
          <select
            className="select select-bordered w-full max-w-md bg-white text-gray-800 border-gray-300"
            value={selectedInternship || ""}
            onChange={(e) => setSelectedInternship(e.target.value)}
          >
            <option value="" disabled>Pilih Program</option>
            {internships.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title} ({f.status})
              </option>
            ))}
          </select>
          {internships.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Belum ada data program magang.</p>
          )}
        </div>

        <button 
          onClick={() => setShowWeightModal(true)}
          className="btn btn-outline btn-info btn-sm"
        >
          <i className="ri-settings-3-line mr-2"></i>
          Konfigurasi Bobot SPK
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-md text-primary"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="w-16">Rank</th>
                <th>Nama Kandidat</th>
                <th className="text-center">IPK (C1)</th>
                <th className="text-center">Skill (C2)</th>
                <th className="text-center">Motivasi (C3)</th>
                <th className="text-center">Waktu (C4)</th>
                <th className="text-center">Komunikasi (C5)</th>
                <th className="text-center">Nilai Akhir</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {applicants.length > 0 ? (
                applicants
                  .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
                  .map((app) => (
                    <tr key={app.id}>
                      <td className="font-bold text-center">
                        {app.ranking ? (
                          <div className="badge badge-primary badge-outline">#{app.ranking}</div>
                        ) : "-"}
                      </td>
                      <td>
                        <div className="font-medium text-gray-800">{app.name}</div>
                        <div className="text-xs text-gray-500">{app.email}</div>
                        <div className="text-xs text-gray-400">{app.major} - {app.university}</div>
                        {app.cv_file && (
                          <a 
                            href={`/storage/${app.cv_file}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="link link-primary text-xs no-underline block mt-1"
                          >
                            <i className="ri-file-text-line"></i> Lihat CV
                          </a>
                        )}
                      </td>
                      {/* Score Inputs */}
                      <td className="text-center">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16 text-center"
                          value={app.gpa_score || 0}
                          onChange={(e) => handleScoreChange(app.id, "gpa_score", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16 text-center"
                          value={app.skill_score || 0}
                          onChange={(e) => handleScoreChange(app.id, "skill_score", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16 text-center"
                          value={app.motivation_score || 0}
                          onChange={(e) => handleScoreChange(app.id, "motivation_score", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16 text-center"
                          value={app.availability_score || 0}
                          onChange={(e) => handleScoreChange(app.id, "availability_score", e.target.value)}
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="input input-bordered input-xs w-16 text-center"
                          value={app.communication_score || 0}
                          onChange={(e) => handleScoreChange(app.id, "communication_score", e.target.value)}
                        />
                      </td>
                      <td className="text-center font-bold text-blue-600">
                        {app.final_score ? parseFloat(app.final_score).toFixed(4) : "-"}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => saveScore(app)}
                          className="btn btn-sm btn-primary text-white"
                        >
                          Simpan
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    Tidak ada data pelamar untuk program ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
                <span className="text-sm font-medium">IPK (GPA)</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Skill</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Motivasi</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ketersediaan Waktu</span>
                <span className="badge badge-neutral">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Komunikasi</span>
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

export default InternshipApplicants;
