import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Code, Clock, CheckCircle2, XCircle, Loader2, ChevronRight } from 'lucide-react';

const TaskCard = ({ task }) => {
    const navigate = useNavigate();

    const getStatusStyles = (status) => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'failed':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'running':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'pending':
            default:
                return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 size={14} />;
            case 'failed':
                return <XCircle size={14} />;
            case 'running':
                return <Loader2 size={14} className="animate-spin" />;
            case 'pending':
            default:
                return <Clock size={14} />;
        }
    };

    return (
        <div 
            onClick={() => navigate(`/task/${task._id}`)}
            className="card p-5 cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {task.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Code size={12} />
                        <span>{task.operation}</span>
                    </div>
                </div>
                <div className={`badge flex items-center gap-1 border ${getStatusStyles(task.status)}`}>
                    {getStatusIcon(task.status)}
                    {task.status}
                </div>
            </div>

            <div className="mb-4">
                <p className="text-sm text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded border border-slate-100 break-words">
                    {task.input}
                </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    {task.createdAt ? formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }) : 'N/A'}
                </span>
                <span className="text-primary-600 text-xs font-medium flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    View Details
                    <ChevronRight size={14} />
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
