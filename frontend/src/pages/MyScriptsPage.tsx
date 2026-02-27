import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetScriptsByAuthor, useDeleteScript, useUpdateScript } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Edit, Trash2, FileCode, Calendar, LogIn, ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Script } from '../backend';

const CATEGORIES = ['JavaScript', 'Python', 'TypeScript', 'Bash', 'SQL', 'CSS', 'HTML', 'Other'];

export default function MyScriptsPage() {
  const { identity, login, loginStatus, isInitializing } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const principal = identity ? identity.getPrincipal() : undefined;
  const { data: scripts = [], isLoading, error, refetch } = useGetScriptsByAuthor(principal);
  const deleteScript = useDeleteScript();
  const updateScript = useUpdateScript();

  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [deleteScriptId, setDeleteScriptId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    content: '',
  });

  const handleEditClick = (script: Script) => {
    setEditingScript(script);
    setEditForm({
      title: script.title,
      description: script.description,
      category: script.category,
      content: script.content,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScript) return;

    try {
      await updateScript.mutateAsync({
        id: editingScript.id,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        content: editForm.content.trim(),
      });
      toast.success('Script updated successfully');
      setEditingScript(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update script');
    }
  };

  const handleDelete = async () => {
    if (!deleteScriptId) return;

    try {
      await deleteScript.mutateAsync(deleteScriptId);
      toast.success('Script deleted successfully');
      setDeleteScriptId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete script');
    }
  };

  const handleLoginPrompt = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">
            Please log in to view and manage your scripts.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate({ to: '/' })} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={handleLoginPrompt}
              className="bg-accent hover:bg-accent/90 gap-2"
              disabled={loginStatus === 'logging-in'}
            >
              <LogIn className="h-4 w-4" />
              {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Scripts</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading your scripts...' : `${scripts.length} ${scripts.length === 1 ? 'script' : 'scripts'} found`}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
          title="Refresh scripts"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p className="mb-4">Error loading your scripts. Please try refreshing.</p>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : scripts.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <FileCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No scripts yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't submitted any scripts. Start by creating your first one!
          </p>
          <Button onClick={() => navigate({ to: '/' })} className="bg-accent hover:bg-accent/90">
            Go to Home
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scripts.map((script) => (
            <Card key={script.id} className="flex flex-col hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    <Link
                      to="/script/$id"
                      params={{ id: script.id }}
                      className="hover:text-accent transition-colors"
                    >
                      {script.title}
                    </Link>
                  </CardTitle>
                  <Badge variant="outline" className="border-accent/30 text-accent shrink-0">
                    {script.category}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{script.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(Number(script.createdAt) / 1_000_000).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(script)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteScriptId(script.id)}
                    className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingScript} onOpenChange={(open) => { if (!open) setEditingScript(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Script</DialogTitle>
            <DialogDescription>
              Update your script details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Script title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of what this script does"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Script Content</Label>
              <Textarea
                id="edit-content"
                value={editForm.content}
                onChange={(e) => setEditForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Paste your script here..."
                rows={12}
                className="font-mono text-sm"
                required
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingScript(null)}
                disabled={updateScript.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90"
                disabled={updateScript.isPending}
              >
                {updateScript.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteScriptId} onOpenChange={(open) => { if (!open) setDeleteScriptId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Script</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this script? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteScript.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteScript.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteScript.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
