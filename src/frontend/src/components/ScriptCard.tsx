import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Script } from '../backend';
import { Calendar, User } from 'lucide-react';

interface ScriptCardProps {
  script: Script;
}

export default function ScriptCard({ script }: ScriptCardProps) {
  const createdDate = new Date(Number(script.createdAt) / 1_000_000);

  return (
    <Link to="/script/$id" params={{ id: script.id }} className="block group">
      <Card className="h-full transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <CardTitle className="text-lg group-hover:text-accent transition-colors line-clamp-2">
              {script.title}
            </CardTitle>
            <Badge variant="outline" className="shrink-0 border-accent/30 text-accent">
              {script.category}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {script.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {createdDate.toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {script.author.toString().slice(0, 8)}...
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
