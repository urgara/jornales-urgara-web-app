import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { useMutationCreateAgency } from '../-hooks';
import { type CreateAgencyRequest, CreateAgencyRequestSchema } from '../-models';

interface CreateAgencyFormProps {
	opened: boolean;
	onClose: () => void;
}

export function CreateAgencyForm({ opened, onClose }: CreateAgencyFormProps) {
	const { mutate: createAgency, isPending } = useMutationCreateAgency();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateAgencyRequest>({
		resolver: zodResolver(CreateAgencyRequestSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = (data: CreateAgencyRequest) => {
		createAgency(data, {
			onSuccess: () => {
				reset();
				onClose();
			},
		});
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Modal opened={opened} onClose={handleClose} title='Nueva Agencia' centered>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<TextInput
						label='Nombre'
						placeholder='Ingrese el nombre de la agencia'
						{...register('name')}
						error={errors.name?.message}
						required
					/>

					<Button type='submit' loading={isPending} fullWidth>
						Crear Agencia
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}
