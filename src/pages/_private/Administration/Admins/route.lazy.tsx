import { zodResolver } from '@hookform/resolvers/zod';
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  Modal,
  Select,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { createLazyFileRoute } from '@tanstack/react-router';
import type { MRT_ColumnDef, MRT_Row, MRT_TableInstance } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomTable } from '@/components/CustomTable';
import { useConfigTablePersist } from '@/hooks';
import { Role } from '@/models';
import { CreateAdminForm } from './-components';
import { useMutationDeleteAdmin, useMutationUpdateAdmin, useQueryAdmins } from './-hooks';
import { type Admin, type UpdateAdminRequest, UpdateAdminRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Admins')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: adminsData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryAdmins();

  const { mutate: updateAdmin, isPending: isUpdating } = useMutationUpdateAdmin();
  const { mutate: deleteAdmin, isPending: isDeleting } = useMutationDeleteAdmin();

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('admins');
  const {
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    handleSubmit,
    trigger,
  } = useForm<UpdateAdminRequest>({
    resolver: zodResolver(UpdateAdminRequestSchema),
    mode: 'onChange',
  });
  const columns = useMemo<MRT_ColumnDef<Admin>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 150,
        grow: true,
        enableEditing: true,
        mantineEditTextInputProps: ({ row }) => ({
          required: true,
          error: editingRowId === row.id ? errors.name?.message : undefined,
          onChange: async (event: React.ChangeEvent<HTMLInputElement>) => {
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
        size: 150,
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
        size: 120,
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
        accessorKey: 'role',
        header: 'Rol',
        size: 100,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const roleLabels: Record<Role, string> = {
            [Role.ADMIN]: 'Administrador Global',
            [Role.LOCAL]: 'Administrador Local',
            [Role.ONLY_READ]: 'Solo Lectura',
          };
          return <>{roleLabels[cell.getValue() as Role] || cell.getValue()}</>;
        },
        Edit: ({ row }) => (
          <Select
            required
            data={[
              { value: Role.ADMIN, label: 'Administrador Global' },
              { value: Role.LOCAL, label: 'Administrador Local' },
            ]}
            value={row._valuesCache.role as Role}
            onChange={(value) => {
              if (value) {
                setValue('role', value as Role);
                row._valuesCache.role = value as Role;
                trigger('role');
              }
            }}
            error={editingRowId === row.id ? errors.role?.message : undefined}
          />
        ),
      },
      {
        accessorKey: 'Locality',
        header: 'Localidad',
        size: 150,
        grow: true,
        enableEditing: false,
        Cell: ({ row }) => {
          const admin = row.original;
          if (admin.role === Role.ADMIN) {
            return '—';
          }
          return admin.Locality
            ? `${admin.Locality.name}, ${admin.Locality.province}`
            : 'Sin asignar';
        },
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

  const onSubmit = (data: UpdateAdminRequest, row: MRT_Row<Admin>, exitEditingMode: () => void) => {
    updateAdmin(
      { id: row.original.id, data },
      {
        onSuccess: () => {
          exitEditingMode();
          setEditingRowId(null);
          reset();
          clearErrors();
        },
        onError: (error) => {
          console.error('Error updating admin:', error);
        },
      }
    );
  };

  const handleEditingRowSave = async ({
    exitEditingMode,
    row,
  }: {
    exitEditingMode: () => void;
    row: MRT_Row<Admin>;
  }) => {
    // Usar handleSubmit de React Hook Form para validar y enviar
    await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
  };

  const handleEditingRowCancel = () => {
    setEditingRowId(null);
    reset();
    clearErrors();
  };

  const handleEditStart = ({ row }: { row: MRT_Row<Admin> }) => {
    setEditingRowId(row.id);
    // Setear los valores iniciales en el formulario y en la fila
    setValue('name', row.original.name);
    setValue('surname', row.original.surname);
    setValue('dni', row.original.dni);
    setValue('role', row.original.role);

    // Also set the row cache values for immediate feedback
    row._valuesCache.name = row.original.name;
    row._valuesCache.surname = row.original.surname;
    row._valuesCache.dni = row.original.dni;
    row._valuesCache.role = row.original.role;

    clearErrors();
  };

  const handleDeleteClick = (id: string) => {
    setAdminToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteAdmin(adminToDelete, {
        onSettled: () => {
          setDeleteModalOpened(false);
          setAdminToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setAdminToDelete(null);
  };
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Container fluid>
      <CreateAdminForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Administradores</Title>
          </>
        )}
        columns={columns}
        data={adminsData?.data ?? []}
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
        rowCount={adminsData?.pagination?.total ?? 0}
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
          row: MRT_Row<Admin>;
          table: MRT_TableInstance<Admin>;
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
          ¿Estás seguro de que quieres eliminar este administrador? Esta acción no se puede
          deshacer.
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
