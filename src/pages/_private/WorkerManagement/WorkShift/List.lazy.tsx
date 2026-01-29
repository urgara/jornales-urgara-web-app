import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateWorkShiftForm } from './-components';
import { useMutationDeleteWorkShift, useQueryWorkShifts } from './-hooks';
import type { DayOfWeekType, WorkShift } from './-models';

export const Route = createLazyFileRoute('/_private/WorkerManagement/WorkShift/List')({
  component: RouteComponent,
});

const DAY_LABELS: Record<DayOfWeekType, string> = {
  M: 'Lu',
  T: 'Ma',
  W: 'Mi',
  Th: 'Ju',
  F: 'Vi',
  S: 'Sa',
  Su: 'Do',
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
        grow: true,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const days = cell.getValue<DayOfWeekType[]>();
          return days.map((day) => DAY_LABELS[day]).join(', ');
        },
      },
      {
        accessorKey: 'startTime',
        header: 'Hora Inicio',
        size: 100,
        grow: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'endTime',
        header: 'Hora Fin',
        size: 100,
        grow: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'durationMinutes',
        header: 'Duración',
        size: 120,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const minutes = cell.getValue<number>();
          const hours = Math.floor(minutes / 60);
          const mins = minutes % 60;
          return mins > 0 ? `${hours}:${mins.toString().padStart(2, '0')}hs` : `${hours}hs`;
        },
      },
      {
        accessorKey: 'coefficient',
        header: 'Coeficiente',
        size: 100,
        grow: true,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return dayjs(date).format('DD/MM/YYYY HH:mm');
        },
      },
      {
        accessorKey: 'deletedAt',
        header: 'Fecha de Eliminación',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const deletedAt = cell.getValue<string | null>();
          return deletedAt ? dayjs(deletedAt).format('DD/MM/YYYY HH:mm') : '—';
        },
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
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Turnos de Trabajo</Title>
          </>
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
