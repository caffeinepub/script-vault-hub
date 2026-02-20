import { useState } from 'react';
import { useCreateScript } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ScriptSubmissionFormProps {
  onClose: () => void;
}

const CATEGORIES = ['JavaScript', 'Python', 'TypeScript', 'Bash', 'SQL', 'CSS', 'HTML', 'Other'];

export default function ScriptSubmissionForm({ onClose }: ScriptSubmissionFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const createScript = useCreateScript();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createScript.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        category,
        content: content.trim(),
      });
      toast.success('Script submitted successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit script');
    }
  };

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Submit New Script</CardTitle>
            <CardDescription>Share your script with the community</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter script title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createScript.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what your script does"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createScript.isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={setCategory} disabled={createScript.isPending}>
              <SelectTrigger id="category">
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
            <Label htmlFor="content">Script Content *</Label>
            <Textarea
              id="content"
              placeholder="Paste your script code here"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={createScript.isPending}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={createScript.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createScript.isPending}
              className="bg-accent hover:bg-accent/90"
            >
              {createScript.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Script'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
