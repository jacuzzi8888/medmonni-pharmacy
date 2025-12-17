import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// Mock data for now until we have real orders
const MOCK_ORDERS = [
    {
        id: 'ord_123456',
        date: '2025-12-15',
        status: 'delivered',
        total: 15000,
        items: [
            { name: 'Vitamin C 1000mg', quantity: 2 },
            { name: 'Paracetamol', quantity: 1 }
        ]
    },
    {
        id: 'ord_789012',
        date: '2025-11-28',
        status: 'processing',
        total: 4500,
        items: [
            { name: 'Cough Syrup', quantity: 1 }
        ]
    }
];

const OrderHistory: React.FC = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrders(MOCK_ORDERS);
            setIsLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'processing': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    const handleReorder = (orderId: string) => {
        toast.success('Items added to cart');
        // Implement add to cart logic here
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h2>
                <p className="text-gray-600 dark:text-gray-400">View and track your past orders.</p>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.id}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        Placed on {new Date(order.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                                        ₦{order.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Items:</p>
                                <ul className="space-y-1">
                                    {order.items.map((item: any, idx: number) => (
                                        <li key={idx} className="text-sm text-gray-800 dark:text-gray-200 flex justify-between">
                                            <span>{item.quantity}x {item.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => handleReorder(order.id)}
                                    className="text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                                >
                                    Buy Again
                                </button>
                                <Link
                                    to={`/profile/orders/${order.id}`}
                                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">shopping_bag</span>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't placed any orders yet.</p>
                        <Link
                            to="/shop"
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-block"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
