import { Card, Container, Grid, Group, Loader, Stack, Text } from '@mantine/core';
import { IconBriefcase, IconBuilding, IconCalendarCheck, IconUsers } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import {
  useQueryAgenciesCount,
  useQueryCompaniesCount,
  useQueryWorkerAssignmentsCount,
  useQueryWorkersCount,
} from '@/hooks';

export const Route = createLazyFileRoute('/_private/Dashboard/')({
  component: Dashboard,
});

function Dashboard() {
  const { data: companiesData, isLoading: isLoadingCompanies } = useQueryCompaniesCount();
  const { data: agenciesData, isLoading: isLoadingAgencies } = useQueryAgenciesCount();
  const { data: workersData, isLoading: isLoadingWorkers } = useQueryWorkersCount();
  const { data: assignmentsData, isLoading: isLoadingAssignments } =
    useQueryWorkerAssignmentsCount();

  const statsCards = [
    {
      title: 'Empresas',
      value: companiesData?.data?.total,
      icon: IconBuilding,
      color: '#4648C0',
      loading: isLoadingCompanies,
      shared: true,
    },
    {
      title: 'Agencias',
      value: agenciesData?.data?.total,
      icon: IconBriefcase,
      color: '#6769C9',
      loading: isLoadingAgencies,
      shared: true,
    },
    {
      title: 'Trabajadores',
      value: workersData?.data?.total,
      icon: IconUsers,
      color: '#8A8CD4',
      loading: isLoadingWorkers,
      shared: false,
    },
    {
      title: 'Asignaciones',
      value: assignmentsData?.data?.total,
      icon: IconCalendarCheck,
      color: '#B3B5E1',
      loading: isLoadingAssignments,
      shared: false,
    },
  ];

  return (
    <Container fluid>
      <Stack gap='xl'>
        <Grid>
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Grid.Col key={stat.title} span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow='sm' padding='lg' radius='md' withBorder>
                  <Stack gap='xs'>
                    <Group justify='space-between'>
                      <Stack gap={4}>
                        <Text size='sm' c='dimmed' fw={500}>
                          {stat.title}
                        </Text>
                        {stat.shared && (
                          <Text size='xs' c='blue' fw={500}>
                            Datos compartidos
                          </Text>
                        )}
                      </Stack>
                      <Icon size={48} color={stat.color} stroke={1.5} />
                    </Group>
                    {stat.loading ? (
                      <Loader size='sm' />
                    ) : (
                      <Text size='xl' fw={700}>
                        {stat.value ?? 0}
                      </Text>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Stack>
    </Container>
  );
}
