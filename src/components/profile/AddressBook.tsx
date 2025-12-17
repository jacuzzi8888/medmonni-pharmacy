import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { profileService } from '../../services/profileService';
import { Address } from '../../types/profile';

const AddressBook: React.FC = () => {
    const { user } = useAuth();
    const { success, error: showError } = useToast();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: 'Lagos',
        country: 'Nigeria',
        is_default: false
    });

    const nigeriaStates = [
        'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
        'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
        'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
        'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
        'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ];

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const data = await profileService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            showError('Failed to load addresses');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'Home',
            street: '',
            city: '',
            state: 'Lagos',
            country: 'Nigeria',
            is_default: false
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.street || !formData.city) {
            showError('Please fill in all required fields');
            return;
        }

        setIsSaving(true);
        try {
            if (editingId) {
                const updated = await profileService.updateAddress(editingId, formData);
                setAddresses(prev => prev.map(a => a.id === editingId ? updated : a));
                success('Address updated successfully');
            } else {
                const newAddress = await profileService.addAddress(formData);
                setAddresses(prev => [newAddress, ...prev]);
                success('Address added successfully');
            }
            resetForm();
            fetchAddresses(); // Refresh to get updated default status
        } catch (error: any) {
            showError(error.message || 'Failed to save address');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (address: Address) => {
        setFormData({
            type: address.type,
            street: address.street,
            city: address.city,
            state: address.state,
            country: address.country,
            is_default: address.is_default
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            await profileService.deleteAddress(id);
            setAddresses(prev => prev.filter(a => a.id !== id));
            success('Address deleted');
        } catch (error) {
            showError('Failed to delete address');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await profileService.updateAddress(id, { is_default: true });
            fetchAddresses();
            success('Default address updated');
        } catch (error) {
            showError('Failed to set default address');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delivery Addresses</h2>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Address
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    State
                                </label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                >
                                    {nigeriaStates.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                placeholder="e.g. 1 Niyi Okunubi Street"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                City/Area *
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                placeholder="e.g. Lekki Phase 1"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                className="w-4 h-4 text-primary"
                            />
                            <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
                                Set as default delivery address
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : (editingId ? 'Update' : 'Add Address')}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-600 hover:text-gray-800 px-4 py-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">location_off</span>
                    <p className="text-gray-500">No saved addresses yet</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-4 text-primary font-medium hover:underline"
                    >
                        Add your first address
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`p-4 border-2 rounded-xl transition-colors ${address.is_default
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                    <span className={`material-symbols-outlined text-2xl ${address.type === 'Home' ? 'text-blue-500' :
                                            address.type === 'Office' ? 'text-orange-500' : 'text-gray-500'
                                        }`}>
                                        {address.type === 'Home' ? 'home' : address.type === 'Office' ? 'business' : 'location_on'}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-gray-900 dark:text-white">{address.type}</p>
                                            {address.is_default && (
                                                <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">{address.street}</p>
                                        <p className="text-gray-500 text-sm">{address.city}, {address.state}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!address.is_default && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="text-xs text-primary hover:underline"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="p-2 text-gray-500 hover:text-primary"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(address.id)}
                                        className="p-2 text-gray-500 hover:text-red-500"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressBook;
