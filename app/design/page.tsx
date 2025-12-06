'use client'

import { useState } from 'react'

export default function DesignSystemPage() {
    const [activeTab, setActiveTab] = useState('foundation')

    return (
        <div className="min-h-screen bg-neutral-bg-page p-8" dir="ltr">
            <header className="mb-12 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary-base to-secondary-base mb-4">
                    Design System Reference
                </h1>
                <p className="text-neutral-text-secondary text-lg">
                    A collection of reusable components and foundation styles for the Prompt Library.
                </p>
                <div className="flex gap-4 mt-6 border-b border-neutral-border-subtle">
                    {['Foundation', 'Components'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === tab.toLowerCase()
                                ? 'text-primary-base'
                                : 'text-neutral-text-secondary hover:text-neutral-text-primary'
                                }`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-base" />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-16">
                {activeTab === 'foundation' ? (
                    <>
                        {/* Typography Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Typography</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h1 className="text-4xl font-bold">Display XL Heading</h1>
                                    <h2 className="text-3xl font-bold">Display L Heading</h2>
                                    <h1 className="text-2xl font-bold">H1 Heading</h1>
                                    <h2 className="text-xl font-semibold">H2 Heading</h2>
                                    <h3 className="text-lg font-semibold">H3 Heading</h3>
                                    <p className="text-base text-neutral-text-primary">
                                        Body Large - The quick brown fox jumps over the lazy dog.
                                    </p>
                                    <p className="text-sm text-neutral-text-primary">
                                        Body Medium - The quick brown fox jumps over the lazy dog.
                                    </p>
                                    <p className="text-xs text-neutral-text-secondary">
                                        Caption - Metadata and timestamps.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Colors Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Colors</h2>

                            {/* Primary & Secondary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Brand Colors</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { name: 'Primary Base', class: 'bg-primary-base' },
                                        { name: 'Primary Hover', class: 'bg-primary-hover' },
                                        { name: 'Primary Pressed', class: 'bg-primary-pressed' },
                                        { name: 'Secondary Base', class: 'bg-secondary-base' },
                                        { name: 'Secondary Hover', class: 'bg-secondary-hover' },
                                        { name: 'Secondary Pressed', class: 'bg-secondary-pressed' },
                                    ].map((color) => (
                                        <div key={color.name} className="flex flex-col gap-2">
                                            <div className={`h-20 w-full rounded-lg shadow-sm ${color.class}`} />
                                            <span className="text-sm font-medium">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Accents */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Accent Colors</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[
                                        { name: 'Success', class: 'bg-accent-success' },
                                        { name: 'Warning', class: 'bg-accent-warning' },
                                        { name: 'Error', class: 'bg-accent-error' },
                                        { name: 'Info', class: 'bg-accent-info' },
                                    ].map((color) => (
                                        <div key={color.name} className="flex flex-col gap-2">
                                            <div className={`h-20 w-full rounded-lg shadow-sm ${color.class}`} />
                                            <span className="text-sm font-medium">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Neutrals */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Neutrals</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    {[
                                        { name: 'Page BG', class: 'bg-neutral-bg-page border border-neutral-border-subtle' },
                                        { name: 'Card BG', class: 'bg-neutral-bg-card border border-neutral-border-subtle' },
                                        { name: 'Soft BG', class: 'bg-neutral-bg-soft' },
                                        { name: 'Border', class: 'bg-neutral-border-subtle' },
                                        { name: 'Text Primary', class: 'bg-neutral-text-primary' },
                                        { name: 'Text Secondary', class: 'bg-neutral-text-secondary' },
                                    ].map((color) => (
                                        <div key={color.name} className="flex flex-col gap-2">
                                            <div className={`h-20 w-full rounded-lg shadow-sm ${color.class}`} />
                                            <span className="text-sm font-medium">{color.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Shadows & Radius */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Effects & Shape</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="p-8 bg-white rounded-lg shadow-card text-center">
                                    Shadow Card
                                </div>
                                <div className="p-8 bg-white rounded-lg shadow-floating text-center">
                                    Shadow Floating
                                </div>
                                <div className="p-8 bg-white rounded-lg shadow-button text-center">
                                    Shadow Button
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {/* Buttons Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Buttons</h2>
                            <div className="flex flex-wrap gap-4 items-center p-8 bg-white rounded-xl shadow-sm">
                                <button className="px-6 py-2.5 text-sm font-bold text-white bg-primary-base rounded-full hover:bg-primary-hover shadow-button hover:shadow-floating transition-all duration-200">
                                    Primary Button
                                </button>
                                <button className="px-6 py-2.5 text-sm font-semibold text-primary-base border border-primary-base rounded-full hover:bg-primary-base hover:text-white transition-all duration-200">
                                    Secondary Outline
                                </button>
                                <button className="px-6 py-2.5 text-sm font-semibold text-neutral-text-secondary hover:text-primary-base transition-colors">
                                    Ghost / Text
                                </button>
                                <button disabled className="px-6 py-2.5 text-sm font-bold text-white bg-gray-300 rounded-full cursor-not-allowed">
                                    Disabled
                                </button>
                            </div>
                        </section>

                        {/* Cards Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Cards</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Card */}
                                <div className="bg-white rounded-xl shadow-card p-6">
                                    <h3 className="text-lg font-bold mb-2">Basic Card</h3>
                                    <p className="text-neutral-text-secondary">
                                        This is a standard card used for content containers. It has a soft shadow and rounded corners.
                                    </p>
                                </div>

                                {/* Feature Card */}
                                <div className="bg-white rounded-xl shadow-card overflow-hidden">
                                    <div className="h-32 bg-linear-to-r from-primary-base/10 to-secondary-base/10 p-6 flex items-center justify-center">
                                        <span className="text-4xl">✨</span>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-2">Feature Card</h3>
                                        <p className="text-neutral-text-secondary">
                                            Used for highlighting features with a visual header.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Form Elements */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Inputs & Forms</h2>
                            <div className="bg-white rounded-xl shadow-card p-6 max-w-xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-text-primary mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="user@example.com"
                                        className="w-full px-4 py-2 bg-neutral-bg-page border border-neutral-border-subtle rounded-lg focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-text-primary mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-2 bg-neutral-bg-page border border-neutral-border-subtle rounded-lg focus:ring-2 focus:ring-primary-base/20 focus:border-primary-base outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Tables Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Tables</h2>
                            <div className="bg-white rounded-xl shadow-card overflow-hidden">
                                <table className="min-w-full divide-y divide-neutral-border-subtle">
                                    <thead className="bg-neutral-bg-soft">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-neutral-text-secondary uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-neutral-text-secondary uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-neutral-text-secondary uppercase tracking-wider">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-neutral-border-subtle">
                                        {[1, 2, 3].map((row) => (
                                            <tr key={row} className="hover:bg-neutral-bg-soft/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-text-primary">
                                                    Prompt #{row}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-accent-success/10 text-accent-success">
                                                        Active
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-text-secondary">
                                                    Oct 12, 2025
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Toast/Alerts */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-neutral-text-primary border-b pb-2">Alerts</h2>
                            <div className="space-y-4 max-w-md">
                                <div className="p-4 rounded-lg bg-green-50 border border-green-200 flex gap-3">
                                    <span className="text-green-600">✓</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-green-900">Success</h4>
                                        <p className="text-sm text-green-700">Operation completed successfully.</p>
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                                    <span className="text-red-600">⚠</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-red-900">Error</h4>
                                        <p className="text-sm text-red-700">Something went wrong.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}
