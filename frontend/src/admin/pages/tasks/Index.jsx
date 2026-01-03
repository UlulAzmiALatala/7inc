import React, { useState, useEffect } from "react";
import { api } from "../../../api/client";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    target_section: "",
    priority: "medium",
    deadline: "",
    assigned_to: "", // user_id
  });

  const [writers, setWriters] = useState([]);

  // Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/admin/tasks");
      setTasks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/tasks", newTask);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      alert("Gagal membuat tugas");
    }
  };

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Task Management (Berita & Artikel)</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            + Tambah Tugas
          </button>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{task.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    task.priority === 'high' ? 'bg-red-900 text-red-200' :
                    task.priority === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{task.description}</p>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Target: <span className="text-gray-300">{task.target_section}</span></p>
                  <p>Deadline: <span className="text-gray-300">{task.deadline}</span></p>
                  <p>Assigned To: <span className="text-gray-300">{task.assigned_to?.name || task.assigned_to}</span></p>
                  <p>Status: <span className={`uppercase font-bold ${
                    task.status === 'completed' ? 'text-green-500' : 'text-blue-500'
                  }`}>{task.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Create Task */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-white mb-4">Buat Tugas Baru</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Judul Tugas" 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  required
                />
                <textarea 
                  placeholder="Deskripsi" 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Target Section (e.g. Hero)" 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.target_section}
                  onChange={(e) => setNewTask({...newTask, target_section: e.target.value})}
                />
                <select 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input 
                  type="date" 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                />
                <input 
                  type="number" 
                  placeholder="ID Writer (User ID)" 
                  className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({...newTask, assigned_to: e.target.value})}
                  required
                />
                
                <div className="flex justify-end gap-2 mt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

export default TaskList;
