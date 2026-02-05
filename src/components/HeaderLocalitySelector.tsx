import { Text } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useQuerySelectLocalities } from '@/hooks';
import { Role } from '@/models';
import { useAuthStore } from '@/stores';
import { LocalitySelect } from './LocalitySelect';

export const HeaderLocalitySelector = () => {
	const admin = useAuthStore((store) => store.admin);
	const updateAdminLocality = useAuthStore((store) => store.updateAdminLocality);
	const { getLocalityName } = useQuerySelectLocalities();

	// Si no tiene localidad, mostrar el select normal
	if (!admin?.localityId) {
		return (
			<LocalitySelect
				placeholder='Selecciona localidad'
				value={null}
				onChange={(value) => {
					if (value) {
						updateAdminLocality(value);
					}
				}}
				styles={{
					input: {
						minWidth: 200,
					},
				}}
			/>
		);
	}

	// Si tiene localidad y NO es ADMIN, mostrar solo texto
	if (admin.role !== Role.ADMIN) {
		return (
			<Text c='white' fw={500} size='sm'>
				{getLocalityName(admin.localityId)}
			</Text>
		);
	}

	// Si tiene localidad y ES ADMIN, mostrar select estilizado como texto
	return (
		<LocalitySelect
			value={admin.localityId}
			onChange={(value) => {
				if (value) {
					updateAdminLocality(value);
				}
			}}
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
