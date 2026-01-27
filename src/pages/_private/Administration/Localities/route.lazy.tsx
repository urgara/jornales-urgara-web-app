import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable } from '@/components/CustomTable';
import { useConfigTablePersist } from '@/hooks';
import { CreateLocalityForm } from './-components';
import { useMutationDeleteLocality, useMutationUpdateLocality, useQueryLocalities } from './-hooks';
import { type Locality, type UpdateLocalityRequest, UpdateLocalityRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Localities')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: localitiesData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryLocalities();

  const { mutate: updateLocality, isPending: isUpdating } = useMutationUpdateLocality();
  const { mutate: deleteLocality, isPending: isDeleting } = useMutationDeleteLocality();

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [localityToDelete, setLocalityToDelete] = useState<number | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('localities');

  const {
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    handleSubmit,
    trigger,
  } = useForm<UpdateLocalityRequest>({
    resolver: zodResolver(UpdateLocalityRequestSchema),
    mode: 'onChange',
  });

  const columns = useMemo<MRT_ColumnDef<Locality>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 150,
        grow: true,
        enableEditing: true,
        mantineEditTextInputProps: ({ row }) => ({
          required: true,
          error: editingRowId === row.original.id ? errors.name?.message : undefined,
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
        accessorKey: 'province',
        header: 'Provincia',
        size: 150,
        grow: true,
        enableEditing: true,
        mantineEditTextInputProps: ({ row }) => ({
          required: true,
          error: editingRowId === row.original.id ? errors.province?.message : undefined,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setValue('province', event.target.value);
            row._valuesCache.province = event.target.value;
          },
          onBlur: () => {
            trigger('province');
          },
        }),
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha de Creación',
        size: 150,
        grow: true,
        enableEditing: false,
      },
      {
        accessorKey: 'deletedAt',
        header: 'Fecha de eliminación',
        size: 150,
        grow: true,
        enableEditing: false,
      },
    ],
    [editingRowId, errors, setValue, trigger]
  );

  const onSubmit = (
    data: UpdateLocalityRequest,
    row: MRT_Row<Locality>,
    exitEditingMode: () => void
  ) => {
    updateLocality(
      { id: row.original.id, data },
      {
        onSuccess: () => {
          exitEditingMode();
          setEditingRowId(null);
          reset();
          clearErrors();
        },
        onError: (error) => {
          console.error('Error updating locality:', error);
        },
      }
    );
  };

  const handleEditingRowSave = async ({
    exitEditingMode,
    row,
  }: {
    exitEditingMode: () => void;
    row: MRT_Row<Locality>;
  }) => {
    await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
  };

  const handleEditingRowCancel = () => {
    setEditingRowId(null);
    reset();
    clearErrors();
  };

  const handleEditStart = ({ row }: { row: MRT_Row<Locality> }) => {
    setEditingRowId(row.original.id);
    setValue('name', row.original.name);
    setValue('province', row.original.province);

    row._valuesCache.name = row.original.name;
    row._valuesCache.province = row.original.province;

    clearErrors();
  };

  const handleDeleteClick = (id: number) => {
    setLocalityToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (localityToDelete) {
      deleteLocality(localityToDelete, {
        onSettled: () => {
          setDeleteModalOpened(false);
          setLocalityToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setLocalityToDelete(null);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateLocalityForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Localidades</Title>
          </>
        )}
        columns={columns}
        data={localitiesData?.data ?? []}
        state={{
          isLoading,
          pagination,
          sorting,
          columnFilters,
          isSaving: isUpdating || isDeleting,
          columnOrder,
          columnVisibility,
        }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
        onColumnFiltersChange={setColumnFilters}
        onColumnOrderChange={setColumnOrder}
        onColumnVisibilityChange={setColumnVisibility}
        rowCount={localitiesData?.pagination?.total ?? 0}
        enableColumnFilters={true}
        enableGlobalFilter={false}
        enableSorting={true}
        enableColumnOrdering={true}
        enableColumnResizing={true}
        enableEditing={true}
        editDisplayMode='row'
        onEditingRowSave={handleEditingRowSave}
        onEditingRowCancel={handleEditingRowCancel}
        enableRowActions={true}
        renderRowActions={({
          row,
          table,
        }: {
          row: MRT_Row<Locality>;
          table: MRT_TableInstance<Locality>;
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
      />

      <Modal
        opened={deleteModalOpened}
        onClose={handleCancelDelete}
        title='Confirmar eliminación'
        centered
      >
        <Text mb='md'>
          ¿Estás seguro de que quieres eliminar esta localidad? Esta acción no se puede deshacer.
        </Text>
        <Group justify='flex-end'>
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
