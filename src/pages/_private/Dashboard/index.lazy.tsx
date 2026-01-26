import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_private/Dashboard/')({
  component: Dashboard,
});

function Dashboard() {
  return <p>hola</p>;
}
