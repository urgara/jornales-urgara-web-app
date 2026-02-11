import { zodResolver } from '@hookform/resolvers/zod';
import { ActionIcon, Button, Container, Flex, Group, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable } from '@/components';
import { useConfigTablePersist } from '@/hooks';
import { CreateTerminalForm } from './-components';
import { useMutationDeleteTerminal, useMutationUpdateTerminal, useQueryTerminals } from './-hooks';
import { type Terminal, type UpdateTerminalRequest, UpdateTerminalRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Terminals')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: terminalsData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryTerminals();

  const { mutate: updateTerminal, isPending: isUpdating } = useMutationUpdateTerminal();
  const { mutate: deleteTerminal, isPending: isDeleting } = useMutationDeleteTerminal();

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [terminalToDelete, setTerminalToDelete] = useState<string | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('terminals');

  const {
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    handleSubmit,
    trigger,
  } = useForm<UpdateTerminalRequest>({
    resolver: zodResolver(UpdateTerminalRequestSchema),
    mode: 'onChange',
  });

  const columns = useMemo<MRT_ColumnDef<Terminal>[]>(
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
    ],
    [editingRowId, errors, setValue, trigger]
  );

  const onSubmit = (
    data: UpdateTerminalRequest,
    row: MRT_Row<Terminal>,
    exitEditingMode: () => void
  ) => {
    updateTerminal(
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
    row: MRT_Row<Terminal>;
  }) => {
    await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
  };

  const handleEditingRowCancel = () => {
    setEditingRowId(null);
    reset();
    clearErrors();
  };

  const handleEditStart = ({ row }: { row: MRT_Row<Terminal> }) => {
    setEditingRowId(row.id);
    setValue('name', row.original.name);
    row._valuesCache.name = row.original.name;
    clearErrors();
  };

  const handleDeleteClick = (id: string) => {
    setTerminalToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (terminalToDelete) {
      deleteTerminal(
        { id: terminalToDelete },
        {
          onSettled: () => {
            setDeleteModalOpened(false);
            setTerminalToDelete(null);
          },
        }
      );
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setTerminalToDelete(null);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateTerminalForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Terminales</Title>
          </>
        )}
        enableRowActions
        renderRowActions={({
          row,
          table,
        }: {
          row: MRT_Row<Terminal>;
          table: MRT_TableInstance<Terminal>;
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
        data={terminalsData?.data || []}
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
        rowCount={terminalsData?.pagination?.total || 0}
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
        <Text>¿Estás seguro de que deseas eliminar este terminal?</Text>
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
