import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ScriptDetailPage from './pages/ScriptDetailPage';
import MyScriptsPage from './pages/MyScriptsPage';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <ProfileSetupModal />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const scriptDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/script/$id',
  component: ScriptDetailPage,
});

const myScriptsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-scripts',
  component: MyScriptsPage,
});

const routeTree = rootRoute.addChildren([indexRoute, scriptDetailRoute, myScriptsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
