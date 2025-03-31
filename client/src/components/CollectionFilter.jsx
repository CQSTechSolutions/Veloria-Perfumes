import React from 'react';
import { FiFilter, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';

const CollectionFilter = ({
    categories,
    selectedCategories,
    sortOption,
    priceRange,
    maxPrice,
    isFilterOpen,
    toggleFilter,
    handleCategoryChange,
    handleSortChange,
    handlePriceChange,
    handleClearFilters
}) => {
    return (
        <div className="mb-8">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-4">
                <button
                    className="w-full flex items-center justify-between px-4 py-3 bg-cream border border-gold/10 text-soft-black shadow-sm"
                    onClick={toggleFilter}
                >
                    <span className="flex items-center gap-2">
                        <FiFilter className="w-5 h-5" />
                        <span className="font-medium">Filters & Sorting</span>
                    </span>
                    {isFilterOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
            </div>

            {/* Filter sidebar - visible on desktop, toggleable on mobile */}
            <div
                className={`${
                    isFilterOpen ? 'block' : 'hidden lg:block'
                } bg-soft-white p-5 border border-gold/10 shadow-sm`}
            >
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-serif text-burgundy">Filter</h2>
                        <button 
                            className="text-xs text-burgundy hover:text-gold transition-colors"
                            onClick={handleClearFilters}
                        >
                            Clear all
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-soft-black mb-3">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                value={category}
                                                checked={selectedCategories.includes(category)}
                                                onChange={handleCategoryChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 border ${
                                                selectedCategories.includes(category) 
                                                ? 'border-burgundy bg-burgundy' 
                                                : 'border-gold/30 group-hover:border-burgundy/50'
                                            } transition-colors flex items-center justify-center`}>
                                                {selectedCategories.includes(category) && (
                                                    <FiCheck className="w-3 h-3 text-soft-white" />
                                                )}
                                            </div>
                                        </div>
                                        <span className={`ml-2 text-sm ${
                                            selectedCategories.includes(category) 
                                            ? 'text-burgundy' 
                                            : 'text-soft-black/70 group-hover:text-burgundy'
                                        } transition-colors`}>
                                            {category}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-soft-black mb-3">Price Range</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-soft-black/70">₹0</span>
                            <span className="text-xs text-soft-black/70">₹{maxPrice}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={maxPrice}
                            value={priceRange}
                            onChange={handlePriceChange}
                            className="w-full veloria-range-slider"
                        />
                        <div className="mt-2 text-sm text-burgundy text-center">
                            Up to ₹{priceRange}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <h3 className="text-sm font-medium text-soft-black mb-3">Sort By</h3>
                        <div className="space-y-2">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="newest"
                                    checked={sortOption === 'newest'}
                                    onChange={handleSortChange}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border ${
                                    sortOption === 'newest' 
                                    ? 'border-burgundy' 
                                    : 'border-gold/30 group-hover:border-burgundy/50'
                                } transition-colors flex items-center justify-center`}>
                                    {sortOption === 'newest' && (
                                        <div className="w-2 h-2 rounded-full bg-burgundy"></div>
                                    )}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    sortOption === 'newest' 
                                    ? 'text-burgundy' 
                                    : 'text-soft-black/70 group-hover:text-burgundy'
                                } transition-colors`}>
                                    Newest
                                </span>
                            </label>

                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="price-low-to-high"
                                    checked={sortOption === 'price-low-to-high'}
                                    onChange={handleSortChange}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border ${
                                    sortOption === 'price-low-to-high' 
                                    ? 'border-burgundy' 
                                    : 'border-gold/30 group-hover:border-burgundy/50'
                                } transition-colors flex items-center justify-center`}>
                                    {sortOption === 'price-low-to-high' && (
                                        <div className="w-2 h-2 rounded-full bg-burgundy"></div>
                                    )}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    sortOption === 'price-low-to-high' 
                                    ? 'text-burgundy' 
                                    : 'text-soft-black/70 group-hover:text-burgundy'
                                } transition-colors`}>
                                    Price: Low to High
                                </span>
                            </label>

                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="price-high-to-low"
                                    checked={sortOption === 'price-high-to-low'}
                                    onChange={handleSortChange}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border ${
                                    sortOption === 'price-high-to-low' 
                                    ? 'border-burgundy' 
                                    : 'border-gold/30 group-hover:border-burgundy/50'
                                } transition-colors flex items-center justify-center`}>
                                    {sortOption === 'price-high-to-low' && (
                                        <div className="w-2 h-2 rounded-full bg-burgundy"></div>
                                    )}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    sortOption === 'price-high-to-low' 
                                    ? 'text-burgundy' 
                                    : 'text-soft-black/70 group-hover:text-burgundy'
                                } transition-colors`}>
                                    Price: High to Low
                                </span>
                            </label>

                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="popularity"
                                    checked={sortOption === 'popularity'}
                                    onChange={handleSortChange}
                                    className="sr-only"
                                />
                                <div className={`w-4 h-4 rounded-full border ${
                                    sortOption === 'popularity' 
                                    ? 'border-burgundy' 
                                    : 'border-gold/30 group-hover:border-burgundy/50'
                                } transition-colors flex items-center justify-center`}>
                                    {sortOption === 'popularity' && (
                                        <div className="w-2 h-2 rounded-full bg-burgundy"></div>
                                    )}
                                </div>
                                <span className={`ml-2 text-sm ${
                                    sortOption === 'popularity' 
                                    ? 'text-burgundy' 
                                    : 'text-soft-black/70 group-hover:text-burgundy'
                                } transition-colors`}>
                                    Popularity
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionFilter; 