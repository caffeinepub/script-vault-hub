import ScriptCard from './ScriptCard';
import type { Script } from '../backend';
import { FileCode } from 'lucide-react';

interface ScriptGridProps {
  scripts: Script[];
  isLoading?: boolean;
}

export default function ScriptGrid({ scripts, isLoading }: ScriptGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-48 bg-card/50 animate-pulse rounded-lg border border-border" />
        ))}
      </div>
    );
  }

  if (scripts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FileCode className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No scripts found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters, or be the first to submit a script!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scripts.map((script) => (
        <ScriptCard key={script.id} script={script} />
      ))}
    </div>
  );
}
