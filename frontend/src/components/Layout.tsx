import { Link } from '@tanstack/react-router';
import LoginButton from './LoginButton';
import { Code2, Plus } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img 
                src="/assets/Gemini_Generated_Image_z68096z68096z680.png" 
                alt="Rawly41 Store" 
                className="h-10 w-10 rounded-full ring-2 ring-accent/50"
              />
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-foreground tracking-tight">Rawly41 Store</h1>
                <p className="text-xs text-muted-foreground">Developer Script Repository</p>
              </div>
            </Link>
            
            <nav className="flex items-center gap-4">
              {isAuthenticated && (
                <>
                  <Link to="/my-scripts">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Code2 className="h-4 w-4" />
                      My Scripts
                    </Button>
                  </Link>
                  <Link to="/" search={{ showSubmit: true }}>
                    <Button variant="outline" size="sm" className="gap-2 border-accent/50 text-accent hover:bg-accent/10">
                      <Plus className="h-4 w-4" />
                      Submit Script
                    </Button>
                  </Link>
                </>
              )}
              <LoginButton />
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {currentYear} Rawly41 Store. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <span className="text-accent">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
