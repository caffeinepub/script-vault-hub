import { useOnboardingModal } from '../hooks/useOnboardingModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function OnboardingModal() {
  const { isOpen, dismiss } = useOnboardingModal();

  return (
    <Dialog open={isOpen} onOpenChange={dismiss}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-accent/10 p-4">
              <Sparkles className="h-12 w-12 text-accent" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Do This First
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            For the best experience, add this app to your home screen.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Button
            onClick={dismiss}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Got It!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
