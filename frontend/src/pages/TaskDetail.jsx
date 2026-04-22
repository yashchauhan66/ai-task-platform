import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Code, Activity, Terminal, CheckCircle2, AlertCircle, Loader2, Calendar } from "lucide-react";
import { format } from 'date-fns';
import API from "../services/api";
import Loader from "../components/Loader";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = React.useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const res = await API.get(`/task/${id}`);

      setTask(res.data.task);
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [id]);

  
  useEffect(() => {
    fetchTask(true);
  }, [fetchTask]);


  const taskStatus = task?.status;

  useEffect(() => {
    if (!taskStatus || (taskStatus !== 'pending' && taskStatus !== 'running')) {
      return;
    }

    const interval = setInterval(() => {
      fetchTask();
    }, 1000); 
    return () => clearInterval(interval);
  }, [fetchTask, taskStatus]);

  if (loading) return <Loader fullPage />;
  if (!task) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <AlertCircle size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Task not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4">Go Back</button>
    </div>
  );

  const getStatusConfig = (status) => {
    switch (status) {
      case 'success':
        return { 
            color: 'bg-green-100 text-green-700 border-green-200', 
            icon: <CheckCircle2 size={20} />, 
            label: 'Task Completed' 
        };
      case 'failed':
        return { 
            color: 'bg-red-100 text-red-700 border-red-200', 
            icon: <AlertCircle size={20} />, 
            label: 'Task Failed' 
        };
      case 'running':
        return { 
            color: 'bg-blue-100 text-blue-700 border-blue-200', 
            icon: <Loader2 size={20} className="animate-spin" />, 
            label: 'Processing...' 
        };
      default:
        return { 
            color: 'bg-amber-100 text-amber-700 border-amber-200', 
            icon: <Clock size={20} />, 
            label: 'In Queue' 
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-0">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="space-y-6">
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2 text-primary-600 font-medium text-sm mb-1 uppercase tracking-wider">
                        <Code size={16} />
                        {task.operation}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold ${statusConfig.color}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={16} />
                    Created: {task.createdAt ? format(new Date(task.createdAt), 'PPpp') : 'N/A'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Activity size={16} />
                    ID: <span className="font-mono text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border">{task._id}</span>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Terminal size={16} />
                        Input Content
                    </h3>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 min-h-[150px] text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {task.input}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Processing Logs</h3>
                    <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl overflow-x-auto min-h-[100px]">
                        {task.logs ? (
                            <div className="flex items-start gap-2">
                                <span className="text-green-500">{'>'}</span>
                                {task.logs}
                            </div>
                        ) : (
                            <div className="text-slate-600 italic italic">No logs available for this status...</div>
                        )}
                        {task.status === 'running' && (
                            <div className="mt-2 animate-pulse flex items-center gap-2">
                                <span className="text-blue-400 font-bold">{'>'}</span>
                                <span>Executing AI operations...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <div className="bg-white rounded-2xl shadow-sm border-2 border-primary-100 p-6 flex flex-col h-full ring-4 ring-primary-50/50">
                <h3 className="text-sm font-bold text-primary-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Processed Result
                </h3>
                {task.status === 'success' ? (
                    <div className="flex-1 bg-primary-50/50 rounded-xl p-6 border border-primary-100 flex flex-col items-center justify-center text-center">
                        <div className="text-slate-800 text-xl font-semibold leading-relaxed">
                            {task.result}
                        </div>
                        <div className="mt-8 text-[10px] text-slate-400 uppercase tracking-tighter">
                            Verified AI Output
                        </div>
                    </div>
                ) : task.status === 'failed' ? (
                    <div className="flex-1 bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="text-red-400 mb-2" size={32} />
                        <div className="text-red-700 font-medium italic">
                            Processing was interrupted or failed.
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center">
                        <Loader2 className="animate-spin text-slate-300 mb-4" size={32} />
                        <div className="text-slate-400 font-medium">
                            Result will appear once processing is complete.
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;