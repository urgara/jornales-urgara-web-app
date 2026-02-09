import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/WorkerManagement/BaseValues/')({
  component: Component,
});

function Component() {
  return <Outlet />;
}
