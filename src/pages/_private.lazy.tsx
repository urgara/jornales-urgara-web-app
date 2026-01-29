import { ActionIcon, AppShell, Flex, Group, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingCog,
  IconCalendarCheck,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftCollapseFilled,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router';
import { ButtonLink, LogoIcon, NavLinkGroup } from '@/components';
import { useAuthStore } from '@/stores';

export const Route = createLazyFileRoute('/_private')({
  component: PrivateLayout,
});

function PrivateLayout() {
  // Sincronizar datos del admin si está logueado pero no hay datos
  const logout = useAuthStore((store) => store.logout);
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <AppShell
      header={{ height: 60 }}
      padding='md'
      navbar={{
        width: 200,
        breakpoint: 'sm',
        collapsed: { desktop: !opened },
      }}
    >
      <AppShell.Header bg='blue'>
        <Flex align='center' h='100%' w='100%'>
          <Group w='100%'>
            <LogoIcon height={50} />
            <ActionIcon variant='light' c='dark' size={50} onClick={toggle}>
              {opened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftCollapseFilled />}
            </ActionIcon>
          </Group>
          <ActionIcon variant='white' m='md' c='red' onClick={logout}>
            <IconLogout />
          </ActionIcon>
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar h='100%'>
        <ScrollArea>
          <ButtonLink label='Dashboard' to='/Dashboard' />
          <ButtonLink
            label='Asignaciones'
            to='/WorkerAssignments'
            leftSection={<IconCalendarCheck size={16} />}
          />
          <NavLinkGroup label='Administración' leftSection={<IconBuildingCog size={16} />}>
            <ButtonLink label='Administradores' to='/Administration/Admins' />
            <ButtonLink label='Localidades' to='/Administration/Localities' />
            <ButtonLink label='Empresas' to='/Administration/Companies' />
          </NavLinkGroup>
          <NavLinkGroup label='Gestión de Trabajadores' leftSection={<IconUsers size={16} />}>
            <ButtonLink label='Trabajadores' to='/WorkerManagement/Workers/List' />
            <ButtonLink label='Turnos' to='/WorkerManagement/WorkShift/List' />
          </NavLinkGroup>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
