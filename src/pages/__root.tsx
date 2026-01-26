import { Notifications } from '@mantine/notifications';
import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { useNotifications } from '@/hooks';
import type { AuthContext } from '@/models';

function RootComponent() {
  // Initialize global error handling
  useNotifications();

  return (
    <>
      <Notifications position='top-right' />
      <Outlet />
    </>
  );
}

export const Route = createRootRouteWithContext<AuthContext>()({
  component: RootComponent,

  beforeLoad: ({ context, location }) => {
    // Si NO está autenticado y no está en una ruta pública, redirigir a login
    if (!context.isAuth && location.pathname === '/') {
      throw redirect({ to: '/Login' });
    }
    if (context.isAuth && location.pathname === '/') {
      throw redirect({ to: '/Dashboard' });
    }

    // Si está autenticado y está en login, redirigir a private
    /*  if (context.isAuth && location.pathname === "/_public/Login") {
            throw redirect({ to: "/Login" });
        } */
  },
});
