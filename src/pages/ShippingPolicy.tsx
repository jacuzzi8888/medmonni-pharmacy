import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shipping Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p>Last updated: December 8, 2025</p>

                <h3>1. Shipment Processing Time</h3>
                <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>

                <h3>2. Shipping Rates & Delivery Estimates</h3>
                <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
                <ul>
                    <li><strong>Standard Shipping (Lagos):</strong> 1-2 business days - ₦1,500</li>
                    <li><strong>Standard Shipping (Nationwide):</strong> 3-5 business days - ₦3,500</li>
                </ul>

                <h3>3. Shipment Confirmation & Order Tracking</h3>
                <p>You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s).</p>
            </div>
        </div>
    );
};

export default ShippingPolicy;
