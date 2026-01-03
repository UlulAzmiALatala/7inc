import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

const ArticleReviewModal = ({ article, onApprove, onReject, onClose }) => {
  const [activeTab, setActiveTab] = useState("preview"); // preview | action
  const [rejectReason, setRejectReason] = useState("");
  const [displaySettings, setDisplaySettings] = useState({
    is_hero: article.is_hero || false,
    is_featured: article.is_featured || false,
    display_order: article.display_order || 0,
    assignment_section: article.assignment_position || "",
  });

  // Reset state when article changes
  useEffect(() => {
    if (article) {
      setDisplaySettings({
        is_hero: article.is_hero || false,
        is_featured: article.is_featured || false,
        display_order: article.display_order || 0,
        assignment_section: article.assignment_position || "",
      });
      setRejectReason("");
      setActiveTab("preview");
    }
  }, [article]);

  if (!article) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Review Artikel</h3>
            <p className="text-sm text-gray-500">ID: {article.id} • Oleh {article.author?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost hover:bg-gray-200"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white px-4">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "preview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="ri-article-line mr-2"></i>
            Preview Konten
          </button>
          <button
            onClick={() => setActiveTab("action")}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "action"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <i className="ri-settings-3-line mr-2"></i>
            Tindakan & Pengaturan
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "preview" ? (
            <div className="bg-white p-8 rounded-lg shadow-sm max-w-3xl mx-auto">
              {article.featured_image && (
                <img
                  src={article.featured_image}
                  alt={article.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 border-b pb-4">
                <span>
                  <i className="ri-calendar-line mr-1"></i>
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span>
                  <i className="ri-user-line mr-1"></i>
                  {article.author?.name}
                </span>
                <span className={`badge ${article.status === 'published' ? 'badge-success' : 'badge-ghost'} badge-sm`}>
                  {article.status}
                </span>
              </div>
              <div
                className="prose prose-lg max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Approve / Publish Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100">
                <div className="flex items-center gap-2 mb-4 text-green-700 border-b border-green-100 pb-2">
                  <i className="ri-check-double-line text-xl"></i>
                  <h4 className="font-bold">Setujui & Terbitkan</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={displaySettings.is_hero}
                        onChange={(e) =>
                          setDisplaySettings({
                            ...displaySettings,
                            is_hero: e.target.checked,
                          })
                        }
                      />
                      <span className="label-text font-medium">Jadikan Hero Section</span>
                    </label>
                    <p className="text-xs text-gray-500 ml-8">Artikel akan tampil di slider utama beranda.</p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary checkbox-sm"
                        checked={displaySettings.is_featured}
                        onChange={(e) =>
                          setDisplaySettings({
                            ...displaySettings,
                            is_featured: e.target.checked,
                          })
                        }
                      />
                      <span className="label-text font-medium">Artikel Pilihan (Featured)</span>
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Urutan Tampil</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered input-sm w-full"
                      value={displaySettings.display_order}
                      onChange={(e) =>
                        setDisplaySettings({
                          ...displaySettings,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Assignment Section</span>
                    </label>
                    <select
                      className="select select-bordered select-sm w-full"
                      value={displaySettings.assignment_section}
                      onChange={(e) =>
                        setDisplaySettings({
                          ...displaySettings,
                          assignment_section: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Tidak Ada --</option>
                      <option value="about_us">Tentang Kami</option>
                      <option value="business_lines">Bisnis Kami</option>
                      <option value="contact">Kontak</option>
                      <option value="news_highlight">Highlight Berita</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Assign artikel ini sebagai konten untuk section statis tertentu.</p>
                  </div>

                  <button
                    onClick={() => onApprove(article.id, displaySettings)}
                    className="btn btn-success w-full text-white mt-4"
                  >
                    <i className="ri-check-line mr-2"></i>
                    Approve & Publish
                  </button>
                </div>
              </div>

              {/* Reject Settings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 h-fit">
                <div className="flex items-center gap-2 mb-4 text-red-700 border-b border-red-100 pb-2">
                  <i className="ri-close-circle-line text-xl"></i>
                  <h4 className="font-bold">Tolak Artikel</h4>
                </div>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Alasan Penolakan</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered h-32 w-full"
                      placeholder="Jelaskan mengapa artikel ini ditolak..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    onClick={() => onReject(article.id, rejectReason)}
                    className="btn btn-error btn-outline w-full"
                    disabled={!rejectReason.trim()}
                  >
                    <i className="ri-close-line mr-2"></i>
                    Reject Article
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ArticleReviewModal;
