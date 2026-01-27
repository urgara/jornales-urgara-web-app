import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateWorkShiftForm } from './-components';
import { useMutationDeleteWorkShift, useQueryWorkShifts } from './-hooks';
import { DayOfWeek, type WorkShift } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/WorkShifts')({
  component: RouteComponent,
});

const DAY_LABELS: Record<DayOfWeek, string> = {
  [DayOfWeek.M]: 'L',
  [DayOfWeek.T]: 'M',
  [DayOfWeek.W]: 'X',
  [DayOfWeek.Th]: 'J',
  [DayOfWeek.F]: 'V',
  [DayOfWeek.S]: 'S',
  [DayOfWeek.Su]: 'D',
};

function RouteComponent() {
  const {
    data: workShiftsData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryWorkShifts();

  const { mutate: deleteWorkShift, isPending: isDeleting } = useMutationDeleteWorkShift();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [workShiftToDelete, setWorkShiftToDelete] = useState<string | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('work-shifts');

  const columns = useMemo<MRT_ColumnDef<WorkShift>[]>(
    () => [
      {
        accessorKey: 'description',
        header: 'Descripción',
        size: 200,
        grow: true,
        Cell: ({ cell }) => <>{cell.getValue() || '—'}</>,
      },
      {
        accessorKey: 'days',
        header: 'Días',
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const days = cell.getValue<DayOfWeek[]>();
          return days.map((day) => DAY_LABELS[day]).join(', ');
        },
      },
      {
        accessorKey: 'startTime',
        header: 'Hora Inicio',
        size: 100,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const time = new Date(cell.getValue<string>());
          return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        },
      },
      {
        accessorKey: 'endTime',
        header: 'Hora Fin',
        size: 100,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const time = new Date(cell.getValue<string>());
          return time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        },
      },
      {
        accessorKey: 'coefficient',
        header: 'Coeficiente',
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        size: 130,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'deletedAt',
        header: 'Fecha de Eliminación',
        size: 150,
        enableColumnFilter: false,
        Cell: ({ cell }) => <>{cell.getValue() || '—'}</>,
      },
    ],
    []
  );

  const handleDeleteClick = (id: string) => {
    setWorkShiftToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (workShiftToDelete) {
      deleteWorkShift(workShiftToDelete, {
        onSettled: () => {
          setDeleteModalOpened(false);
          setWorkShiftToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setWorkShiftToDelete(null);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateWorkShiftForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <Group>
            <Title order={2}>Turnos de Trabajo</Title>
            <Button onClick={open} leftSection={<IconPlus size={16} />}>
              Crear Turno
            </Button>
          </Group>
        )}
        enableRowActions
        renderRowActions={({ row }) => (
          <Flex gap='xs'>
            <ActionIcon
              variant='subtle'
              color='red'
              onClick={() => handleDeleteClick(row.original.id)}
              disabled={isDeleting}
            >
              <IconTrash size={18} />
            </ActionIcon>
          </Flex>
        )}
        columns={columns}
        data={workShiftsData?.data || []}
        state={{
          isLoading,
          columnVisibility,
          columnOrder,
          pagination,
          sorting,
          columnFilters,
        }}
        manualPagination
        manualSorting
        manualFiltering
        rowCount={workShiftsData?.pagination?.total || 0}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={setColumnVisibility}
        onColumnOrderChange={setColumnOrder}
        positionActionsColumn='last'
        enableSorting
        enableColumnFilters
        enableGlobalFilter={false}
        enableColumnOrdering
        enableColumnResizing
      />
      <Modal opened={deleteModalOpened} onClose={handleCancelDelete} title='Confirmar eliminación'>
        <Text>¿Estás seguro de que deseas eliminar este turno?</Text>
        <Group mt='md' justify='flex-end'>
          <Button variant='outline' onClick={handleCancelDelete}>
            Cancelar
          </Button>
          <Button color='red' onClick={handleConfirmDelete} loading={isDeleting}>
            Eliminar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}
