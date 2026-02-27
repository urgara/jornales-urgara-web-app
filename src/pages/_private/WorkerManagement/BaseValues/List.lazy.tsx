import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { getWorkerCategoryLabel, type WorkerCategory } from '@/models';
import { CreateBaseValueForm } from './-components';
import { useMutationDeleteBaseValue, useQueryBaseValues } from './-hooks';
import type { WorkShiftBaseValue } from './-models';

export const Route = createLazyFileRoute('/_private/WorkerManagement/BaseValues/List')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: baseValuesData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryBaseValues();

  const { mutate: deleteBaseValue, isPending: isDeleting } = useMutationDeleteBaseValue();

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [baseValueToDelete, setBaseValueToDelete] = useState<string | null>(null);

  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('base-values');

  const columns = useMemo<MRT_ColumnDef<WorkShiftBaseValue>[]>(
    () => [
      {
        accessorKey: 'remunerated',
        header: 'remunerativo',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <NumberFormatter value={value} prefix='$' thousandSeparator='.' decimalSeparator=',' />
          );
        },
      },
      {
        accessorKey: 'notRemunerated',
        header: 'No remunerativo',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <NumberFormatter value={value} prefix='$' thousandSeparator='.' decimalSeparator=',' />
          );
        },
      },
      {
        accessorKey: 'category',
        header: 'Categoría',
        size: 120,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => getWorkerCategoryLabel(cell.getValue<WorkerCategory>()),
      },
      {
        accessorKey: 'startDate',
        header: 'Fecha inicio',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return dayjs(date).format('DD/MM/YYYY');
        },
      },
      {
        accessorKey: 'endDate',
        header: 'Fecha fin',
        size: 150,
        grow: true,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return dayjs(date).format('DD/MM/YYYY');
        },
      },
    ],
    []
  );

  const handleDeleteClick = (id: string) => {
    setBaseValueToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (baseValueToDelete) {
      deleteBaseValue(baseValueToDelete, {
        onSettled: () => {
          setDeleteModalOpened(false);
          setBaseValueToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setBaseValueToDelete(null);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateBaseValueForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Valores base</Title>
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
        positionActionsColumn='last'
        enableExpandAll
        renderDetailPanel={({ row }) => {
          const calculatedValues = row.original.workShiftCalculatedValues;
          if (!calculatedValues?.length) return null;
          return (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Coeficiente</Table.Th>
                  <Table.Th>remunerativo</Table.Th>
                  <Table.Th>No remunerativo</Table.Th>
                  <Table.Th>Bruto</Table.Th>
                  <Table.Th>Neto</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {calculatedValues.map((cv) => (
                  <Table.Tr key={`${cv.workShiftBaseValueId}-${cv.coefficient}`}>
                    <Table.Td>{cv.coefficient.replace('.', ',')}</Table.Td>
                    <Table.Td>
                      <NumberFormatter
                        value={cv.remunerated}
                        prefix='$'
                        thousandSeparator='.'
                        decimalSeparator=','
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberFormatter
                        value={cv.notRemunerated}
                        prefix='$'
                        thousandSeparator='.'
                        decimalSeparator=','
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberFormatter
                        value={cv.gross}
                        prefix='$'
                        thousandSeparator='.'
                        decimalSeparator=','
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberFormatter
                        value={cv.net}
                        prefix='$'
                        thousandSeparator='.'
                        decimalSeparator=','
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          );
        }}
        columns={columns}
        data={baseValuesData?.data || []}
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
        rowCount={baseValuesData?.pagination?.total || 0}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={setColumnVisibility}
        onColumnOrderChange={setColumnOrder}
        enableSorting
        enableColumnFilters
        enableGlobalFilter={false}
        enableColumnOrdering
        enableColumnResizing
      />
      <Modal opened={deleteModalOpened} onClose={handleCancelDelete} title='Confirmar eliminación'>
        <Text>¿Estás seguro de que deseas eliminar este valor base?</Text>
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
