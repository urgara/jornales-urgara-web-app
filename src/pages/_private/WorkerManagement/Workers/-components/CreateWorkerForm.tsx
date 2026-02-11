import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, Select, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { WORKER_CATEGORY_OPTIONS, type Admin } from '@/models';
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
		control,
		formState: { errors },
	} = useForm<Omit<CreateWorkerRequest, 'localityId'>>({
		resolver: zodResolver(CreateWorkerRequestSchema.omit({ localityId: true })),
		defaultValues: {
			name: '',
			surname: '',
			dni: '',
			category: 'IDONEO',
		},
	});

	const onSubmit = (data: Omit<CreateWorkerRequest, 'localityId'>) => {
		// Asegurar que se use la localidad del admin
		const submitData: CreateWorkerRequest = {
			...data,
			localityId: admin?.localityId || '',
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

					<Controller
						name='category'
						control={control}
						render={({ field }) => (
							<Select
								label='Categoría'
								placeholder='Seleccione una categoría'
								data={WORKER_CATEGORY_OPTIONS}
								{...field}
								error={errors.category?.message}
								required
							/>
						)}
					/>

					<Button type='submit' loading={isPending} fullWidth>
						Crear trabajador
					</Button>
				</Stack>
			</form>
		</Modal>
	);
}
