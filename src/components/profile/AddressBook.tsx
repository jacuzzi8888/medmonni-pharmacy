import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { profileService } from '../../services/profileService';
import { useToast } from '../../contexts/ToastContext';
import { Address } from '../../types/profile';

const AddressBook: React.FC = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        type: 'Home',
        street: '',
        city: '',
        state: '',
        country: 'Nigeria',
        is_default: false
    });

    useEffect(() => {
        if (user) {
            loadAddresses();
        }
    }, [user]);

    const loadAddresses = async () => {
        try {
            const data = await profileService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error('Error loading addresses:', error);
            toast.error('Failed to load addresses');
        } finally {
            setIsLoading(false);
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
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setFormData({
            type: 'Home',
            street: '',
            city: '',
            state: '',
            country: 'Nigeria',
            is_default: addresses.length === 0 // Default if first address
        });
        setEditingId(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;

        try {
            await profileService.deleteAddress(id);
            toast.success('Address deleted');
            loadAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await profileService.updateAddress(editingId, formData);
                toast.success('Address updated');
            } else {
                await profileService.addAddress(formData);
                toast.success('Address added');
            }
            setIsEditing(false);
            loadAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
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
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Address Book</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage your delivery addresses.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">add</span>
                        Add New
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {editingId ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Label</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                >
                                    <option value="Home">Home</option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={formData.is_default}
                                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="is_default" className="text-sm text-gray-700 dark:text-gray-300">
                                Set as default address
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Save Address
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div
                            key={address.id}
                            className={`relative bg-white dark:bg-gray-800 rounded-xl border p-6 transition-all ${address.is_default
                                    ? 'border-primary ring-1 ring-primary/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                        >
                            {address.is_default && (
                                <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">
                                    DEFAULT
                                </span>
                            )}

                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-gray-400">
                                    {address.type === 'Home' ? 'home' : address.type === 'Office' ? 'work' : 'location_on'}
                                </span>
                                <h3 className="font-bold text-gray-900 dark:text-white">{address.type}</h3>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                                {address.street}<br />
                                {address.city}, {address.state}<br />
                                {address.country}
                            </p>

                            <div className="flex gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <button
                                    onClick={() => handleEdit(address)}
                                    className="text-sm font-medium text-primary hover:text-primary/80"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="text-sm font-medium text-red-500 hover:text-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && (
                        <div className="col-span-2 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-3">location_off</span>
                            <p className="text-gray-500 dark:text-gray-400">No addresses found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressBook;
