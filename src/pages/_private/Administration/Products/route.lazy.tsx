import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Badge, Button, Container, Flex, Group, Modal, Switch, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateProductForm } from './-components';
import { useMutationDeleteProduct, useMutationUpdateProduct, useQueryProducts } from './-hooks';
import { type Product, type UpdateProductRequest, UpdateProductRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Products')({
	component: RouteComponent,
});

function RouteComponent() {
	const {
		data: productsData,
		isLoading,
		pagination,
		sorting,
		columnFilters,
		setPagination,
		setSorting,
		setColumnFilters,
	} = useQueryProducts();

	const { mutate: updateProduct, isPending: isUpdating } = useMutationUpdateProduct();
	const { mutate: deleteProduct, isPending: isDeleting } = useMutationDeleteProduct();

	const [editingRowId, setEditingRowId] = useState<string | null>(null);
	const [deleteModalOpened, setDeleteModalOpened] = useState(false);
	const [productToDelete, setProductToDelete] = useState<string | null>(null);
	const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
		useConfigTablePersist('products');

	const {
		formState: { errors },
		clearErrors,
		setValue,
		reset,
		handleSubmit,
		trigger,
	} = useForm<UpdateProductRequest>({
		resolver: zodResolver(UpdateProductRequestSchema),
		mode: 'onChange',
	});

	const columns = useMemo<MRT_ColumnDef<Product>[]>(
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
				accessorKey: 'isActive',
				header: 'Estado',
				size: 120,
				enableEditing: true,
				Cell: ({ cell }) => {
					const isActive = cell.getValue<boolean>();
					return (
						<Badge color={isActive ? 'green' : 'red'} variant='light'>
							{isActive ? 'Activo' : 'Inactivo'}
						</Badge>
					);
				},
				Edit: ({ row }) => (
					<Switch
						checked={row._valuesCache.isActive}
						onChange={(event) => {
							setValue('isActive', event.currentTarget.checked);
							row._valuesCache.isActive = event.currentTarget.checked;
							trigger('isActive');
						}}
						label={row._valuesCache.isActive ? 'Activo' : 'Inactivo'}
					/>
				),
			},
		],
		[editingRowId, errors, setValue, trigger]
	);

	const onSubmit = (data: UpdateProductRequest, row: MRT_Row<Product>, exitEditingMode: () => void) => {
		updateProduct(
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
		row: MRT_Row<Product>;
	}) => {
		await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
	};

	const handleEditingRowCancel = () => {
		setEditingRowId(null);
		reset();
		clearErrors();
	};

	const handleEditStart = ({ row }: { row: MRT_Row<Product> }) => {
		setEditingRowId(row.id);
		setValue('name', row.original.name);
		setValue('isActive', row.original.isActive);

		row._valuesCache.name = row.original.name;
		row._valuesCache.isActive = row.original.isActive;

		clearErrors();
	};

	const handleDeleteClick = (id: string) => {
		setProductToDelete(id);
		setDeleteModalOpened(true);
	};

	const handleConfirmDelete = () => {
		if (productToDelete) {
			deleteProduct(productToDelete, {
				onSettled: () => {
					setDeleteModalOpened(false);
					setProductToDelete(null);
				},
			});
		}
	};

	const handleCancelDelete = () => {
		setDeleteModalOpened(false);
		setProductToDelete(null);
	};

	const [opened, { open, close }] = useDisclosure(false);

	return (
		<Container fluid>
			<CreateProductForm opened={opened} onClose={close} />
			<CustomTable
				renderTopToolbarCustomActions={() => (
					<>
						<ActionIcon variant='filled' onClick={open}>
							<IconPlus size={18} />
						</ActionIcon>
						<Title order={1}>Productos</Title>
					</>
				)}
				enableRowActions
				renderRowActions={({
					row,
					table,
				}: {
					row: MRT_Row<Product>;
					table: MRT_TableInstance<Product>;
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
				data={productsData?.data || []}
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
				rowCount={productsData?.pagination?.total || 0}
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
				<Text>¿Estás seguro de que deseas eliminar este producto?</Text>
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
