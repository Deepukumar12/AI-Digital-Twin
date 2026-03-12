import React, { useState } from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ExportSection = ({ twin }) => {
    const [isResetting, setIsResetting] = useState(false);

    const handleDownloadPDF = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1500)),
            {
                loading: 'Preparing PDF...',
                success: 'PDF Ready! Triggering print layout.',
                error: 'Failed to generate PDF'
            }
        ).then(() => {
            window.print();
        });
    };

    const handleExportCSV = () => {
        toast.success('Preparing CSV Export...');

        // Frontend construction of CSV to save backend load
        const headers = ['Skill Name', 'Level', 'Confidence', 'Status'];

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n";

        // Active Skills
        twin?.technical_skills?.forEach(s => {
            csvContent += `${s.name},${s.level || 'Beginner'},${s.confidence || 50},Active\n`;
        });

        // Weaknesses
        twin?.weaknesses?.forEach(w => {
            csvContent += `${w},N/A,N/A,Missing/Weakness\n`;
        });

        // Ignored
        twin?.ignored_skills?.forEach(i => {
            csvContent += `${i},N/A,N/A,Ignored\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `twin_skills_export_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleResetProfile = async () => {
        if (!window.confirm("Are you sure? This will wipe all twin data and cannot be undone!")) return;
        setIsResetting(true);
        try {
            await api.post('/career/reset');
            toast.success('Digital Twin Reset successfully!');
            setTimeout(() => window.location.reload(), 1000);
        } catch (err) {
            toast.error('Failed to reset twin.');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="bg-card dark:bg-gray-800 p-8 rounded-3xl shadow-apple border border-gray-100/50 dark:border-gray-700 h-full flex flex-col justify-between">
            <div>
                <div>
                    <h3 className="text-3xl font-bold text-textPrimary dark:text-white mb-2 tracking-tight">Export Options</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide mb-8 italic">Download your career report and data.</p>
                </div>
            </div>

            <div className="space-y-4">
                <button
                    onClick={handleDownloadPDF}
                    className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-lg flex items-center transition-all border border-gray-100 dark:border-gray-700 shadow-sm group"
                >
                    <FileText className="h-5 w-5 mr-4 text-gray-400 group-hover:text-primary-600 transition-all" />
                    <span className="flex-1 text-left">Download PDF</span>
                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-primary-600 group-hover:translate-x-1 transition-all">→</span>
                </button>

                <button
                    onClick={handleExportCSV}
                    className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 font-bold px-5 py-4 rounded-lg flex items-center transition-all border border-gray-100 dark:border-gray-700 shadow-sm group"
                >
                    <Download className="h-5 w-5 mr-4 text-gray-400 group-hover:text-green-600 transition-all" />
                    <span className="flex-1 text-left">Download CSV</span>
                    <span className="text-gray-400 dark:text-gray-500 group-hover:text-green-600 group-hover:translate-x-1 transition-all">→</span>
                </button>

                <div className="pt-6 mt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={handleResetProfile}
                        disabled={isResetting}
                        className="w-full bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-500 font-bold px-5 py-4 rounded-lg flex items-center justify-center transition-all border border-red-200 dark:border-red-800/30 disabled:opacity-50"
                    >
                        {isResetting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 dark:border-red-500 mr-2"></div> : <Trash2 className="h-5 w-5 mr-2" />}
                        Reset Digital Twin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportSection;
