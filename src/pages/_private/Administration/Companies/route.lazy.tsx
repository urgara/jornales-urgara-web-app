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
import { CreateCompanyForm, LegalEntitySelect } from './-components';
import { useMutationDeleteCompany, useMutationUpdateCompany, useQueryCompanies } from './-hooks';
import { type Company, type UpdateCompanyRequest, UpdateCompanyRequestSchema } from './-models';

export const Route = createLazyFileRoute('/_private/Administration/Companies')({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: companiesData,
    isLoading,
    pagination,
    sorting,
    columnFilters,
    setPagination,
    setSorting,
    setColumnFilters,
  } = useQueryCompanies();

  const { mutate: updateCompany, isPending: isUpdating } = useMutationUpdateCompany();
  const { mutate: deleteCompany, isPending: isDeleting } = useMutationDeleteCompany();

  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const { columnVisibility, setColumnVisibility, columnOrder, setColumnOrder } =
    useConfigTablePersist('companies');
  const {
    formState: { errors },
    clearErrors,
    setValue,
    reset,
    handleSubmit,
    trigger,
  } = useForm<UpdateCompanyRequest>({
    resolver: zodResolver(UpdateCompanyRequestSchema),
    mode: 'onChange',
  });

  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nombre',
        size: 200,
        grow: true,
        enableEditing: true,
        mantineEditTextInputProps: ({ row }) => ({
          required: true,
          error: editingRowId === row.original.id ? errors.name?.message : undefined,
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
        accessorKey: 'cuit',
        header: 'CUIT',
        size: 130,
        grow: true,
        enableEditing: true,
        Cell: ({ cell }) => {
          const cuit = cell.getValue<string | null>();
          return cuit || '—';
        },
        mantineEditTextInputProps: ({ row }) => ({
          error: editingRowId === row.original.id ? errors.cuit?.message : undefined,
          onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value || null;
            setValue('cuit', value);
            row._valuesCache.cuit = value;
          },
          onBlur: () => {
            trigger('cuit');
          },
        }),
      },
      {
        accessorKey: 'LegalEntity',
        header: 'Entidad Legal',
        size: 200,
        grow: true,
        enableEditing: true,
        Cell: ({ row }) => {
          const company = row.original;
          return company.LegalEntity
            ? `${company.LegalEntity.abbreviation} - ${company.LegalEntity.description}`
            : 'Sin asignar';
        },
        Edit: ({ row }) => (
          <LegalEntitySelect
            required
            value={row._valuesCache.legalEntityId?.toString() || ''}
            onChange={(value) => {
              if (value) {
                setValue('legalEntityId', Number(value));
                row._valuesCache.legalEntityId = Number(value);
                trigger('legalEntityId');
              }
            }}
            error={editingRowId === row.original.id ? errors.legalEntityId?.message : undefined}
          />
        ),
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
        header: 'Fecha de Eliminación',
        size: 150,
        grow: true,
        enableEditing: false,
        Cell: ({ cell }) => {
          const deletedAt = cell.getValue<string | undefined>();
          return deletedAt || '—';
        },
      },
    ],
    [editingRowId, errors, setValue, trigger]
  );

  const onSubmit = (
    data: UpdateCompanyRequest,
    row: MRT_Row<Company>,
    exitEditingMode: () => void
  ) => {
    updateCompany(
      { id: row.original.id, company: data },
      {
        onSuccess: () => {
          exitEditingMode();
          setEditingRowId(null);
          reset();
          clearErrors();
        },
        onError: (error) => {
          console.error('Error updating company:', error);
        },
      }
    );
  };

  const handleEditingRowSave = async ({
    exitEditingMode,
    row,
  }: {
    exitEditingMode: () => void;
    row: MRT_Row<Company>;
  }) => {
    await handleSubmit((data) => onSubmit(data, row, exitEditingMode))();
  };

  const handleEditingRowCancel = () => {
    setEditingRowId(null);
    reset();
    clearErrors();
  };

  const handleEditStart = ({ row }: { row: MRT_Row<Company> }) => {
    setEditingRowId(row.original.id);
    setValue('name', row.original.name);
    setValue('cuit', row.original.cuit);
    setValue('legalEntityId', row.original.legalEntityId);

    row._valuesCache.name = row.original.name;
    row._valuesCache.cuit = row.original.cuit;
    row._valuesCache.legalEntityId = row.original.legalEntityId;

    clearErrors();
  };

  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (companyToDelete) {
      deleteCompany(companyToDelete, {
        onSettled: () => {
          setDeleteModalOpened(false);
          setCompanyToDelete(null);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setCompanyToDelete(null);
  };

  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container fluid>
      <CreateCompanyForm opened={opened} onClose={close} />
      <CustomTable
        renderTopToolbarCustomActions={() => (
          <>
            <ActionIcon variant='filled' onClick={open}>
              <IconPlus size={18} />
            </ActionIcon>
            <Title order={1}>Empresas</Title>
          </>
        )}
        enableRowActions
        renderRowActions={({
          row,
          table,
        }: {
          row: MRT_Row<Company>;
          table: MRT_TableInstance<Company>;
        }) => (
          <Flex gap='xs'>
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
        data={companiesData?.data || []}
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
        rowCount={companiesData?.pagination?.total || 0}
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
      <Modal opened={deleteModalOpened} onClose={handleCancelDelete} title='Confirmar eliminación'>
        <Text>¿Estás seguro de que deseas eliminar esta empresa?</Text>
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
