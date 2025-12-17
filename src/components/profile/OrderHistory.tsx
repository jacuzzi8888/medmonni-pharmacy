import React, { useState } from 'react';

// Mock order data - in production, this would come from Supabase
const MOCK_ORDERS = [
    {
        id: 'ORD-2024-001',
        date: '2024-12-15',
        status: 'delivered',
        total: 15500,
        items: [
            { name: 'Vitamin C 1000mg', quantity: 2, price: 4500 },
            { name: 'Paracetamol Extra', quantity: 1, price: 1500 },
            { name: 'First Aid Kit', quantity: 1, price: 5000 }
        ]
    },
    {
        id: 'ORD-2024-002',
        date: '2024-12-10',
        status: 'processing',
        total: 8500,
        items: [
            { name: 'Blood Pressure Monitor', quantity: 1, price: 8500 }
        ]
    }
];

const OrderHistory: React.FC = () => {
    const [orders] = useState(MOCK_ORDERS);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'processing': return 'bg-blue-100 text-blue-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return 'check_circle';
            case 'processing': return 'pending';
            case 'shipped': return 'local_shipping';
            case 'cancelled': return 'cancel';
            default: return 'help';
        }
    };

    const formatPrice = (price: number) => {
        return `₦${price.toLocaleString()}`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">
                        shopping_bag
                    </span>
                    <p className="text-gray-500">No orders yet</p>
                    <a href="/shop" className="mt-4 inline-block text-primary font-medium hover:underline">
                        Start shopping
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                        >
                            {/* Order Header */}
                            <div
                                className="p-4 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{order.id}</p>
                                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                            <span className="material-symbols-outlined text-sm">{getStatusIcon(order.status)}</span>
                                            {order.status}
                                        </span>
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {formatPrice(order.total)}
                                        </span>
                                        <span className={`material-symbols-outlined text-gray-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details (Expanded) */}
                            {expandedOrder === order.id && (
                                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="space-y-3 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                                                    <span className="text-sm text-gray-400">x{item.quantity}</span>
                                                </div>
                                                <span className="text-gray-900 dark:text-white font-medium">
                                                    {formatPrice(item.price)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                            <span className="material-symbols-outlined text-lg">refresh</span>
                                            Reorder
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <span className="material-symbols-outlined text-lg">receipt_long</span>
                                            Download Invoice
                                        </button>
                                        {order.status === 'shipped' && (
                                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <span className="material-symbols-outlined text-lg">location_on</span>
                                                Track Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Information Note */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500">info</span>
                <div>
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> Orders are processed via Paystack. For order issues, please contact us at{' '}
                        <a href="tel:+2347052350000" className="underline">07052350000</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
