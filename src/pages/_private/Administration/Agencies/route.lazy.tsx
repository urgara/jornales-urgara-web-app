import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import dayjs from 'dayjs';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateAgencyForm } from './-components';
import { useMutationDeleteAgency, useMutationUpdateAgency, useQueryAgencies } from './-hooks';
import { type Agency, type UpdateAgencyRequest, UpdateAgencyRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Agencies')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		data: agenciesData,
		isLoading,
		pagination,
		sorting,
		columnFilters,
		setPagination,
		setSorting,
		setColumnFilters,
	} = useQueryAgencies();

	const { mutate: updateAgency, isPending: isUpdating } = useMutationUpdateAgency();
	const { mutate: deleteAgency, isPending: isDeleting } = useMutationDeleteAgency();

	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [agencyToDelete, setAgencyToDelete] = useState<string | null>(null);
	const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
		useConfigTablePersist('agencies');

	const {
		formState: { errors },
		clearErrors,
		setValue,
		reset,
		handleSubmit,
		trigger,
	} = useForm<UpdateAgencyRequest>({
		resolver: zodResolver(UpdateAgencyRequestSchema),
		mode: 'onChange',
	});

	const columns = useMemo<MRT_ColumnDef<Agency>[]>(
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

	const onSubmit = (data: UpdateAgencyRequest, row: MRT_Row<Agency>, exitEditingMode: () => void) => {
		updateAgency(
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
		row: MRT_Row<Agency>;
	}) => {
		await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
	};

	const handleEditingRowCancel = () => {
		setEditingRowId(null);
		reset();
		clearErrors();
	};

	const handleEditStart = ({ row }: { row: MRT_Row<Agency> }) => {
		setEditingRowId(row.id);
		setValue('name', row.original.name);

		row._valuesCache.name = row.original.name;

		clearErrors();
	};

	const handleDeleteClick = (id: string) => {
		setAgencyToDelete(id);
		setDeleteModalOpened(true);
	};

	const handleConfirmDelete = () => {
		if (agencyToDelete) {
			deleteAgency(agencyToDelete, {
				onSettled: () => {
					setDeleteModalOpened(false);
					setAgencyToDelete(null);
				},
			});
		}
	};

	const handleCancelDelete = () => {
		setDeleteModalOpened(false);
		setAgencyToDelete(null);
	};

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Container fluid>
			<CreateAgencyForm opened={opened} onClose={close} />
			<CustomTable
				renderTopToolbarCustomActions={() => (
					<>
						<ActionIcon variant='filled' onClick={open}>
							<IconPlus size={18} />
						</ActionIcon>
						<Title order={1}>Agencias</Title>
					</>
				)}
				enableRowActions
				renderRowActions={({
					row,
					table,
				}: {
					row: MRT_Row<Agency>;
					table: MRT_TableInstance<Agency>;
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
				data={agenciesData?.data || []}
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
				rowCount={agenciesData?.pagination?.total || 0}
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
				<Text>¿Estás seguro de que deseas eliminar esta agencia?</Text>
				<Group mt='md' justify='flex-end'>
					<Button variant='outline' onClick={handleCancelDelete} disabled={isDeleting}>
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
