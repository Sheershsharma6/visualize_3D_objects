import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Viewer3D from "./Viewer3D";
import API from "../api";
const Dashboard = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Retrieve user info from localStorage

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchModels = async () => {
      const currentId = localStorage.getItem("userId");
      if (!currentId) return; // Don't fetch if no ID exists

      try {
        const res = await API.get(`/objects/user/${userId}`);
        setModels(res.data);
        if (res.data.length > 0) setSelectedModel(res.data[0].s3Url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, []); // Runs once on mount

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 bg-neutral-900/50">
          <h1 className="text-2xl font-black text-blue-500 tracking-tighter">
            3D_WORKSPACE
          </h1>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 truncate">
            User: {userEmail || "Authenticated"}
          </p>
        </div>

        {/* Model List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Library
            </h3>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">
              {models.length} Assets
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-neutral-800/50 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-neutral-500 text-sm">No models found.</p>
              <p className="text-[10px] text-neutral-600 mt-2">
                Upload a .glb file to get started.
              </p>
            </div>
          ) : (
            <nav className="space-y-3">
              {models.map((model) => (
                <button
                  key={model._id}
                  onClick={() => setSelectedModel(model.s3Url)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 group relative border ${
                    selectedModel === model.s3Url
                      ? "bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                      : "bg-neutral-800/30 border-transparent hover:border-neutral-700 hover:bg-neutral-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${selectedModel === model.s3Url ? "bg-blue-500" : "bg-neutral-700"}`}
                    >
                      <span className="text-lg">📦</span>
                    </div>
                    <div className="truncate">
                      <div
                        className={`font-bold text-sm truncate ${selectedModel === model.s3Url ? "text-blue-400" : "text-neutral-200"}`}
                      >
                        {model.fileName}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        GLTF Binary (.glb)
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-sm space-y-3">
          <button
            onClick={() => navigate("/upload")}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-extrabold transition-all shadow-lg active:scale-95"
          >
            + New Upload
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-transparent hover:bg-red-500/10 text-neutral-500 hover:text-red-400 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative bg-black">
        {selectedModel ? (
          <div className="w-full h-full">
            <Viewer3D modelUrl={selectedModel} />
          </div>
        ) : loading ? (
          // Show spinner ONLY while fetching from DB
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin" />
            <p className="text-neutral-500 tracking-widest uppercase text-[10px] font-bold">
              Fetching Library...
            </p>
          </div>
        ) : (
          // Show this if loading is finished but there are no models
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="text-5xl mb-4">☁️</div>
            <h2 className="text-xl font-bold text-neutral-400">
              Your Workspace is Empty
            </h2>
            <p className="text-neutral-600 text-sm mt-1 max-w-xs">
              Click the "+ New Upload" button to add your first 3D model to the
              cloud.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
