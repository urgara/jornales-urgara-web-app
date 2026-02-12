import { ActionIcon, AppShell, Button, Flex, Group, Image, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBuildingCog,
  IconCalendarCheck,
  IconKey,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftCollapseFilled,
  IconLogout,
  IconUsers,
} from '@tabler/icons-react';
import { createLazyFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import {
  ButtonLink,
  ChangePasswordModal,
  HeaderLocalitySelector,
  NavLinkGroup,
} from '@/components';
import { useAuthStore } from '@/stores';

export const Route = createLazyFileRoute('/_private')({
  component: PrivateLayout,
});

function PrivateLayout() {
  const navigate = useNavigate();
  const logout = useAuthStore((store) => store.logout);
  const [opened, { toggle }] = useDisclosure(true);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] =
    useDisclosure(false);

  const handleLogout = () => {
    logout();
    navigate({ to: '/Login' });
  };

  return (
    <>
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
                {opened ? (
                  <IconLayoutSidebarLeftCollapse />
                ) : (
                  <IconLayoutSidebarLeftCollapseFilled />
                )}
              </ActionIcon>
              <HeaderLocalitySelector />
            </Group>
            <ActionIcon variant='white' c='red' onClick={handleLogout}>
              <IconLogout />
            </ActionIcon>
          </Flex>
        </AppShell.Header>
        <AppShell.Navbar h='100dvh'>
          <ScrollArea h='85%'>
            <ButtonLink label='Inicio' to='/Dashboard' />
            <ButtonLink
              label='Asignaciones'
              to='/WorkerAssignments'
              leftSection={<IconCalendarCheck size={16} />}
            />
            <NavLinkGroup label='Administración' leftSection={<IconBuildingCog size={16} />}>
              <ButtonLink label='Administradores' to='/Administration/Admins' />
              <ButtonLink label='Localidades' to='/Administration/Localities' />
              <ButtonLink label='Empresas' to='/Administration/Companies' />
              <ButtonLink label='Agencias' to='/Administration/Agencies' />
              <ButtonLink label='Productos' to='/Administration/Products' />
            </NavLinkGroup>
            <NavLinkGroup label='Gestión de Trabajadores' leftSection={<IconUsers size={16} />}>
              <ButtonLink label='Trabajadores' to='/WorkerManagement/Workers/List' />
              <ButtonLink label='Turnos' to='/WorkerManagement/WorkShift/List' />
              <ButtonLink label='Valores base' to='/WorkerManagement/BaseValues/List' />
              <ButtonLink label='Terminal / muelle' to='/Administration/Terminals' />
            </NavLinkGroup>
          </ScrollArea>
          <Button
            h={200}
            variant='subtle'
            onClick={openPasswordModal}
            leftSection={<IconKey size={16} />}
          >
            Cambiar contraseña
          </Button>
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
      <ChangePasswordModal opened={passwordModalOpened} onClose={closePasswordModal} />
    </>
  );
}
