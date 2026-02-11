import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/WorkerManagement/Workers/')({
  component: Component,
});

function Component() {
  return <Outlet />;
}
