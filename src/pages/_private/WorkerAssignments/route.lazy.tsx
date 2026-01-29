import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Container, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable, WorkerSelect, WorkShiftSelect } from '@/components';
import { useConfigTablePersist, useQuerySelectWorkers, useQuerySelectWorkShifts } from '@/hooks';
import { CreateWorkerAssignmentForm } from './-components';
import { useMutationUpdateWorkerAssignment, useQueryWorkerAssignments } from './-hooks';
import {
	type UpdateWorkerAssignmentRequest,
	UpdateWorkerAssignmentRequestSchema,
	type WorkerAssignment,
} from './-models';

export const Route = createLazyFileRoute('/_private/WorkerAssignments')({
	component: RouteComponent,
});

function RouteComponent() {
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

	const { getWorkerFullName } = useQuerySelectWorkers();
	const { getWorkShiftDescription } = useQuerySelectWorkShifts();

	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
		useConfigTablePersist('worker-assignments');

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

	const columns = useMemo<MRT_ColumnDef<WorkerAssignment>[]>(
		() => [
			{
				accessorKey: 'workerId',
				header: 'Trabajador',
				size: 200,
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const workerId = cell.getValue<string>();
					return getWorkerFullName(workerId);
				},
				Edit: ({ row }) => (
					<WorkerSelect
						required
						value={row._valuesCache.workerId}
						onChange={(value) => {
							if (value) {
								setValue('workerId', value);
								row._valuesCache.workerId = value;
								trigger('workerId');
							}
						}}
						error={editingRowId === row.original.id ? errors.workerId?.message : undefined}
					/>
				),
				Filter: ({ column }) => (
					<WorkerSelect
						value={column.getFilterValue() as string | undefined}
						onChange={(value) => column.setFilterValue(value)}
						placeholder='Filtrar por trabajador'
						clearable
					/>
				),
			},
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
				enableColumnFilter: false,
			},
			{
				accessorKey: 'additionalPercent',
				header: 'Porcentaje Adicional',
				size: 150,
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const percent = cell.getValue<string | null>();
					return percent ? `${percent}%` : '—';
				},
				mantineEditTextInputProps: ({ row }) => ({
					placeholder: 'Ej: 15.00',
					error:
						editingRowId === row.original.id ? errors.additionalPercent?.message : undefined,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						const value = event.target.value || undefined;
						setValue('additionalPercent', value);
						row._valuesCache.additionalPercent = value;
					},
					onBlur: () => {
						trigger('additionalPercent');
					},
				}),
				enableColumnFilter: false,
			},
			{
				accessorKey: 'totalAmount',
				header: 'Monto Total',
				size: 120,
				grow: true,
				enableEditing: false,
				Cell: ({ cell }) => {
					const amount = cell.getValue<string>();
					return `$${amount}`;
				},
				enableColumnFilter: false,
			},
			{
				accessorKey: 'createdAt',
				header: 'Fecha de Creación',
				size: 150,
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const date = cell.getValue<string>();
					return dayjs(date).format('DD/MM/YYYY HH:mm');
				},
			},
		],
		[editingRowId, errors, setValue, trigger, getWorkerFullName, getWorkShiftDescription]
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
		setValue('workerId', row.original.workerId);
		setValue('workShiftId', row.original.workShiftId);
		setValue('date', row.original.date);
		setValue('additionalPercent', row.original.additionalPercent || undefined);

		row._valuesCache.workerId = row.original.workerId;
		row._valuesCache.workShiftId = row.original.workShiftId;
		row._valuesCache.date = row.original.date;
		row._valuesCache.additionalPercent = row.original.additionalPercent;

		clearErrors();
	};

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Container fluid>
			<CreateWorkerAssignmentForm opened={opened} onClose={close} />
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
				columns={columns}
				data={workerAssignmentsData?.data || []}
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
