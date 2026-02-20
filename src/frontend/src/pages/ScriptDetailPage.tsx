import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetScript, useDeleteScript } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CodeBlock from '../components/CodeBlock';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, User, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ScriptDetailPage() {
  const { id } = useParams({ from: '/script/$id' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: script, isLoading, error } = useGetScript(id);
  const deleteScript = useDeleteScript();

  const isAuthenticated = !!identity;
  const isAuthor = identity && script && script.author.toString() === identity.getPrincipal().toString();

  const handleDelete = async () => {
    try {
      await deleteScript.mutateAsync(id);
      toast.success('Script deleted successfully');
      navigate({ to: '/' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete script');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-2">Script not found</h2>
          <p className="text-muted-foreground mb-6">The script you're looking for doesn't exist.</p>
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(Number(script.createdAt) / 1_000_000);
  const updatedDate = new Date(Number(script.updatedAt) / 1_000_000);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/' })}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Scripts
      </Button>

      <div className="bg-card border border-border rounded-lg p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-3">
              <h1 className="text-3xl font-bold text-foreground">{script.title}</h1>
              <Badge variant="outline" className="border-accent/30 text-accent shrink-0">
                {script.category}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">{script.description}</p>
          </div>
          {isAuthenticated && isAuthor && (
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your script.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Author: {script.author.toString().slice(0, 16)}...</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created: {createdDate.toLocaleDateString()}</span>
          </div>
          {script.createdAt !== script.updatedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Updated: {updatedDate.toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Code Content */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Script Content</h2>
          <CodeBlock code={script.content} language={script.category.toLowerCase()} />
        </div>
      </div>
    </div>
  );
}
