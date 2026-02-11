import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Container, Stack, Text, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
	AgencySelect,
	CompanySelect,
	CustomTable,
	LocalitySelect,
	ProductSelect,
	TerminalSelect,
	WorkerSelect,
	WorkShiftSelect,
} from '@/components';
import {
	useConfigTablePersist,
	useQuerySelectAgencies,
	useQuerySelectCompanies,
	useQuerySelectLocalities,
	useQuerySelectProducts,
	useQuerySelectWorkers,
	useQuerySelectWorkShifts,
} from '@/hooks';
import { getWorkerCategoryLabel } from '@/models';
import { useQuerySelectTerminals } from '@/hooks/useQuerySelectTerminals';
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
	const { getLocalityName } = useQuerySelectLocalities();
	const { data: companiesData } = useQuerySelectCompanies();
	const { data: agenciesData } = useQuerySelectAgencies();
	const { getTerminalName } = useQuerySelectTerminals();
	const { products } = useQuerySelectProducts();

	const getCompanyName = (id: string) => {
		const company = companiesData?.data?.find((c) => c.id === id);
		return company ? company.name : 'Empresa desconocida';
	};

	const getAgencyName = (id: string) => {
		const agency = agenciesData.find((a: { id: string; name: string }) => a.id === id);
		return agency ? agency.name : 'Agencia desconocida';
	};

	const getProductName = (id: string) => {
		const product = products.find((p) => p.id === id);
		return product ? product.name : 'Producto desconocido';
	};

	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
		useConfigTablePersist('worker-assignments');

	// Ocultar createdAt por defecto si no hay configuración guardada
	const initialColumnVisibility = useMemo(() => {
		if (Object.keys(columnVisibility).length === 0) {
			return { createdAt: false };
		}
		return columnVisibility;
	}, [columnVisibility]);

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
				accessorKey: 'category',
				header: 'Categoría',
				size: 120,
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const category = cell.getValue<string>();
					return getWorkerCategoryLabel(category as 'IDONEO' | 'PERITO');
				},
			},
			{
				accessorKey: 'coefficient',
				header: 'Coeficiente',
				size: 120,
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
			},
			{
				accessorKey: 'baseValue',
				header: 'Valor Base',
				size: 120,
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const value = cell.getValue<string>();
					return `$${value}`;
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
				accessorKey: 'localityId',
				header: 'Localidad',
				size: 200,
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const localityId = cell.getValue<string>();
					return getLocalityName(localityId);
				},
				Edit: ({ row }) => (
					<LocalitySelect
						required
						value={row._valuesCache.localityId}
						onChange={(value) => {
							if (value) {
								setValue('localityId', value);
								row._valuesCache.localityId = value;
								trigger('localityId');
							}
						}}
						error={editingRowId === row.original.id ? errors.localityId?.message : undefined}
					/>
				),
				Filter: ({ column }) => (
					<LocalitySelect
						value={column.getFilterValue() as string | undefined}
						onChange={(value) => column.setFilterValue(value)}
						placeholder='Filtrar por localidad'
						clearable
					/>
				),
			},
			{
				accessorKey: 'agencyId',
				header: 'Agencia',
				size: 200,
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const agencyId = cell.getValue<string>();
					return getAgencyName(agencyId);
				},
				Edit: ({ row }) => (
					<AgencySelect
						required
						value={row._valuesCache.agencyId}
						onChange={(value) => {
							if (value) {
								setValue('agencyId', value);
								row._valuesCache.agencyId = value;
								trigger('agencyId');
							}
						}}
						error={editingRowId === row.original.id ? errors.agencyId?.message : undefined}
					/>
				),
				Filter: ({ column }) => (
					<AgencySelect
						value={column.getFilterValue() as string | undefined}
						onChange={(value) => column.setFilterValue(value)}
						placeholder='Filtrar por agencia'
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
				accessorKey: 'additionalPercent',
				header: 'Premio/Castigo',
				size: 150,
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const percent = cell.getValue<string | null>();
					if (!percent) return '—';
					const num = Number.parseFloat(percent);
					const color = num > 0 ? 'var(--mantine-color-green-9)' : num < 0 ? 'var(--mantine-color-red-9)' : undefined;
					return <Text style={{ color, fontWeight: num !== 0 ? 600 : undefined }}>{percent}%</Text>;
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
				header: 'Monto Total (Bruto)',
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
			getWorkerFullName,
			getWorkShiftDescription,
			getCompanyName,
			getLocalityName,
			getAgencyName,
			getTerminalName,
			getProductName,
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
		setValue('workerId', row.original.workerId);
		setValue('workShiftId', row.original.workShiftId);
		setValue('date', row.original.date);
		setValue('companyId', row.original.companyId);
		setValue('localityId', row.original.localityId);
		setValue('agencyId', row.original.agencyId);
		setValue('terminalId', row.original.terminalId);
		setValue('productId', row.original.productId);
		setValue('additionalPercent', row.original.additionalPercent || undefined);

		row._valuesCache.workerId = row.original.workerId;
		row._valuesCache.workShiftId = row.original.workShiftId;
		row._valuesCache.date = row.original.date;
		row._valuesCache.companyId = row.original.companyId;
		row._valuesCache.localityId = row.original.localityId;
		row._valuesCache.agencyId = row.original.agencyId;
		row._valuesCache.terminalId = row.original.terminalId;
		row._valuesCache.productId = row.original.productId;
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
