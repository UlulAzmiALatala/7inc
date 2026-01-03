import React, { useState } from "react";

const VacanciesContent = () => {
  // Placeholder untuk manajemen konten (Hero, Banner, dll)
  // Nanti bisa dikembangkan dengan HeroModal dsb.
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Konten Halaman Lowongan</h1>
        <p className="text-gray-500 text-sm">
          Kelola elemen visual dan konten pada halaman utama Lowongan Kerja.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hero Section Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <i className="ri-image-edit-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Hero Section</h3>
              <p className="text-xs text-gray-500">Banner & Judul Utama</p>
            </div>
          </div>
          <button className="btn btn-outline btn-primary btn-sm w-full" disabled>
            Edit Hero (Coming Soon)
          </button>
        </div>

        {/* Benefits Section Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <i className="ri-thumb-up-line text-2xl"></i>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Keuntungan</h3>
              <p className="text-xs text-gray-500">Why Join Us?</p>
            </div>
          </div>
          <button className="btn btn-outline btn-success btn-sm w-full" disabled>
            Edit Keuntungan (Coming Soon)
          </button>
        </div>
      </div>
    </>
  );
};

export default VacanciesContent;
