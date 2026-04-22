import React, { useEffect, useState } from 'react';
import { Search, Filter, RefreshCcw, LayoutGrid, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await API.get("/task");

            setTasks(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch tasks failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks
        .filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                task.operation.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16 sm:mt-0">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Task Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor your AI processing tasks</p>
                </div>
                <Link to="/create" className="btn-primary self-start md:self-auto">
                    <Plus size={18} />
                    New Task
                </Link>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={18} />
                        </span>
                        <input 
                            type="text" 
                            placeholder="Search by title or operation..."
                            className="input-field pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-48">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Filter size={16} />
                            </span>
                            <select 
                                className="input-field pl-10 appearance-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em_1em]"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="running">Running</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        
                        <button 
                            onClick={fetchTasks}
                            className="btn-secondary p-2.5 h-[42px]"
                            title="Refresh tasks"
                        >
                            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-20">
                    <Loader size={48} />
                </div>
            ) : filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map(task => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LayoutGrid className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">No tasks found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-6">
                        {searchQuery || statusFilter !== 'all' 
                            ? "Try adjusting your filters or search query." 
                            : "Start by creating your first AI processing task."}
                    </p>
                    <Link to="/create" className="btn-primary inline-flex">
                        <Plus size={18} />
                        Create Task
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;