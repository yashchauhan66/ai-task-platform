import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Type, Settings, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import API from '../services/api';

const CreateTask = () => {
    const [formData, setFormData] = useState({ title: '', input: '', operation: 'uppercase' });
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/task", formData);
            setShowSuccess(true);
            setTimeout(() => {
                navigate(`/task/${res.data.task._id}`);
            }, 1500);
        } catch (error) {
            console.error("Task creation failed:", error);
            alert("Failed to create task. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <div className="text-center animate-in fade-in zoom-in duration-300">
                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Task Created!</h2>
                    <p className="text-slate-500">Redirecting to task details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-0">
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
            >
                <ArrowLeft size={16} />
                Back to Dashboard
            </button>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Task</h1>
                <p className="text-slate-500 mt-1">Configure an AI operation to process your text data</p>
            </header>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <FileText size={18} className="text-primary-500" />
                            Task Title
                        </label>
                        <input 
                            type="text" 
                            required
                            placeholder='e.g., Customer Reviews Analysis' 
                            className="input-field py-3 text-lg"
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <p className="text-xs text-slate-400 italic">Give your task a descriptive name to find it later.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Settings size={18} className="text-primary-500" />
                                Operation Type
                            </label>
                            <select 
                                className="input-field py-3 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25em_1.25em]"
                                value={formData.operation} 
                                onChange={(e) => setFormData({...formData, operation: e.target.value})}
                            >
                                <option value="uppercase">Text to Uppercase</option>
                                <option value="lowercase">Text to Lowercase</option>
                                <option value="reverse">Reverse String</option>
                                <option value="wordcount">Count Words</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Type size={18} className="text-primary-500" />
                            Input Content
                        </label>
                        <textarea 
                            required
                            placeholder='Enter the text you want to process...' 
                            rows={6}
                            className="input-field py-3 resize-none"
                            value={formData.input} 
                            onChange={(e) => setFormData({...formData, input: e.target.value})}
                        />
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary flex-1 py-4 text-lg"
                        >
                            {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <PlusCircle size={20} />}
                            {loading ? 'Submitting task...' : 'Start Processing'}
                        </button>
                        <button 
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="btn-secondary px-8"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;