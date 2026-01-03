import React, { useState, useEffect } from "react";
import { api } from "../../../api/client";

const ApplicantsIndex = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetchApplicants(); // Uncomment when API is ready
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Pelamar Lowongan Kerja</h1>
        <p className="text-gray-500 text-sm">
          Kelola data pelamar dan hasil seleksi (SPK SAW).
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-user-search-line text-3xl"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Belum ada data pelamar</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          Fitur manajemen pelamar dan sistem pendukung keputusan (SPK SAW) sedang dalam pengembangan.
        </p>
        <button className="btn btn-primary">
          <i className="ri-settings-line mr-2"></i>
          Konfigurasi Kriteria SAW
        </button>
      </div>
    </div>
  );
};

export default ApplicantsIndex;
