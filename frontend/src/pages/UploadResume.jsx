import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a resume to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(true);
      // Force a hard redirect instead of SPA navigation to completely bust the cache
      // and prevent the user from needing to manually refresh the self-assessment.
      setTimeout(() => {
        window.location.href = '/self-assessment';
      }, 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Error uploading resume. Please try again.';
      setError(errorMsg);
      console.error("Upload error details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-apple border border-gray-100 dark:border-gray-700 p-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 mb-6 border border-primary-100 dark:border-primary-800/30 shadow-sm">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Upload Your Resume</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium">
            Let our AI Career Intelligence Engine build your Digital Twin profile.
          </p>
        </div>

        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 font-bold text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-5 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/30 flex items-center justify-center font-bold text-sm">
            <CheckCircle className="w-5 h-5 mr-3" />
            Resume processed successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleUpload}>
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-3xl px-6 py-16 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-750 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="cursor-pointer flex flex-col items-center w-full"
            >
              {file ? (
                <>
                  <FileText className="h-16 w-16 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{file.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-bold">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className="mt-6 text-sm text-primary-600 font-medium underline decoration-primary-600/30 underline-offset-4">Click to change file</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4 group-hover:text-primary-600 transition-colors" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Click to upload or drag and drop</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">PDF files up to 10MB</span>
                </>
              )}
            </label>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              disabled={loading || !file || success}
              className="w-full h-14 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw className="animate-spin h-5 w-5 mr-3" />
                  Processing (AI is analyzing your resume)...
                </span>
              ) : (
                'Generate Digital Twin'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
