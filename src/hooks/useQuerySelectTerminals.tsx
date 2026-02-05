import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores';
import { getSelectTerminals } from '@/services';

export function useQuerySelectTerminals() {
	const admin = useAuthStore((state) => state.admin);

	const { data, isLoading, error } = useQuery({
		queryKey: ['terminals', 'select', admin?.localityId],
		queryFn: () => {
			if (!admin?.localityId) throw new Error('Locality ID is required');
			return getSelectTerminals(admin.localityId);
		},
		enabled: !!admin?.localityId,
	});

	const getTerminalName = (terminalId: string) => {
		return data?.data.find((terminal) => terminal.id === terminalId)?.name ?? '';
	};

	return {
		terminals: data?.data ?? [],
		isLoading,
		error,
		getTerminalName,
	};
}
