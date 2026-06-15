'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, BookText, Filter } from 'lucide-react';
import { GLOSSARY_DATA, GlossaryCategory } from '@/lib/glossary-data';

function GlossaryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory | 'All'>('All');

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const categories: (GlossaryCategory | 'All')[] = ['All', 'Product Management', 'Marketing', 'Sales', 'Finance'];

  const filteredData = GLOSSARY_DATA.filter((item) => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.acronym && item.acronym.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Product Management': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'Marketing': return 'text-pink-500 bg-pink-500/10 border-pink-500/20';
      case 'Sales': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Finance': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-muted-app bg-app border-app';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-in-fade">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white glow-accent-sm">
            <BookText className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-bold text-primary-app">Glossary</h1>
        </div>
        <p className="text-secondary-app">
          Comprehensive dictionary of formulas, acronyms, and terminology across product, marketing, sales, and finance.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-app" />
          <input
            type="text"
            placeholder="Search for terms, acronyms, or definitions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-app pl-10 py-2.5 w-full bg-app-secondary"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-muted-app mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-accent-app text-white border-accent-app shadow-md shadow-accent-app/20'
                  : 'bg-app-secondary text-secondary-app border-app hover:text-primary-app hover:border-accent-app/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredData.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredData.map((item) => (
            <div key={item.id} className="card-app p-6 flex flex-col h-full hover:border-accent-app/30 transition-colors group">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-primary-app text-lg leading-tight group-hover:text-accent-app transition-colors">
                    {item.term}
                  </h3>
                  {item.acronym && (
                    <span className="text-sm font-semibold text-muted-app mt-1 block">
                      {item.acronym}
                    </span>
                  )}
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
              </div>

              <div className="space-y-4 flex-1">
                <p className="text-sm text-secondary-app leading-relaxed">
                  {item.definition}
                </p>

                {item.formula && (
                  <div className="bg-app rounded-md p-3 border border-app font-mono text-xs text-primary-app overflow-x-auto">
                    <span className="text-muted-app font-sans font-semibold uppercase tracking-wider text-[10px] block mb-1">Formula</span>
                    {item.formula}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-app">
                <span className="text-muted-app font-semibold uppercase tracking-wider text-[10px] block mb-1">Example</span>
                <p className="text-sm text-secondary-app italic text-muted-app/80">"{item.example}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 card-app border-dashed">
          <BookText className="w-12 h-12 text-muted-app mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-primary-app">No terms found</h3>
          <p className="text-secondary-app mt-1">Try adjusting your search or category filter.</p>
        </div>
      )}
    </div>
  );
}

export default function GlossaryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-app">Loading glossary...</div>}>
      <GlossaryContent />
    </Suspense>
  );
}
