import { ActionIcon, AppShell, Flex, Group, Image, ScrollArea } from '@mantine/core';
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
import { ButtonLink, NavLinkGroup } from '@/components';
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
      <AppShell.Header bg='#282D8A'>
        <Flex align='center' justify='space-between' h='100%' w='100%' px='md'>
          <Group gap='md'>
            <Image src='/images/urgara.png' h={40} w={40} fit='contain' />
            <ActionIcon variant='transparent' c='white' size={40} onClick={toggle}>
              {opened ? <IconLayoutSidebarLeftCollapse /> : <IconLayoutSidebarLeftCollapseFilled />}
            </ActionIcon>
          </Group>
          <ActionIcon variant='white' c='red' onClick={logout}>
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
