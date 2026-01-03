import React from "react";

const ArticleReviewTable = ({ articles, activeTab, onReview }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <span className="badge badge-success badge-sm">Published</span>;
      case "pending":
        return <span className="badge badge-warning badge-sm">Pending</span>;
      case "rejected":
        return <span className="badge badge-error badge-sm">Rejected</span>;
      default:
        return <span className="badge badge-ghost badge-sm">{status}</span>;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="table w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="w-16">No</th>
            <th>Judul Artikel</th>
            <th>Penulis</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th className="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
              <td className="font-medium text-gray-500">{index + 1}</td>
              <td>
                <div className="font-bold text-gray-900 line-clamp-1">
                  {article.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {article.excerpt || "Tidak ada kutipan"}
                </div>
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                      <span className="text-xs">
                        {article.author?.name?.substring(0, 2).toUpperCase() || "WR"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">
                      {article.author?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">Writer</div>
                  </div>
                </div>
              </td>
              <td className="text-sm text-gray-500">
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td>{getStatusBadge(article.status)}</td>
              <td className="text-right">
                <button
                  onClick={() => onReview(article)}
                  className="btn btn-sm btn-primary btn-outline gap-2"
                >
                  <i className="ri-eye-line"></i>
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleReviewTable;
