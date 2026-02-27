import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptSearchProps {
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function ScriptSearch({ onSearchChange, onCategoryChange, categories }: ScriptSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search scripts by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(searchQuery || categories.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              onSearchChange('');
              onCategoryChange('all');
            }}
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
