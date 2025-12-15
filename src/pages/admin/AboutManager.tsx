import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AboutContent, getAboutContent, saveAboutContent, DEFAULT_ABOUT_CONTENT } from '../../data/aboutContent';
import { useToast } from '../../contexts/ToastContext';

const AboutManager: React.FC = () => {
    const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'mission' | 'stats' | 'features' | 'store'>('mission');
    const toast = useToast();

    useEffect(() => {
        setContent(getAboutContent());
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        try {
            saveAboutContent(content);
            toast.success('About page content saved successfully!');
        } catch (error) {
            toast.error('Failed to save content');
        }
        setIsSaving(false);
    };

    const handleReset = () => {
        if (confirm('Reset all content to defaults? This cannot be undone.')) {
            setContent(DEFAULT_ABOUT_CONTENT);
            saveAboutContent(DEFAULT_ABOUT_CONTENT);
            toast.info('Content reset to defaults');
        }
    };

    const updateContent = (path: string, value: any) => {
        setContent(prev => {
            const newContent = { ...prev };
            const keys = path.split('.');
            let obj: any = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                obj = obj[keys[i]];
            }
            obj[keys[keys.length - 1]] = value;
            return newContent;
        });
    };

    const updateWhyChooseUs = (index: number, field: string, value: string) => {
        setContent(prev => {
            const newFeatures = [...prev.whyChooseUs];
            newFeatures[index] = { ...newFeatures[index], [field]: value };
            return { ...prev, whyChooseUs: newFeatures };
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to="/admin" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">About Page Manager</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Edit mission, vision, stats, and more</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Reset to Defaults
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving && <span className="animate-spin material-symbols-outlined text-[18px]">sync</span>}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                    {[
                        { id: 'mission', label: 'Mission & Vision', icon: 'flag' },
                        { id: 'stats', label: 'Statistics', icon: 'bar_chart' },
                        { id: 'features', label: 'Why Choose Us', icon: 'stars' },
                        { id: 'store', label: 'Store Info', icon: 'storefront' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-3 flex items-center gap-2 font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mission & Vision Tab */}
                {activeTab === 'mission' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Hero Section</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Tagline</label>
                                    <input
                                        type="text"
                                        value={content.heroTagline}
                                        onChange={(e) => updateContent('heroTagline', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hero Subtitle</label>
                                    <textarea
                                        value={content.heroSubtitle}
                                        onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-[18px]">flag</span>
                                    </span>
                                    Mission
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={content.mission.title}
                                            onChange={(e) => updateContent('mission.title', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                        <textarea
                                            value={content.mission.content}
                                            onChange={(e) => updateContent('mission.content', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-accent-red/10 rounded-lg flex items-center justify-center">
                                        <span className="material-symbols-outlined text-accent-red text-[18px]">visibility</span>
                                    </span>
                                    Vision
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={content.vision.title}
                                            onChange={(e) => updateContent('vision.title', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                                        <textarea
                                            value={content.vision.content}
                                            onChange={(e) => updateContent('vision.content', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Call to Action Section</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Title</label>
                                    <input
                                        type="text"
                                        value={content.ctaTitle}
                                        onChange={(e) => updateContent('ctaTitle', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CTA Subtitle</label>
                                    <input
                                        type="text"
                                        value={content.ctaSubtitle}
                                        onChange={(e) => updateContent('ctaSubtitle', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Tab */}
                {activeTab === 'stats' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Statistics Display</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { key: 'customers', label: 'Happy Customers', icon: 'groups' },
                                { key: 'products', label: 'Products Available', icon: 'inventory_2' },
                                { key: 'support', label: 'Support Availability', icon: 'support_agent' },
                                { key: 'outreaches', label: 'Community Outreaches', icon: 'volunteer_activism' },
                            ].map(stat => (
                                <div key={stat.key} className="text-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-primary text-3xl">{stat.icon}</span>
                                    </div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{stat.label}</label>
                                    <input
                                        type="text"
                                        value={(content.stats as any)[stat.key]}
                                        onChange={(e) => updateContent(`stats.${stat.key}`, e.target.value)}
                                        className="w-full px-4 py-3 text-center text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Why Choose Us Tab */}
                {activeTab === 'features' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Why Choose Us Features</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {content.whyChooseUs.map((feature, index) => (
                                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-2xl">{feature.icon}</span>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">Feature {index + 1}</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Icon Name (Material Symbols)</label>
                                            <input
                                                type="text"
                                                value={feature.icon}
                                                onChange={(e) => updateWhyChooseUs(index, 'icon', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="e.g., verified, star, check_circle"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={feature.title}
                                                onChange={(e) => updateWhyChooseUs(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                                            <input
                                                type="text"
                                                value={feature.description}
                                                onChange={(e) => updateWhyChooseUs(index, 'description', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Store Info Tab */}
                {activeTab === 'store' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Store Information</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">location_on</span>
                                            Address
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={content.storeInfo.address}
                                        onChange={(e) => updateContent('storeInfo.address', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">schedule</span>
                                            Opening Hours
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={content.storeInfo.hours}
                                        onChange={(e) => updateContent('storeInfo.hours', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">call</span>
                                            Phone Number
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={content.storeInfo.phone}
                                        onChange={(e) => updateContent('storeInfo.phone', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Store Description</label>
                                <textarea
                                    value={content.storeInfo.description}
                                    onChange={(e) => updateContent('storeInfo.description', e.target.value)}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutManager;
