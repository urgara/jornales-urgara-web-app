import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/WorkerManagement/WorkShift/')({
  component: Component,
});

function Component() {
  return <Outlet />;
}
