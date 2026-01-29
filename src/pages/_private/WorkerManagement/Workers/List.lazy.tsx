import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CompanySelect, CustomTable, LocalitySelect } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateWorkerForm } from './-components';
import { useMutationDeleteWorker, useMutationUpdateWorker, useQueryWorkers } from './-hooks';
import { type UpdateWorkerRequest, UpdateWorkerRequestSchema, type Worker } from './-models';

export const Route = createLazyFileRoute('/_private/WorkerManagement/Workers/List')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		data: workersData,
		isLoading,
		pagination,
		sorting,
		columnFilters,
		setPagination,
		setSorting,
		setColumnFilters,
	} = useQueryWorkers();

	const { mutate: updateWorker, isPending: isUpdating } = useMutationUpdateWorker();
	const { mutate: deleteWorker, isPending: isDeleting } = useMutationDeleteWorker();

	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
	const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
		useConfigTablePersist('workers');

	const {
		formState: { errors },
		clearErrors,
		setValue,
		reset,
		handleSubmit,
		trigger,
	} = useForm<UpdateWorkerRequest>({
		resolver: zodResolver(UpdateWorkerRequestSchema),
		mode: 'onChange',
	});

	const columns = useMemo<MRT_ColumnDef<Worker>[]>(
		() => [
			{
				accessorKey: 'name',
				header: 'Nombre',
				grow: true,
				enableEditing: true,
				mantineEditTextInputProps: ({ row }) => ({
					required: true,
					error: editingRowId === row.id ? errors.name?.message : undefined,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						setValue('name', event.target.value);
						row._valuesCache.name = event.target.value;
					},
					onBlur: () => {
						trigger('name');
					},
				}),
			},
			{
				accessorKey: 'surname',
				header: 'Apellido',
				grow: true,
				enableEditing: true,
				mantineEditTextInputProps: ({ row }) => ({
					required: true,
					error: editingRowId === row.id ? errors.surname?.message : undefined,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						setValue('surname', event.target.value);
						row._valuesCache.surname = event.target.value;
					},
					onBlur: () => {
						trigger('surname');
					},
				}),
			},
			{
				accessorKey: 'dni',
				header: 'DNI',
				grow: true,
				enableEditing: true,
				mantineEditTextInputProps: ({ row }) => ({
					required: true,
					error: editingRowId === row.id ? errors.dni?.message : undefined,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						setValue('dni', event.target.value);
						row._valuesCache.dni = event.target.value;
					},
					onBlur: () => {
						trigger('dni');
					},
				}),
			},
			{
				accessorKey: 'companyId',
				header: 'Empresa',
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const id = cell.getValue<number | null>();
					return id ? `Empresa #${id}` : '—';
				},
				Edit: ({ row }) => (
					<CompanySelect
						value={row._valuesCache.companyId?.toString()}
						onChange={(value) => {
							const companyId = value ? Number(value) : null;
							setValue('companyId', companyId);
							row._valuesCache.companyId = companyId;
							trigger('companyId');
						}}
						error={editingRowId === row.id ? errors.companyId?.message : undefined}
						clearable
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
				grow: true,
				enableEditing: true,
				Cell: ({ cell }) => {
					const id = cell.getValue<number>();
					return `Localidad #${id}`;
				},
				Edit: ({ row }) => (
					<LocalitySelect
						required
						value={row._valuesCache.localityId?.toString()}
						onChange={(value) => {
							if (value) {
								setValue('localityId', Number(value));
								row._valuesCache.localityId = Number(value);
								trigger('localityId');
							}
						}}
						error={editingRowId === row.id ? errors.localityId?.message : undefined}
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
				accessorKey: 'baseHourlyRate',
				header: 'Tarifa Base/Hora',
				grow: true,
				enableEditing: true,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const rate = cell.getValue<string>();
					return `$${rate}`;
				},
				mantineEditTextInputProps: ({ row }) => ({
					required: true,
					placeholder: 'Ej: 1500.00',
					error: editingRowId === row.id ? errors.baseHourlyRate?.message : undefined,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						setValue('baseHourlyRate', event.target.value);
						row._valuesCache.baseHourlyRate = event.target.value;
					},
					onBlur: () => {
						trigger('baseHourlyRate');
					},
				}),
			},
			{
				accessorKey: 'createdAt',
				header: 'Fecha de Creación',
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const date = cell.getValue<string>();
					return dayjs(date).format('DD/MM/YYYY HH:mm');
				},
			},
			{
				accessorKey: 'deletedAt',
				header: 'Fecha de Eliminación',
				grow: true,
				enableEditing: false,
				enableColumnFilter: false,
				Cell: ({ cell }) => {
					const deletedAt = cell.getValue<string | null>();
					return deletedAt ? dayjs(deletedAt).format('DD/MM/YYYY HH:mm') : '—';
				},
			},
		],
		[editingRowId, errors, setValue, trigger]
	);

	const onSubmit = (data: UpdateWorkerRequest, row: MRT_Row<Worker>, exitEditingMode: () => void) => {
		updateWorker(
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
		row: MRT_Row<Worker>;
	}) => {
		await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
	};

	const handleEditingRowCancel = () => {
		setEditingRowId(null);
		reset();
		clearErrors();
	};

	const handleEditStart = ({ row }: { row: MRT_Row<Worker> }) => {
		setEditingRowId(row.id);
		setValue('name', row.original.name);
		setValue('surname', row.original.surname);
		setValue('dni', row.original.dni);
		setValue('companyId', row.original.companyId);
		setValue('localityId', row.original.localityId);
		setValue('baseHourlyRate', row.original.baseHourlyRate);

		row._valuesCache.name = row.original.name;
		row._valuesCache.surname = row.original.surname;
		row._valuesCache.dni = row.original.dni;
		row._valuesCache.companyId = row.original.companyId;
		row._valuesCache.localityId = row.original.localityId;
		row._valuesCache.baseHourlyRate = row.original.baseHourlyRate;

		clearErrors();
	};

	const handleDeleteClick = (id: string) => {
		setWorkerToDelete(id);
		setDeleteModalOpened(true);
	};

	const handleConfirmDelete = () => {
		if (workerToDelete) {
			deleteWorker(workerToDelete, {
				onSettled: () => {
					setDeleteModalOpened(false);
					setWorkerToDelete(null);
				},
			});
		}
	};

	const handleCancelDelete = () => {
		setDeleteModalOpened(false);
		setWorkerToDelete(null);
	};

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Container fluid>
			<CreateWorkerForm opened={opened} onClose={close} />
			<CustomTable
				renderTopToolbarCustomActions={() => (
					<>
						<ActionIcon variant='filled' onClick={open}>
							<IconPlus size={18} />
						</ActionIcon>
						<Title order={1}>Trabajadores</Title>
					</>
				)}
				enableRowActions
				renderRowActions={({
					row,
					table,
				}: {
					row: MRT_Row<Worker>;
					table: MRT_TableInstance<Worker>;
				}) => (
					<Flex gap='xs'>
						<ActionIcon
							variant='subtle'
							onClick={() => {
								handleEditStart({ row });
								table.setEditingRow(row);
							}}
						>
							<IconEdit size={18} />
						</ActionIcon>
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
				data={workersData?.data || []}
				state={{
					isLoading,
					columnVisibility,
					columnOrder,
					pagination,
					sorting,
					columnFilters,
					isSaving: isUpdating || isDeleting,
				}}
				manualPagination
				manualSorting
				manualFiltering
				rowCount={workersData?.pagination?.total || 0}
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
				enableEditing={true}
				editDisplayMode='row'
				onEditingRowSave={handleEditingRowSave}
				onEditingRowCancel={handleEditingRowCancel}
			/>
			<Modal opened={deleteModalOpened} onClose={handleCancelDelete} title='Confirmar eliminación'>
				<Text>¿Estás seguro de que deseas eliminar este trabajador?</Text>
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
