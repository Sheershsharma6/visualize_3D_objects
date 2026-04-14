import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".glb")) {
      setFile(selectedFile);
    } else {
      alert("Please select a valid .glb file");
      e.target.value = null;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file first!");

    // 1. Get the REAL ID of the logged-in user
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Session expired. Please login again.");
      return navigate("/login");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId); // 2. Attach the real ID here

    setUploading(true);
    try {
      await axios.post("http://localhost:5000/api/objects/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload Successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 px-4">
      <div className="w-full max-w-lg bg-neutral-800 p-10 rounded-3xl shadow-2xl border border-neutral-700">
        <h2 className="text-3xl font-bold text-white mb-2">Upload 3D Asset</h2>
        <p className="text-neutral-400 mb-8">
          Files will be stored securely on AWS S3
        </p>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="group relative border-2 border-dashed border-neutral-600 hover:border-blue-500 rounded-2xl p-12 transition-all text-center bg-neutral-900/50">
            <input
              type="file"
              accept=".glb"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-neutral-300 font-medium">
                {file ? file.name : "Click or drag .glb file here"}
              </p>
              <p className="text-xs text-neutral-500">
                Maximum file size: 50MB
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 px-6 py-3 rounded-xl border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-all font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !file}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                uploading
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {uploading ? "Uploading..." : "Confirm Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
