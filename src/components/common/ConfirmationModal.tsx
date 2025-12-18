import React, { useEffect } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    isLoading = false
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: 'report_problem',
                    iconColor: 'text-red-500',
                    buttonBg: 'bg-red-600 hover:bg-red-700',
                    borderColor: 'border-red-200 dark:border-red-900/30'
                };
            case 'warning':
                return {
                    icon: 'warning',
                    iconColor: 'text-yellow-500',
                    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
                    borderColor: 'border-yellow-200 dark:border-yellow-900/30'
                };
            default:
                return {
                    icon: 'info',
                    iconColor: 'text-primary',
                    buttonBg: 'bg-primary hover:bg-primary/90',
                    borderColor: 'border-primary/20 dark:border-primary/90'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-2xl transition-all duration-300 border ${styles.borderColor} animate-in fade-in zoom-in duration-300`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconColor} bg-opacity-10 flex items-center justify-center bg-current`}>
                        <span className="material-symbols-outlined text-2xl">{styles.icon}</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-6">
                            {title}
                        </h3>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {message}
                    </p>
                </div>

                <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-all duration-200"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className={`inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none transition-all duration-200 ${styles.buttonBg} disabled:opacity-50`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
