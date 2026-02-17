import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Badge,
  Box,
  Container,
  NumberFormatter,
  Select,
  Stack,
  Switch,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconUsers } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CompanySelect,
  CustomTable,
  ProductSelect,
  ShipSelect,
  TerminalSelect,
  WorkShiftSelect,
} from '@/components';
import {
  useConfigTablePersist,
  useQuerySelectCompanies,
  useQuerySelectProducts,
  useQuerySelectShips,
  useQuerySelectTerminals,
  useQuerySelectWorkShifts,
  useQuerySelectWorkers,
} from '@/hooks';
import { getWorkerCategoryLabel } from '@/models';
import { useAuthStore } from '@/stores';
import { CreateWorkerAssignmentForm, EditWorkersModal } from './-components';
import { useMutationUpdateWorkerAssignment, useQueryWorkerAssignments } from './-hooks';
import {
  COMPANY_ROLE_OPTIONS,
  type UpdateWorkerAssignmentRequest,
  UpdateWorkerAssignmentRequestSchema,
  type WorkerAssignment,
  type WorkerDetail,
  getCompanyRoleLabel,
} from './-models';

export const Route = createLazyFileRoute('/_private/WorkerAssignments')({
  component: RouteComponent,
});

function RouteComponent() {
  const admin = useAuthStore((state) => state.admin);
  const {
    data: workerAssignmentsData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryWorkerAssignments();

  const { mutate: updateWorkerAssignment, isPending: isUpdating } =
    useMutationUpdateWorkerAssignment();

  const { getWorkShiftDescription } = useQuerySelectWorkShifts();
  const { getCompanyName } = useQuerySelectCompanies();
  const { getTerminalName } = useQuerySelectTerminals();
  const { getProductName } = useQuerySelectProducts();
  const { getShipName } = useQuerySelectShips();
  const { getWorkerFullName } = useQuerySelectWorkers();

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('worker-assignments');

  const initialColumnVisibility = useMemo(() => {
    if (Object.keys(columnVisibility).length === 0) {
      return { createdAt: false };
    }
    return columnVisibility;
  }, [columnVisibility]);

  const [editWorkersAssignment, setEditWorkersAssignment] = useState<WorkerAssignment | null>(null);
  const [editWorkersOpened, { open: openEditWorkers, close: closeEditWorkers }] =
    useDisclosure(false);

  const {
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    handleSubmit,
    trigger,
  } = useForm<UpdateWorkerAssignmentRequest>({
    resolver: zodResolver(UpdateWorkerAssignmentRequestSchema),
    mode: 'onChange',
  });

  const isCalculateJc = admin?.Locality?.isCalculateJc === true;

  const columns = useMemo<MRT_ColumnDef<WorkerAssignment>[]>(
    () => [
      {
        accessorKey: 'workShiftId',
        header: 'Turno',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const workShiftId = cell.getValue<string>();
          return getWorkShiftDescription(workShiftId);
        },
        Edit: ({ row }) => (
          <WorkShiftSelect
            required
            value={row._valuesCache.workShiftId}
            onChange={(value) => {
              if (value) {
                setValue('workShiftId', value);
                row._valuesCache.workShiftId = value;
                trigger('workShiftId');
              }
            }}
            error={editingRowId === row.original.id ? errors.workShiftId?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <WorkShiftSelect
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por turno'
            clearable
          />
        ),
      },
      {
        accessorKey: 'date',
        header: 'Fecha',
        size: 120,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return dayjs(date).format('DD/MM/YYYY');
        },
        Edit: ({ row }) => (
          <DateInput
            value={row._valuesCache.date ? new Date(row._valuesCache.date) : null}
            onChange={(value) => {
              if (value) {
                const year = value.getFullYear();
                const month = String(value.getMonth() + 1).padStart(2, '0');
                const day = String(value.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;
                setValue('date', dateString);
                row._valuesCache.date = dateString;
                trigger('date');
              }
            }}
            error={editingRowId === row.original.id ? errors.date?.message : undefined}
            valueFormat='DD/MM/YYYY'
            required
          />
        ),
        Filter: ({ column }) => {
          const filterValue = column.getFilterValue() as [string, string] | undefined;
          const dateFrom = filterValue?.[0] ? new Date(filterValue[0]) : null;
          const dateTo = filterValue?.[1] ? new Date(filterValue[1]) : null;

          return (
            <Stack gap='xs'>
              <DateInput
                label='Desde'
                placeholder='Fecha desde'
                value={dateFrom}
                onChange={(value) => {
                  if (value) {
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${day}`;
                    column.setFilterValue([dateString, filterValue?.[1] || '']);
                  } else {
                    column.setFilterValue(filterValue?.[1] ? ['', filterValue[1]] : undefined);
                  }
                }}
                valueFormat='DD/MM/YYYY'
                clearable
              />
              <DateInput
                label='Hasta'
                placeholder='Fecha hasta'
                value={dateTo}
                onChange={(value) => {
                  if (value) {
                    const year = value.getFullYear();
                    const month = String(value.getMonth() + 1).padStart(2, '0');
                    const day = String(value.getDate()).padStart(2, '0');
                    const dateString = `${year}-${month}-${day}`;
                    column.setFilterValue([filterValue?.[0] || '', dateString]);
                  } else {
                    column.setFilterValue(filterValue?.[0] ? [filterValue[0], ''] : undefined);
                  }
                }}
                valueFormat='DD/MM/YYYY'
                clearable
              />
            </Stack>
          );
        },
      },
      {
        accessorKey: 'companyId',
        header: 'Empresa',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const companyId = cell.getValue<string>();
          return getCompanyName(companyId);
        },
        Edit: ({ row }) => (
          <CompanySelect
            required
            value={row._valuesCache.companyId}
            onChange={(value) => {
              if (value) {
                setValue('companyId', value);
                row._valuesCache.companyId = value;
                trigger('companyId');
              }
            }}
            error={editingRowId === row.original.id ? errors.companyId?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <CompanySelect
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por empresa'
            clearable
          />
        ),
      },
      {
        accessorKey: 'companyRole',
        header: 'Rol empresa',
        size: 150,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const role = cell.getValue<'EXPORTER' | 'SURVEYOR'>();
          return (
            <Badge variant='light' color={role === 'EXPORTER' ? 'blue' : 'grape'}>
              {getCompanyRoleLabel(role)}
            </Badge>
          );
        },
        Edit: ({ row }) => (
          <Select
            required
            data={COMPANY_ROLE_OPTIONS as unknown as { value: string; label: string }[]}
            value={row._valuesCache.companyRole}
            onChange={(value) => {
              if (value) {
                setValue('companyRole', value as 'EXPORTER' | 'SURVEYOR');
                row._valuesCache.companyRole = value;
                trigger('companyRole');
              }
            }}
            error={editingRowId === row.original.id ? errors.companyRole?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <Select
            data={COMPANY_ROLE_OPTIONS as unknown as { value: string; label: string }[]}
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por rol'
            clearable
          />
        ),
      },
      {
        accessorKey: 'terminalId',
        header: 'Terminal',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const terminalId = cell.getValue<string>();
          return getTerminalName(terminalId);
        },
        Edit: ({ row }) => (
          <TerminalSelect
            required
            value={row._valuesCache.terminalId}
            onChange={(value) => {
              if (value) {
                setValue('terminalId', value);
                row._valuesCache.terminalId = value;
                trigger('terminalId');
              }
            }}
            error={editingRowId === row.original.id ? errors.terminalId?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <TerminalSelect
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por terminal'
            clearable
          />
        ),
      },
      {
        accessorKey: 'productId',
        header: 'Producto',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const productId = cell.getValue<string>();
          return getProductName(productId);
        },
        Edit: ({ row }) => (
          <ProductSelect
            required
            value={row._valuesCache.productId}
            onChange={(value) => {
              if (value) {
                setValue('productId', value);
                row._valuesCache.productId = value;
                trigger('productId');
              }
            }}
            error={editingRowId === row.original.id ? errors.productId?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <ProductSelect
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por producto'
            clearable
          />
        ),
      },
      {
        accessorKey: 'shipId',
        header: 'Barco',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ row }) => {
          return row.original.shipName || getShipName(row.original.shipId);
        },
        Edit: ({ row }) => (
          <ShipSelect
            required
            value={row._valuesCache.shipId}
            onChange={(value) => {
              if (value) {
                setValue('shipId', value);
                row._valuesCache.shipId = value;
                trigger('shipId');
              }
            }}
            error={editingRowId === row.original.id ? errors.shipId?.message : undefined}
          />
        ),
        Filter: ({ column }) => (
          <ShipSelect
            value={column.getFilterValue() as string | undefined}
            onChange={(value) => column.setFilterValue(value)}
            placeholder='Filtrar por barco'
            clearable
          />
        ),
      },
      {
        accessorKey: 'jc',
        header: 'JC',
        size: 80,
        grow: false,
        enableEditing: isCalculateJc,
        enableColumnFilter: false,
        Cell: ({ cell }) => {
          const jc = cell.getValue<boolean>();
          return jc ? (
            <Badge color='yellow' variant='light'>
              JC
            </Badge>
          ) : (
            '—'
          );
        },
        Edit: ({ row }) =>
          isCalculateJc ? (
            <Switch
              checked={row._valuesCache.jc}
              onChange={(event) => {
                setValue('jc', event.currentTarget.checked);
                row._valuesCache.jc = event.currentTarget.checked;
                trigger('jc');
              }}
              label={row._valuesCache.jc ? 'Sí' : 'No'}
            />
          ) : null,
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        size: 150,
        grow: true,
        enableEditing: false,
        enableColumnFilter: false,
        enableHiding: true,
        Cell: ({ cell }) => {
          const date = cell.getValue<string>();
          return dayjs(date).format('DD/MM/YYYY HH:mm');
        },
      },
    ],
    [
      editingRowId,
      errors,
      setValue,
      trigger,
      getWorkShiftDescription,
      getCompanyName,
      getTerminalName,
      getProductName,
      getShipName,
      isCalculateJc,
    ]
  );

  const onSubmit = (
    data: UpdateWorkerAssignmentRequest,
    row: MRT_Row<WorkerAssignment>,
    exitEditingMode: () => void
  ) => {
    updateWorkerAssignment(
      { id: row.original.id, data },
      {
        onSuccess: () => {
          exitEditingMode();
          setEditingRowId(null);
          reset();
          clearErrors();
        },
      }
    );
  };

  const handleEditingRowSave = async ({
    exitEditingMode,
    row,
  }: {
    exitEditingMode: () => void;
    row: MRT_Row<WorkerAssignment>;
  }) => {
    await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
  };

  const handleEditingRowCancel = () => {
    setEditingRowId(null);
    reset();
    clearErrors();
  };

  const handleEditStart = ({ row }: { row: MRT_Row<WorkerAssignment> }) => {
    setEditingRowId(row.original.id);
    setValue('workShiftId', row.original.workShiftId);
    setValue('date', row.original.date);
    setValue('companyId', row.original.companyId);
    setValue('companyRole', row.original.companyRole);
    setValue('terminalId', row.original.terminalId);
    setValue('productId', row.original.productId);
    setValue('shipId', row.original.shipId);
    setValue('jc', row.original.jc);

    row._valuesCache.workShiftId = row.original.workShiftId;
    row._valuesCache.date = row.original.date;
    row._valuesCache.companyId = row.original.companyId;
    row._valuesCache.companyRole = row.original.companyRole;
    row._valuesCache.terminalId = row.original.terminalId;
    row._valuesCache.productId = row.original.productId;
    row._valuesCache.shipId = row.original.shipId;
    row._valuesCache.jc = row.original.jc;

    clearErrors();
  };

  const handleEditWorkersClick = (assignment: WorkerAssignment) => {
    setEditWorkersAssignment(assignment);
    openEditWorkers();
  };

  const renderDetailPanel = ({ row }: { row: MRT_Row<WorkerAssignment> }) => {
    const workers: WorkerDetail[] = row.original.workers;
    if (!workers || workers.length === 0) {
      return (
        <Text size='sm' c='dimmed' p='md'>
          Sin trabajadores asignados
        </Text>
      );
    }

    return (
      <Box p='md'>
        <Stack gap='xs'>
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text fw={600} size='sm'>
              Trabajadores ({workers.length})
            </Text>
            <ActionIcon
              variant='light'
              onClick={() => handleEditWorkersClick(row.original)}
            >
              <IconUsers size={16} />
            </ActionIcon>
          </Box>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Trabajador</Table.Th>
                <Table.Th>Categoría</Table.Th>
                <Table.Th>Coeficiente</Table.Th>
                <Table.Th>Valor Base ($)</Table.Th>
                <Table.Th>Premio/Castigo (%)</Table.Th>
                <Table.Th>Monto Total ($)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {workers.map((worker) => (
                <Table.Tr key={worker.id}>
                  <Table.Td>{getWorkerFullName(worker.workerId)}</Table.Td>
                  <Table.Td>{getWorkerCategoryLabel(worker.category)}</Table.Td>
                  <Table.Td>{worker.coefficient}</Table.Td>
                  <Table.Td>
                    <NumberFormatter
                      value={worker.baseValue}
                      prefix='$'
                      thousandSeparator='.'
                      decimalSeparator=','
                    />
                  </Table.Td>
                  <Table.Td>
                    {worker.additionalPercent ? (
                      <Text
                        span
                        style={{
                          color:
                            Number(worker.additionalPercent) > 0
                              ? 'var(--mantine-color-green-9)'
                              : Number(worker.additionalPercent) < 0
                                ? 'var(--mantine-color-red-9)'
                                : undefined,
                          fontWeight:
                            Number(worker.additionalPercent) !== 0 ? 600 : undefined,
                        }}
                      >
                        <NumberFormatter
                          value={worker.additionalPercent}
                          suffix='%'
                          thousandSeparator='.'
                          decimalSeparator=','
                        />
                      </Text>
                    ) : (
                      '—'
                    )}
                  </Table.Td>
                  <Table.Td>
                    <NumberFormatter
                      value={worker.totalAmount}
                      prefix='$'
                      thousandSeparator='.'
                      decimalSeparator=','
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Box>
    );
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateWorkerAssignmentForm opened={opened} onClose={close} />
      {editWorkersAssignment && (
        <EditWorkersModal
          assignmentId={editWorkersAssignment.id}
          currentWorkers={editWorkersAssignment.workers}
          date={editWorkersAssignment.date}
          opened={editWorkersOpened}
          onClose={() => {
            closeEditWorkers();
            setEditWorkersAssignment(null);
          }}
        />
      )}
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Asignaciones de Trabajadores</Title>
          </>
        )}
        enableRowActions
        renderRowActions={({
          row,
          table,
        }: {
          row: MRT_Row<WorkerAssignment>;
          table: MRT_TableInstance<WorkerAssignment>;
        }) => (
          <ActionIcon
            variant='subtle'
            onClick={() => {
              handleEditStart({ row });
              table.setEditingRow(row);
            }}
            disabled={isUpdating}
          >
            <IconEdit size={18} />
          </ActionIcon>
        )}
        enableExpanding
        renderDetailPanel={renderDetailPanel}
        columns={columns}
        data={workerAssignmentsData?.data || []}
        state={{
          isLoading,
          columnVisibility: initialColumnVisibility,
          columnOrder,
          pagination,
          sorting,
          columnFilters,
        }}
        manualPagination
        manualSorting
        manualFiltering
        rowCount={workerAssignmentsData?.pagination?.total || 0}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnVisibilityChange={setColumnVisibility}
        onColumnOrderChange={setColumnOrder}
        editDisplayMode='row'
        positionActionsColumn='last'
        onEditingRowSave={handleEditingRowSave}
        onEditingRowCancel={handleEditingRowCancel}
        enableEditing
        enableSorting
        enableColumnFilters
        enableGlobalFilter={false}
        enableColumnOrdering
        enableColumnResizing
      />
    </Container>
  );
}
