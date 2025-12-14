import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { newsletterService, NewsletterSubscriber } from '../../services/newsletterService';

const SubscriberManager: React.FC = () => {
    const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ total: 0, active: 0 });
    const [copiedEmails, setCopiedEmails] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [allSubscribers, counts] = await Promise.all([
                newsletterService.getAll(),
                newsletterService.getCount(),
            ]);
            setSubscribers(allSubscribers);
            setStats(counts);
        } catch (error) {
            console.error('Error fetching subscribers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to delete ${email}?`)) return;
        try {
            await newsletterService.delete(id);
            await fetchData();
        } catch (error) {
            console.error('Error deleting subscriber:', error);
        }
    };

    const handleExportEmails = async () => {
        try {
            const emails = await newsletterService.exportEmails();
            const emailList = emails.join('\n');
            await navigator.clipboard.writeText(emailList);
            setCopiedEmails(true);
            setTimeout(() => setCopiedEmails(false), 3000);
        } catch (error) {
            console.error('Error exporting emails:', error);
        }
    };

    const handleDownloadCSV = () => {
        const filteredSubs = getFilteredSubscribers();
        const headers = ['Email', 'Name', 'Status', 'Source', 'Subscribed Date'];
        const rows = filteredSubs.map(s => [
            s.email,
            s.name || '',
            s.is_active ? 'Active' : 'Inactive',
            s.source,
            new Date(s.subscribed_at).toLocaleDateString(),
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const getFilteredSubscribers = () => {
        return subscribers.filter(sub => {
            const matchesStatus =
                filterStatus === 'all' ? true :
                    filterStatus === 'active' ? sub.is_active :
                        !sub.is_active;

            const matchesSearch =
                searchTerm === '' ? true :
                    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (sub.name?.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesStatus && matchesSearch;
        });
    };

    const filteredSubscribers = getFilteredSubscribers();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Manage and export your subscriber list
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportEmails}
                            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {copiedEmails ? 'check' : 'content_copy'}
                            </span>
                            {copiedEmails ? 'Copied!' : 'Copy Emails'}
                        </button>
                        <button
                            onClick={handleDownloadCSV}
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">download</span>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">group</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                                <p className="text-xs text-gray-500">Total Subscribers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                                <p className="text-xs text-gray-500">Active</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600 dark:text-red-400">cancel</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total - stats.active}</p>
                                <p className="text-xs text-gray-500">Unsubscribed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">percent</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}%
                                </p>
                                <p className="text-xs text-gray-500">Active Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    {/* Status Filter */}
                    <div className="flex gap-2">
                        {(['all', 'active', 'inactive'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="skeleton h-16 rounded-lg" />
                        ))}
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">mail</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No subscribers found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'Try a different search term' : 'Subscribers will appear here when users sign up'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscribed</th>
                                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredSubscribers.map(subscriber => (
                                        <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 dark:text-white font-medium">{subscriber.email}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 dark:text-gray-400">{subscriber.name || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {subscriber.is_active ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-full">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 dark:text-gray-400 text-sm capitalize">{subscriber.source}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(subscriber.subscribed_at)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(subscriber.id, subscriber.email)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default SubscriberManager;
