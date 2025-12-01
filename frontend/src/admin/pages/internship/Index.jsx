import React, { useState } from "react";
// Pastikan path ini mengarah ke file layout yang benar
// Dari: src/admin/pages/internship/Index.jsx
// Ke:   src/admin/layouts/AdminLayout.jsx
import AdminLayout from "../../layouts/AdminLayout";

import HeroModal from "./components/HeroModal";
import CoreValuesModal from "./components/CoreValuesModal";
import TermsModal from "./components/TermsModal";
import FormationModal from "./components/FormationModal";
import FacilitiesModal from "./components/FacilitiesModal";

const InternshipIndex = () => {
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Manajemen Halaman Internship
        </h1>
        <p className="text-gray-500 text-sm">
          Kelola semua konten landing page program magang di sini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Hero Section */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <i className="ri-image-edit-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">1. Hero Section</h3>
              <p className="text-xs text-gray-500">Banner utama & Judul</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("hero")}
            className="btn btn-outline btn-primary btn-sm w-full"
          >
            Edit Konten Hero
          </button>
        </div>

        {/* 2. Core Values */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <i className="ri-diamond-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">2. Core Values</h3>
              <p className="text-xs text-gray-500">9 Nilai Inti</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("core")}
            className="btn btn-outline btn-secondary btn-sm w-full"
          >
            Edit Core Values
          </button>
        </div>

        {/* 3. Terms */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <i className="ri-file-list-3-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">3. Syarat & Ketentuan</h3>
              <p className="text-xs text-gray-500">List Persyaratan</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("terms")}
            className="btn btn-outline btn-warning btn-sm w-full"
          >
            Edit Syarat
          </button>
        </div>

        {/* 4. Formation */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <i className="ri-group-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">4. Formasi</h3>
              <p className="text-xs text-gray-500">18 Divisi Magang</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("formation")}
            className="btn btn-outline btn-accent btn-sm w-full"
          >
            Edit Formasi
          </button>
        </div>

        {/* 5. Facilities */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <i className="ri-cup-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">5. Fasilitas</h3>
              <p className="text-xs text-gray-500">Benefit Magang</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal("facilities")}
            className="btn btn-outline btn-error btn-sm w-full"
          >
            Edit Fasilitas
          </button>
        </div>
      </div>

      {/* Modals */}
      <HeroModal isOpen={activeModal === "hero"} onClose={closeModal} />
      <CoreValuesModal isOpen={activeModal === "core"} onClose={closeModal} />
      <TermsModal isOpen={activeModal === "terms"} onClose={closeModal} />
      <FormationModal
        isOpen={activeModal === "formation"}
        onClose={closeModal}
      />
      <FacilitiesModal
        isOpen={activeModal === "facilities"}
        onClose={closeModal}
      />
    </AdminLayout>
  );
};

export default InternshipIndex;
