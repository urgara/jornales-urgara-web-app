import { Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useQuerySelectLocalities } from '@/hooks';
import { Role } from '@/models';
import { useAuthStore } from '@/stores';
import { LocalitySelect } from './LocalitySelect';

export const HeaderLocalitySelector = () => {
  const admin = useAuthStore((store) => store.admin);
  const updateAdminLocality = useAuthStore((store) => store.updateAdminLocality);
  const { getLocalityName, data: localitiesData } = useQuerySelectLocalities();

  const handleLocalityChange = (value: string | null) => {
    if (value) {
      const locality = localitiesData?.data?.find((l) => l.id === value);
      updateAdminLocality(value, locality);
    }
  };

  // Si NO es ADMIN (es LOCAL o ONLY_READ), mostrar solo texto con la localidad fija
  if (admin?.role !== Role.ADMIN) {
    return (
      <Text c='white' fw={500} size='sm'>
        {admin?.localityId ? getLocalityName(admin.localityId) : 'Sin localidad asignada'}
      </Text>
    );
  }

  // Si es ADMIN sin localidad seleccionada, mostrar el select normal
  if (!admin.localityId) {
    return (
      <LocalitySelect
        placeholder='Selecciona localidad'
        value={null}
        onChange={handleLocalityChange}
        styles={{
          input: {
            minWidth: 200,
          },
        }}
      />
    );
  }

  // Si es ADMIN con localidad seleccionada, mostrar select estilizado como texto
  return (
    <LocalitySelect
      value={admin.localityId}
      onChange={handleLocalityChange}
      rightSection={<IconChevronDown size={16} color='white' />}
      styles={{
        input: {
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          fontWeight: 500,
          fontSize: '14px',
          cursor: 'pointer',
          minWidth: 150,
          paddingRight: 24,
        },
        section: {
          pointerEvents: 'none',
        },
      }}
    />
  );
};
