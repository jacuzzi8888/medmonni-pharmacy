import React, { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

interface SharePopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    text?: string;
    url: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ isOpen, onClose, title, text, url }) => {
    const toast = useToast();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.55C8.76 21.36 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 6.45 17.5 2 12.04 2M12.04 3.67C16.56 3.67 20.28 7.39 20.28 11.91C20.28 16.43 16.56 20.15 12.04 20.15C10.56 20.15 9.14 19.74 7.91 19L7.31 18.66L4.2 19.56L5.12 16.55L4.85 15.93C4.1 14.63 3.79 13.25 3.79 11.91C3.79 7.39 7.52 3.67 12.04 3.67" />
                </svg>
            ),
            color: 'bg-[#25D366] hover:bg-[#20BD5A]',
            getUrl: () => `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
        },
        {
            name: 'X (Twitter)',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: 'bg-black hover:bg-gray-800',
            getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        },
        {
            name: 'Facebook',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
            ),
            color: 'bg-[#1877F2] hover:bg-[#166FE5]',
            getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: 'Email',
            icon: <span className="material-symbols-outlined text-2xl">mail</span>,
            color: 'bg-gray-600 hover:bg-gray-700',
            getUrl: () => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text || ''}\n\n${url}`)}`,
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const handleShare = (getUrl: () => string) => {
        window.open(getUrl(), '_blank', 'noopener,noreferrer,width=600,height=400');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Popup */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 fade-in duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">Share Article</h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Share Options */}
                <div className="p-4">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={() => handleShare(option.getUrl)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-all hover:scale-105 ${option.color}`}
                                title={`Share on ${option.name}`}
                            >
                                {option.icon}
                                <span className="text-[10px] font-medium">{option.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Copy Link */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <div className="flex-1 truncate text-sm text-gray-600 dark:text-gray-300 font-mono">
                            {url}
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${copied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharePopup;
