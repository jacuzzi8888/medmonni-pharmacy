import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { feedbackService, Feedback } from '../../services/feedbackService';

const FeedbackManager: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const data = await feedbackService.getAll();
            setFeedbacks(data);
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredFeedbacks = filter === 'all'
        ? feedbacks
        : feedbacks.filter(f => f.status === filter);

    const handleStatusChange = async (id: string, status: Feedback['status']) => {
        try {
            await feedbackService.update(id, { status });
            fetchFeedbacks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feedback?')) return;
        try {
            await feedbackService.delete(id);
            fetchFeedbacks();
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    };

    const handleToggleFeatured = async (feedback: Feedback) => {
        try {
            await feedbackService.toggleFeatured(feedback.id, !feedback.is_featured);
            fetchFeedbacks();
        } catch (error) {
            console.error('Error toggling featured:', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'suggestion': return 'lightbulb';
            case 'complaint': return 'report_problem';
            case 'praise': return 'thumb_up';
            case 'question': return 'help';
            case 'bug': return 'bug_report';
            default: return 'chat';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'suggestion': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
            case 'complaint': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
            case 'praise': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
            case 'question': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/30';
            case 'bug': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/30';
            default: return 'text-gray-500 bg-gray-100';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-primary/10 text-primary';
            case 'read': return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
            case 'responded': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'archived': return 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-NG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusCounts = {
        all: feedbacks.length,
        new: feedbacks.filter(f => f.status === 'new').length,
        read: feedbacks.filter(f => f.status === 'read').length,
        responded: feedbacks.filter(f => f.status === 'responded').length,
        archived: feedbacks.filter(f => f.status === 'archived').length,
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback</h1>
                        <p className="text-gray-500 dark:text-gray-400">Customer messages and suggestions</p>
                    </div>
                    {statusCounts.new > 0 && (
                        <span className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                            {statusCounts.new} new
                        </span>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {Object.entries(statusCounts).map(([status, count]) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === status
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                        </button>
                    ))}
                </div>

                {/* Feedback List */}
                {loading ? (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-4xl text-gray-400 animate-spin">progress_activity</span>
                        <p className="text-gray-500 mt-2">Loading feedback...</p>
                    </div>
                ) : filteredFeedbacks.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">forum</span>
                        <p className="text-gray-500 mt-2">No feedback found</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredFeedbacks.map((feedback) => (
                            <div
                                key={feedback.id}
                                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${feedback.status === 'new' ? 'ring-2 ring-primary/20' : ''
                                    }`}
                            >
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    {/* Left: Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`p-2 rounded-lg ${getTypeColor(feedback.type)}`}>
                                                <span className="material-symbols-outlined text-xl">{getTypeIcon(feedback.type)}</span>
                                            </span>
                                            <div>
                                                <span className={`text-xs font-bold uppercase ${getTypeColor(feedback.type).split(' ')[0]}`}>
                                                    {feedback.type}
                                                </span>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {feedback.name && <span>{feedback.name}</span>}
                                                    {feedback.email && <span>• {feedback.email}</span>}
                                                </div>
                                            </div>
                                            <span className={`ml-auto px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                                {feedback.status}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 dark:text-gray-300 mb-3">{feedback.message}</p>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {formatDate(feedback.created_at)}
                                            </span>
                                            {feedback.rating && (
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px] text-yellow-500">star</span>
                                                    {feedback.rating}/5
                                                </span>
                                            )}
                                            {feedback.page_url && (
                                                <span className="flex items-center gap-1 truncate max-w-[200px]">
                                                    <span className="material-symbols-outlined text-[14px]">link</span>
                                                    {feedback.page_url}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2">
                                        {feedback.status === 'new' && (
                                            <button
                                                onClick={() => handleStatusChange(feedback.id, 'read')}
                                                className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Mark as Read"
                                            >
                                                <span className="material-symbols-outlined">mark_email_read</span>
                                            </button>
                                        )}
                                        {(feedback.status === 'new' || feedback.status === 'read') && (
                                            <button
                                                onClick={() => handleStatusChange(feedback.id, 'responded')}
                                                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                                title="Mark as Responded"
                                            >
                                                <span className="material-symbols-outlined">reply</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleStatusChange(feedback.id, 'archived')}
                                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            title="Archive"
                                        >
                                            <span className="material-symbols-outlined">archive</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feedback.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                        {feedback.rating && feedback.rating >= 4 && (
                                            <button
                                                onClick={() => handleToggleFeatured(feedback)}
                                                className={`p-2 rounded-lg transition-colors ${feedback.is_featured ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'}`}
                                                title={feedback.is_featured ? 'Remove from Homepage' : 'Feature on Homepage'}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontVariationSettings: feedback.is_featured ? '"FILL" 1' : '"FILL" 0' }}>star</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default FeedbackManager;
