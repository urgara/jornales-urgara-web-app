import { Select, type SelectProps } from '@mantine/core';
import { useQuerySelectTerminals } from '@/hooks';

type TerminalSelectProps = Omit<SelectProps, 'data'>;

export function TerminalSelect(props: TerminalSelectProps) {
	const { terminals, isLoading } = useQuerySelectTerminals();

	const data = terminals.map((terminal) => ({
		value: terminal.id,
		label: terminal.name,
	}));

	return <Select {...props} data={data} disabled={isLoading || props.disabled} />;
}
