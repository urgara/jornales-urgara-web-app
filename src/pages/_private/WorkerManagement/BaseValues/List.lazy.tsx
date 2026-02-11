import { ActionIcon, Container, NumberFormatter, Table, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef } from 'mantine-react-table';
import { useMemo } from 'react';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { getWorkerCategoryLabel, type WorkerCategory } from '@/models';
import { CreateBaseValueForm } from './-components';
import { useQueryBaseValues } from './-hooks';
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

  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('base-values');

  const columns = useMemo<MRT_ColumnDef<WorkShiftBaseValue>[]>(
    () => [
      {
        accessorKey: 'remunerated',
        header: 'Remunerado',
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
        header: 'No remunerado',
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
        enableExpandAll
        renderDetailPanel={({ row }) => {
          const calculatedValues = row.original.workShiftCalculatedValues;
          if (!calculatedValues?.length) return null;
          return (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Coeficiente</Table.Th>
                  <Table.Th>Remunerado</Table.Th>
                  <Table.Th>No remunerado</Table.Th>
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
    </Container>
  );
}
