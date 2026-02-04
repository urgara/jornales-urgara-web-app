import { MantineProvider, createTheme, type MantineColorsTuple } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import dayjs from 'dayjs';
import esLocale from 'dayjs/locale/es';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { QUERY, router } from './config';
import { useAuthStore } from './stores';
import './interceptors';
import { PageLoading } from './components';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import 'mantine-react-table/styles.css';

// Configurar dayjs con timezone de Argentina
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale(esLocale); // Establecer español como locale global con referencia directa
dayjs.tz.setDefault('America/Argentina/Buenos_Aires');

const urgaraColor: MantineColorsTuple = [
  '#eff0fa',
  '#dbdcef',
  '#b3b5e1',
  '#8a8cd4',
  '#6769c9',
  '#5154c2',
  '#4648c0',
  '#383aaa',
  '#313498',
  '#282d8a',
];

const theme = createTheme({
  colors: {
    'urgara-color': urgaraColor,
  },
  primaryColor: 'urgara-color',
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
// Create router with context
export default function App() {
  const admin = useAuthStore((store) => store.admin);
  const isAuth = useAuthStore((store) => store.isAuth);

  return (
    <QueryClientProvider client={QUERY}>
      <MantineProvider theme={theme} forceColorScheme='light'>
        <DatesProvider settings={{ locale: 'es', timezone: 'America/Argentina/Buenos_Aires' }}>
          <RouterProvider
            router={router}
            context={{
              admin,
              isAuth,
            }}
            defaultPendingComponent={PageLoading}
            defaultPendingMinMs={1000}
            defaultPendingMs={200}
          />
        </DatesProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
