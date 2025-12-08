import React from 'react';

const ReturnPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Return Policy</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p>Last updated: December 8, 2025</p>
                <p>Thank you for shopping at Medomni Pharmacy. If you are not entirely satisfied with your purchase, we're here to help.</p>

                <h3>1. Returns</h3>
                <p>You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.</p>
                <p><strong>Note:</strong> Prescription medications cannot be returned due to safety regulations.</p>

                <h3>2. Refunds</h3>
                <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>

                <h3>3. Shipping</h3>
                <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
            </div>
        </div>
    );
};

export default ReturnPolicy;
