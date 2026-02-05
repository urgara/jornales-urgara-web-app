import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { useForm } from 'react-hook-form';
import type { Admin } from '@/models';
import { useMutationCreateWorker } from '../-hooks';
import { type CreateWorkerRequest, CreateWorkerRequestSchema } from '../-models';

interface CreateWorkerFormProps {
	opened: boolean;
	onClose: () => void;
	admin: Admin | null;
}

export function CreateWorkerForm({ opened, onClose, admin }: CreateWorkerFormProps) {
	const { mutate: createWorker, isPending } = useMutationCreateWorker();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateWorkerRequest>({
		resolver: zodResolver(CreateWorkerRequestSchema),
		defaultValues: {
			name: '',
			surname: '',
			dni: '',
			localityId: admin?.localityId || (undefined as unknown as string),
			baseHourlyRate: '',
		},
	});

	const onSubmit = (data: CreateWorkerRequest) => {
		// Asegurar que se use la localidad del admin
		const submitData = {
			...data,
			localityId: admin?.localityId || data.localityId,
		};

		createWorker(submitData, {
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
		<Modal opened={opened} onClose={handleClose} title='Crear nuevo trabajador' centered size='md'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack>
					<TextInput
						label='Nombre'
						placeholder='Ingrese el nombre'
						{...register('name')}
						error={errors.name?.message}
						required
					/>

					<TextInput
						label='Apellido'
						placeholder='Ingrese el apellido'
						{...register('surname')}
						error={errors.surname?.message}
						required
					/>

					<TextInput
						label='DNI'
						placeholder='Ingrese el DNI'
						{...register('dni')}
						error={errors.dni?.message}
						required
					/>

					<TextInput
						label='Tarifa base por hora'
						placeholder='Ej: 1500.00'
						{...register('baseHourlyRate')}
						error={errors.baseHourlyRate?.message}
						required
					/>

					<Button type='submit' loading={isPending} fullWidth>
						Crear trabajador
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}
