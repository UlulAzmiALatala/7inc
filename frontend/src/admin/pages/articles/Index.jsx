import React, { useState, useEffect } from "react";
import { api } from "../../../api/client";
import ArticleReviewTable from "../../components/ArticleReviewTable";
import ArticleReviewModal from "../../components/ArticleReviewModal";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/articles?status=${activeTab}`);
      // Handle pagination response structure if needed (response.data.data or response.data)
      setArticles(response.data.data || response.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewArticle = (article) => {
    setSelectedArticle(article);
    setShowReviewModal(true);
  };

  const handleApprove = async (articleId, displaySettings) => {
    try {
      await api.put(`/api/admin/articles/${articleId}`, {
        status: "published",
        is_hero: displaySettings.is_hero,
        is_featured: displaySettings.is_featured,
        display_order: displaySettings.display_order,
        assignment_position: displaySettings.assignment_section, // Map section to assignment_position
      });

      setShowReviewModal(false);
      fetchArticles();
    } catch (error) {
      console.error("Error approving article:", error);
      alert("Gagal menyetujui artikel.");
    }
  };

  const handleReject = async (articleId, reason) => {
    try {
      await api.put(`/api/admin/articles/${articleId}`, {
        status: "rejected",
        rejection_reason: reason,
      });

      setShowReviewModal(false);
      fetchArticles();
    } catch (error) {
      console.error("Error rejecting article:", error);
      alert("Gagal menolak artikel.");
    }
  };

  return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
            <p className="text-gray-500 mt-1">
              Manage artikel dari writer, review, publish, dan atur tampilan
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          {[
            { id: "pending", label: "Pending Review", icon: "ri-time-line" },
            { id: "published", label: "Published", icon: "ri-check-double-line" },
            { id: "rejected", label: "Rejected", icon: "ri-close-line" },
            { id: "draft", label: "Draft", icon: "ri-draft-line" }, // Added Draft tab
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className={`${tab.icon} text-lg`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin">
              <i className="ri-loader-4-line text-4xl text-blue-600"></i>
            </div>
          </div>
        ) : articles.length > 0 ? (
          <ArticleReviewTable
            articles={articles}
            activeTab={activeTab}
            onReview={handleReviewArticle}
          />
        ) : (
          <div className="text-center py-12">
            <i className="ri-inbox-2-line text-5xl text-gray-300 block mb-3"></i>
            <p className="text-gray-500">Tidak ada artikel {activeTab}</p>
          </div>
        )}

      {/* Review Modal */}
      {showReviewModal && selectedArticle && (
        <ArticleReviewModal
          article={selectedArticle}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

export default ArticleList;
