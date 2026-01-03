import React, { useState, useEffect } from "react";
import { api } from "../../api/client.js";
import ArticleReviewTable from "../components/ArticleReviewTable";
import ArticleReviewModal from "../components/ArticleReviewModal";

const KelolaBerta = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      let endpoint = "/api/admin/articles";
      
      if (activeTab === "pending") {
        endpoint += "/review/pending";
      } else if (activeTab === "published") {
        endpoint += "?status=published";
      } else if (activeTab === "rejected") {
        endpoint += "?status=rejected";
      }

      const response = await api.get(endpoint);
      setArticles(response.data.articles || response.data.data || []);
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
      await api.post(`/api/admin/articles/${articleId}/approve`, {
        is_hero: displaySettings.is_hero,
        is_featured: displaySettings.is_featured,
        display_order: displaySettings.display_order,
        assignment_section: displaySettings.assignment_section,
      });

      setShowReviewModal(false);
      fetchArticles();
    } catch (error) {
      console.error("Error approving article:", error);
    }
  };

  const handleReject = async (articleId, reason) => {
    try {
      await api.post(`/api/admin/articles/${articleId}/reject`, {
        rejection_reason: reason,
      });

      setShowReviewModal(false);
      fetchArticles();
    } catch (error) {
      console.error("Error rejecting article:", error);
    }
  };

  return (
    <div className="space-y-6">
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

export default KelolaBerta;
