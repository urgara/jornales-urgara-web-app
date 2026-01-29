import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import { CompanySelect, LocalitySelect } from '@/components';
import { useMutationCreateWorker } from '../-hooks';
import { type CreateWorkerRequest, CreateWorkerRequestSchema } from '../-models';

interface CreateWorkerFormProps {
	opened: boolean;
	onClose: () => void;
}

export function CreateWorkerForm({ opened, onClose }: CreateWorkerFormProps) {
	const { mutate: createWorker, isPending } = useMutationCreateWorker();

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<CreateWorkerRequest>({
		resolver: zodResolver(CreateWorkerRequestSchema),
		defaultValues: {
			name: '',
			surname: '',
			dni: '',
			localityId: undefined as unknown as number,
			baseHourlyRate: '',
		},
	});

	const onSubmit = (data: CreateWorkerRequest) => {
		createWorker(data, {
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
						name='companyId'
						control={control}
						render={({ field }) => (
							<CompanySelect
								label='Empresa'
								placeholder='Seleccione una empresa (opcional)'
								value={field.value?.toString()}
								onChange={(value) => field.onChange(value ? Number(value) : null)}
								onBlur={field.onBlur}
								error={errors.companyId?.message}
								clearable
							/>
						)}
					/>

					<Controller
						name='localityId'
						control={control}
						render={({ field }) => (
							<LocalitySelect
								label='Localidad'
								placeholder='Seleccione una localidad'
								value={field.value?.toString()}
								onChange={(value) => field.onChange(value ? Number(value) : undefined)}
								onBlur={field.onBlur}
								error={errors.localityId?.message}
								required
							/>
						)}
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
