import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

// Mock data (same as OrderHistory for consistency)
const MOCK_ORDERS: Record<string, any> = {
    'ord_123456': {
        id: 'ord_123456',
        date: '2025-12-15',
        status: 'delivered',
        total: 15000,
        subtotal: 14000,
        shipping: 1000,
        payment_method: 'Card (**** 1234)',
        items: [
            { name: 'Vitamin C 1000mg', quantity: 2, price: 5000, total: 10000 },
            { name: 'Paracetamol', quantity: 1, price: 4000, total: 4000 }
        ],
        shipping_address: {
            street: '1 Niyi Okunubi Street',
            city: 'Lekki Phase 1',
            state: 'Lagos',
            country: 'Nigeria'
        },
        tracking_updates: [
            { status: 'Delivered', date: '2025-12-16 14:30', description: 'Package delivered to recipient' },
            { status: 'Out for Delivery', date: '2025-12-16 09:00', description: 'Rider is on the way' },
            { status: 'Shipped', date: '2025-12-15 18:00', description: 'Package has left our facility' },
            { status: 'Processing', date: '2025-12-15 10:00', description: 'Order confirmed and processing' }
        ]
    },
    'ord_789012': {
        id: 'ord_789012',
        date: '2025-11-28',
        status: 'processing',
        total: 4500,
        subtotal: 3500,
        shipping: 1000,
        payment_method: 'Bank Transfer',
        items: [
            { name: 'Cough Syrup', quantity: 1, price: 3500, total: 3500 }
        ],
        shipping_address: {
            street: '123 Health Avenue',
            city: 'Ikeja',
            state: 'Lagos',
            country: 'Nigeria'
        },
        tracking_updates: [
            { status: 'Processing', date: '2025-11-28 10:00', description: 'Order confirmed and processing' }
        ]
    }
};

const OrderDetails: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            if (orderId && MOCK_ORDERS[orderId]) {
                setOrder(MOCK_ORDERS[orderId]);
            }
            setIsLoading(false);
        }, 800);
    }, [orderId]);

    const handleDownloadInvoice = () => {
        toast.success('Downloading invoice...');
        // Implement PDF generation/download logic here
    };

    const handleReorder = () => {
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

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">The order you are looking for does not exist.</p>
                <Link to="/profile/orders" className="text-primary hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Link to="/profile/orders" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <span className="material-symbols-outlined text-xl">arrow_back</span>
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-7">
                        Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadInvoice}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">description</span>
                        Invoice
                    </button>
                    <button
                        onClick={handleReorder}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Buy Again
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Items */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 font-medium text-gray-900 dark:text-white">
                            Items ({order.items.length})
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                                            <span className="material-symbols-outlined">medication</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        ₦{item.total.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tracking */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Order Status</h3>
                        <div className="relative pl-8 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                            {order.tracking_updates.map((update: any, idx: number) => (
                                <div key={idx} className="relative">
                                    <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 border-white dark:border-gray-800 ${idx === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{update.status}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{update.description}</p>
                                        <p className="text-xs text-gray-400">{update.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Subtotal</span>
                                <span>₦{order.subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                <span>Shipping</span>
                                <span>₦{order.shipping.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                                <span>Total</span>
                                <span>₦{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {order.shipping_address.street}<br />
                            {order.shipping_address.city}, {order.shipping_address.state}<br />
                            {order.shipping_address.country}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="material-symbols-outlined">credit_card</span>
                            <span>{order.payment_method}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
