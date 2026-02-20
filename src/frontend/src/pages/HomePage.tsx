import { useState, useMemo } from 'react';
import { useGetAllScripts, useSearchScriptsByTitle, useFilterScriptsByCategory } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ScriptGrid from '../components/ScriptGrid';
import ScriptSearch from '../components/ScriptSearch';
import ScriptSubmissionForm from '../components/ScriptSubmissionForm';
import { Button } from '@/components/ui/button';
import { Plus, Code2, LogIn } from 'lucide-react';

export default function HomePage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const { data: allScripts = [], isLoading: allLoading, error: allError } = useGetAllScripts();
  const { data: searchResults = [], isLoading: searchLoading } = useSearchScriptsByTitle(searchQuery);
  const { data: filteredResults = [], isLoading: filterLoading } = useFilterScriptsByCategory(
    selectedCategory !== 'all' ? selectedCategory : ''
  );

  const displayScripts = useMemo(() => {
    if (searchQuery) {
      return searchResults;
    }
    if (selectedCategory !== 'all') {
      return filteredResults;
    }
    return allScripts;
  }, [searchQuery, selectedCategory, searchResults, filteredResults, allScripts]);

  const isLoading = searchQuery ? searchLoading : selectedCategory !== 'all' ? filterLoading : allLoading;

  const categories = useMemo(() => {
    const cats = new Set(allScripts.map((s) => s.category));
    return Array.from(cats).sort();
  }, [allScripts]);

  const handleLoginPrompt = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-xl overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Script Vault Hub"
          className="w-full h-48 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="container mx-auto px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Script Vault Hub
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover, share, and manage developer scripts. Your central repository for code snippets and utilities.
            </p>
          </div>
        </div>
      </div>

      {/* Submit Form - Only for authenticated users */}
      {showSubmitForm && isAuthenticated && (
        <div className="mb-8">
          <ScriptSubmissionForm onClose={() => setShowSubmitForm(false)} />
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code2 className="h-6 w-6 text-accent" />
            Browse Scripts
          </h3>
          <p className="text-muted-foreground mt-1">
            {displayScripts.length} {displayScripts.length === 1 ? 'script' : 'scripts'} available
          </p>
        </div>
        {isAuthenticated && !showSubmitForm && (
          <Button onClick={() => setShowSubmitForm(true)} className="bg-accent hover:bg-accent/90 gap-2">
            <Plus className="h-4 w-4" />
            Submit Script
          </Button>
        )}
        {!isAuthenticated && (
          <Button 
            onClick={handleLoginPrompt} 
            variant="outline" 
            className="gap-2 border-accent/50 hover:bg-accent/10"
            disabled={loginStatus === 'logging-in'}
          >
            <LogIn className="h-4 w-4" />
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login to Submit Scripts'}
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <ScriptSearch
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>

      {/* Error State */}
      {allError && !isLoading && (
        <div className="text-center py-8 text-destructive">
          <p>Error loading scripts. Please try refreshing the page.</p>
        </div>
      )}

      {/* Scripts Grid */}
      <ScriptGrid scripts={displayScripts} isLoading={isLoading} />
    </div>
  );
}
